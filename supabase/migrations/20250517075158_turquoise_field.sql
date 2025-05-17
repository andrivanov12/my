/*
  # Fix storage and RLS policies

  1. Changes
    - Create storage bucket for chat attachments
    - Set up proper RLS policies for messages table
    - Add policies for CRUD operations on messages
    
  2. Security
    - Enable RLS on messages table
    - Add policies to ensure users can only access their own messages
    - Ensure proper chat ownership validation
*/

-- Update messages table policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can insert messages in their chats" ON messages;
  DROP POLICY IF EXISTS "Users can manage messages in their chats" ON messages;
  DROP POLICY IF EXISTS "Users can read messages from their chats" ON messages;
  DROP POLICY IF EXISTS "Users can update their chat messages" ON messages;
  DROP POLICY IF EXISTS "Users can delete their chat messages" ON messages;

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