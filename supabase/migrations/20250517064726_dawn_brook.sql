/*
  # Add file attachment support to messages

  1. Changes
    - Add attachments column to messages table to store file metadata
    - Update RLS policies to ensure proper access control

  2. Security
    - Maintain existing RLS policies for messages
    - Ensure users can only access messages in their own chats
*/

-- Add attachments column to messages if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages'
    AND column_name = 'attachments'
  ) THEN
    ALTER TABLE messages ADD COLUMN attachments jsonb;
  END IF;
END $$;

-- Update messages policy to properly check chat ownership
DROP POLICY IF EXISTS "Users can manage messages in their chats" ON messages;

CREATE POLICY "Users can manage messages in their chats"
ON messages
FOR ALL
TO authenticated
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