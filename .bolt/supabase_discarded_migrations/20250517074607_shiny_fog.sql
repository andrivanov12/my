/*
  # Fix RLS policies for chat messages and storage

  1. Changes
    - Add RLS policy for chat-attachments storage bucket
    - Update RLS policies for messages table to properly handle chat relationships
    - Add policy for authenticated users to upload files
  
  2. Security
    - Enable bucket-level security for chat-attachments
    - Ensure users can only access their own chat messages
    - Allow authenticated users to upload files to storage
*/

-- Enable storage RLS
BEGIN;
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('chat-attachments', 'chat-attachments', false)
  ON CONFLICT (id) DO NOTHING;

  -- Enable RLS on the bucket
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

  -- Create policy to allow authenticated users to upload files
  CREATE POLICY "Allow authenticated users to upload files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'chat-attachments');

  -- Allow authenticated users to read their uploaded files
  CREATE POLICY "Allow authenticated users to read files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'chat-attachments');
COMMIT;

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