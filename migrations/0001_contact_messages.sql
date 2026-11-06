CREATE TABLE IF NOT EXISTS contact_messages (
 id TEXT PRIMARY KEY,
 created_at TEXT NOT NULL,
 ciphertext TEXT NOT NULL,
 archived INTEGER NOT NULL DEFAULT 0 CHECK (archived IN (0,1))
);
CREATE INDEX IF NOT EXISTS contact_messages_retention ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS contact_messages_inbox ON contact_messages(archived,created_at DESC);
