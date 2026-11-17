"""Refine the Arabic dictionary with a local OPUS-MT English/Arabic model."""
import json
import pathlib
import re
import sys
import time
import unicodedata
from collections import Counter

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.tools/translation-python'))
import ctranslate2
import sentencepiece

model = ROOT / '.tools/opus-en-ar'
source_tokenizer = sentencepiece.SentencePieceProcessor(model_file=str(model / 'source.spm'))
target_tokenizer = sentencepiece.SentencePieceProcessor(model_file=str(model / 'target.spm'))
translator = ctranslate2.Translator(str(model), compute_type='int8', intra_threads=4, inter_threads=1)
source = json.loads((ROOT / 'src/i18n/en.json').read_text(encoding='utf-8'))
path = ROOT / 'src/i18n/ar.json'
dictionary = json.loads(path.read_text(encoding='utf-8'))
checkpoint = ROOT / 'artifacts/arabic-refinement-progress.json'
completed = set(json.loads(checkpoint.read_text(encoding='utf-8'))) if checkpoint.exists() else set()
review_path = ROOT / 'artifacts/arabic-refinement-review.json'
review = json.loads(review_path.read_text(encoding='utf-8')) if review_path.exists() else []


def numbers(text):
    text = ''.join(str(unicodedata.digit(c)) if c.isdigit() else c for c in text)
    text = re.sub(r'(?<=\d)[\s\u00a0\u202f]+(?=\d)', '', text).replace('٫', '.').replace('٬', ',')
    return Counter(re.sub(r'[.,]', '', n) for n in re.findall(r'\d+(?:[.,]\d+)*', text))


def parts(text):
    chunks = []
    for sentence in re.split(r'(?<=[.!?])\s+(?=[A-Z0-9“‘(])', text):
        current = ''
        for word in sentence.split():
            proposed = (current + ' ' + word).strip()
            if current and len(source_tokenizer.encode(proposed)) > 260:
                chunks.append(current)
                current = word
            else:
                current = proposed
        if current:
            chunks.append(current)
    return chunks


pending = sorted((key for key in source if key not in completed), key=lambda s: len(source_tokenizer.encode(s)))
started = time.time()
for offset in range(0, len(pending), 24):
    keys = pending[offset:offset + 24]
    batches = [parts(key) for key in keys]
    flat = [text for group in batches for text in group]
    results = translator.translate_batch(
        [['>>ara<<'] + source_tokenizer.encode(text, out_type=str) + ['</s>'] for text in flat],
        beam_size=4, max_batch_size=1024, batch_type='tokens',
        max_input_length=512, max_decoding_length=1024,
    )
    decoded = iter(target_tokenizer.decode(result.hypotheses[0]) for result in results)
    for key, group in zip(keys, batches):
        translated = ' '.join(next(decoded) for _ in group).strip()
        if re.match(r'^[A-Za-zθηΔ][A-Za-z0-9θηΔ_]*\s*[=≈]', key) or key == 'AC to DC Converter':
            translated = key
        if re.search(r'\brectif(?:ier|ication|iers)\b', key, re.I):
            translated = translated.replace('مصحح', 'مقوم').replace('المصحح', 'المقوم')
        reason = None
        if not translated or len(key) > 120 and translated == key:
            reason = 'empty or unchanged prose'
        elif numbers(key) - numbers(translated):
            reason = 'numeric literals need review'
        elif len(key) > 200 and len(translated) < len(key) * 0.38:
            reason = 'unexpectedly short translation'
        if reason:
            review.append({'source': key, 'candidate': translated, 'reason': reason})
        else:
            dictionary[key] = translated
        completed.add(key)
    temporary = path.with_suffix('.json.tmp')
    temporary.write_text(json.dumps(dictionary, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temporary.replace(path)
    checkpoint.write_text(json.dumps(sorted(completed), ensure_ascii=False), encoding='utf-8')
    review_path.write_text(json.dumps(review, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Arabic refinement {min(offset + 24, len(pending))}/{len(pending)}; review {len(review)}; {round(time.time() - started)}s', flush=True)
