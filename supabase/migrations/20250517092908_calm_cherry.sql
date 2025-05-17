/*
  # Update messages table policies

  1. Changes
    - Add more granular policies for messages table
    - Enable CRUD operations for authenticated users on their own messages

  2. Security
    - Each operation (insert, select, update, delete) has its own policy
    - All policies verify chat ownership through user ID
*/

-- Update messages table policies
BEGIN;
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can insert messages in their chats" ON messages;
  DROP POLICY IF EXISTS "Users can manage messages in their chats" ON messages;
  DROP POLICY IF EXISTS "Users can read messages from their chats" ON messages;

  -- Create new, more specific policies
  CREATE POLICY "Users can insert messages in their chats"
  ON messages FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

  CREATE POLICY "Users can read their chat messages"
  ON messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

  CREATE POLICY "Users can update their chat messages"
  ON messages FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

  CREATE POLICY "Users can delete their chat messages"
  ON messages FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );
COMMIT;