CREATE TABLE IF NOT EXISTS catalogs (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    "catalogName" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversation_participants (
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    is_blacklisted BOOLEAN NOT NULL DEFAULT FALSE,
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS catalog_chats (
    catalog_id INTEGER NOT NULL REFERENCES catalogs(id) ON DELETE CASCADE,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    PRIMARY KEY (catalog_id, conversation_id)
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_conversations_updated
BEFORE UPDATE ON conversations
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_messages_updated
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();