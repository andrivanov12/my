/*
  # Update messages table policies

  1. Changes
    - Add policies for messages table to control access
    - Only authenticated users can interact with their own chat messages

  2. Security
    - Policies ensure users can only access messages from their own chats
    - All operations (insert, select) are restricted by chat ownership
*/

-- Update messages table policies
BEGIN;
  -- Allow authenticated users to insert messages for their chats
  DROP POLICY IF EXISTS "Users can insert messages in their chats" ON public.messages;
  CREATE POLICY "Users can insert messages in their chats"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

  -- Allow authenticated users to read messages from their chats
  DROP POLICY IF EXISTS "Users can read messages from their chats" ON public.messages;
  CREATE POLICY "Users can read messages from their chats"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );
COMMIT;