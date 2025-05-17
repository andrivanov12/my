/*
  # Storage and Messages Policy Update

  1. Storage Changes
    - Create storage bucket for chat attachments
    - Add storage bucket policy for authenticated users

  2. Messages Policy Update
    - Recreate messages policy for better security
*/

-- Create storage bucket for chat attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket policy
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR ALL 
TO authenticated
USING (bucket_id = 'chat-attachments')
WITH CHECK (bucket_id = 'chat-attachments');

-- Ensure messages policy is correct
DROP POLICY IF EXISTS "Users can manage messages in their chats" ON messages;

CREATE POLICY "Users can manage messages in their chats"
ON messages FOR ALL
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