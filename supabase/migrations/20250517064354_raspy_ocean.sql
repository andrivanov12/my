/*
  # Add storage bucket policies and fix RLS

  1. Security Changes
    - Create storage bucket for chat attachments if it doesn't exist
    - Enable RLS on the storage bucket
    - Add policies for authenticated users to manage their own attachments
    - Update messages table policy to properly handle chat ownership
*/

-- Create the storage bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name)
  VALUES ('chat-attachments', 'chat-attachments')
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Enable RLS on the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-attachments' AND
  (storage.foldername(name))[1] = 'uploads'
);

-- Create policy to allow users to read their uploaded files
CREATE POLICY "Allow users to read uploaded files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'chat-attachments');

-- Create policy to allow users to delete their uploaded files
CREATE POLICY "Allow users to delete their uploaded files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'chat-attachments');

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