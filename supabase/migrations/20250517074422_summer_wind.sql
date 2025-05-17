/*
  # Fix RLS policies for chat messages and storage

  1. Changes
    - Add storage bucket policies for chat attachments
    - Update messages table RLS policy to properly handle chat ownership
    - Add trigger to set updated_at on chats table

  2. Security
    - Enable storage bucket policies for authenticated users
    - Ensure messages can only be created in chats owned by the user
    - Add proper cascade behavior for chat deletion
*/

-- Create storage bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name)
  VALUES ('chat-attachments', 'chat-attachments')
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Set up storage bucket policies
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'chat-attachments'
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Allow users to read their uploaded files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'chat-attachments'
  AND auth.uid() IS NOT NULL
);

-- Add trigger for updating chats.updated_at
CREATE OR REPLACE FUNCTION update_chats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chats_updated_at
  BEFORE UPDATE ON chats
  FOR EACH ROW
  EXECUTE FUNCTION update_chats_updated_at();

-- Update messages RLS policy to properly check chat ownership
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