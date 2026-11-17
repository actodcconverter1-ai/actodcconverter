"""Resume the public translation dictionaries locally; no network/API at inference time."""
import json
import os
import pathlib
import re
import sys
import time
import unicodedata
from collections import Counter

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.tools' / 'translation-python'))
os.environ.setdefault('CT2_PACKED_GEMM', '0')
os.environ.setdefault('CT2_USE_MKL', '0')
import ctranslate2
import sentencepiece

MODEL = ROOT / '.tools' / 'm2m100-int8'
tokenizer = sentencepiece.SentencePieceProcessor(model_file=str(MODEL / 'sentencepiece.bpe.model'))
translator = ctranslate2.Translator(str(MODEL), device='cpu', compute_type='int8', intra_threads=int(os.environ.get('ACDC_TRANSLATION_THREADS', '2')), inter_threads=1)
source = json.loads((ROOT / 'src/i18n/en.json').read_text(encoding='utf-8'))
catalogue = json.loads((ROOT / 'src/config/languages.json').read_text(encoding='utf-8'))
selected = sys.argv[1:]

def decode(texts, language):
    tokens = [['__en__'] + tokenizer.encode(text, out_type=str) + ['</s>'] for text in texts]
    if any(len(value) > 500 for value in tokens):
        output = []
        for text, encoded in zip(texts, tokens):
            if len(encoded) <= 500:
                output.extend(decode([text], language))
                continue
            pieces, current = [], []
            for word in text.split():
                if current and len(tokenizer.encode(' '.join(current + [word]))) > 450:
                    pieces.append(' '.join(current))
                    current = []
                current.append(word)
            if current:
                pieces.append(' '.join(current))
            output.append(' '.join(decode(pieces, language)))
        return output
    try:
        output = translator.translate_batch(tokens, target_prefix=[['__' + language + '__']] * len(tokens), beam_size=int(os.environ.get('ACDC_TRANSLATION_BEAM', '1')), max_batch_size=int(os.environ.get('ACDC_TRANSLATION_TOKEN_BATCH', '2048')), batch_type='tokens', max_decoding_length=min(768, max(96, 3 * max(map(len, tokens)))), max_input_length=512, repetition_penalty=1.1, no_repeat_ngram_size=5)
    except RuntimeError as error:
        if len(texts) < 2 or not any(word in str(error).lower() for word in ('memory', 'malloc', 'allocate')):
            raise
        midpoint = len(texts) // 2
        return decode(texts[:midpoint], language) + decode(texts[midpoint:], language)
    return [tokenizer.decode([t for t in item.hypotheses[0] if t not in ('</s>', '<s>') and not t.startswith('__')]).strip() for item in output]

def digits(text):
    text = ''.join(str(unicodedata.digit(char)) if char.isdigit() else char for char in text)
    text = text.replace('٫', '.').replace('٬', ',')
    text = re.sub(r'(?<=\d)[\s\u00a0\u202f]+(?=\d)', '', text)
    return sorted(re.sub(r'[.,]', '', value) for value in re.findall(r'\d+(?:[.,]\d+)*', text))

def numeric_values_preserved(text, result):
    original, translated = Counter(digits(text)), Counter(digits(result))
    if original - translated:
        return False
    words = {
        'zero':'0', 'nonzero':'0', 'one':'1', 'first':'1', 'primary':'1',
        'two':'2', 'second':'2', 'secondary':'2', 'twice':'2', 'double':'2',
        'three':'3', 'third':'3', 'four':'4', 'fourth':'4', 'five':'5',
        'fifth':'5', 'six':'6', 'sixth':'6', 'seven':'7', 'seventh':'7',
        'eight':'8', 'eighth':'8', 'nine':'9', 'ninth':'9', 'ten':'10',
        'january':'1', 'february':'2', 'march':'3', 'april':'4', 'may':'5',
        'june':'6', 'july':'7', 'august':'8', 'september':'9', 'october':'10',
        'november':'11', 'december':'12',
    }
    allowed = {value for word, value in words.items() if re.search(r'\b' + word + r'(?:s|d|ing)?\b', text.lower())}
    if re.search(r'\b(?:half|halve|square|squared)\b', text.lower()):
        allowed.update(('1','2','05'))
    if re.search(r'\b(?:quarter|fourth)\b', text.lower()):
        allowed.update(('1','4','025'))
    if re.search(r'\bmillion(?:fold)?\b', text.lower()):
        allowed.update(('1','10','100','1000000'))
    if re.search(r'\bthousand\b', text.lower()):
        allowed.update(('1','1000'))
    if re.search(r'\bper (?:second|cycle)\b', text.lower()):
        allowed.add('1')
    return all(value in allowed for value in translated - original)

def preserve_numbers(text, language):
    """Translate prose runs around immutable numeric literals if whole-sentence MT changes them."""
    parts = re.split(r'(\d+(?:[.,]\d+)*)', text)
    indexes = [i for i, part in enumerate(parts) if i % 2 == 0 and re.search(r'[A-Za-z]{2}', part)]
    translated = decode([parts[i].strip() for i in indexes], language)
    for i, value in zip(indexes, translated):
        leading = ' ' if parts[i][:1].isspace() else ''
        trailing = ' ' if parts[i][-1:].isspace() else ''
        parts[i] = leading + value + trailing
    return ''.join(parts)

for locale in catalogue['languages']:
    language = locale['code']
    if language == 'en' or selected and language not in selected:
        continue
    path = ROOT / 'src/i18n' / (language + '.json')
    dictionary = json.loads(path.read_text(encoding='utf-8')) if path.exists() else {}
    pending = sorted((key for key in source if not dictionary.get(key)), key=lambda text: len(tokenizer.encode(text)))
    print(language + ': ' + str(len(pending)) + ' pending', flush=True)
    started = time.time()
    batch_size = int(os.environ.get('ACDC_TRANSLATION_BATCH', '24'))
    for offset in range(0, len(pending), batch_size):
        batch = pending[offset:offset + batch_size]
        results = decode(batch, language)
        for text, result in zip(batch, results):
            if not numeric_values_preserved(text, result):
                result = preserve_numbers(text, language)
            if not result or len(text) > 120 and result == text:
                raise ValueError('Untranslated or empty content: ' + language + ': ' + text[:100])
            dictionary[text] = result
        temporary = path.with_suffix('.json.tmp')
        temporary.write_text(json.dumps(dictionary, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        temporary.replace(path)
        print(language + ' ' + str(min(offset + batch_size, len(pending))) + '/' + str(len(pending)) + ' elapsed ' + str(round(time.time() - started)) + 's', flush=True)
    print(language + ' complete', flush=True)
