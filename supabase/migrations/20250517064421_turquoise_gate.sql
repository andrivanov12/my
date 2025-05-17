/*
  # Update Messages Policy

  1. Changes
    - Recreate the messages policy to ensure proper chat ownership verification
    - Remove storage-related operations that require owner privileges

  2. Security
    - Ensure authenticated users can only manage messages in their own chats
*/

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