/*
  # Update message table RLS policies

  1. Changes
    - Drop existing message policies
    - Create new specific policies for CRUD operations
    - Each policy ensures users can only access messages from their own chats

  2. Security
    - Enable RLS on messages table
    - Policies check chat ownership through user_id
    - Separate policies for different operations (INSERT, SELECT, UPDATE, DELETE)
*/

-- Update messages table policies
DO $$ 
BEGIN
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
END $$;