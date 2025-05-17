/*
  # Add Storage and Messages RLS Policies

  1. Storage Policies
    - Enable authenticated users to upload files to chat-attachments bucket
    - Enable authenticated users to read files from chat-attachments bucket
  
  2. Messages Table Policies
    - Update messages policy to allow authenticated users to insert messages
    - Add policy for reading messages
    
  3. Changes
    - Add storage bucket policies for chat-attachments
    - Add insert and select policies for messages table
*/

-- Enable storage policies for chat-attachments bucket
BEGIN;
  -- Create policy to allow authenticated users to upload files
  CREATE POLICY "Allow authenticated users to upload files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'chat-attachments'
  );

  -- Create policy to allow authenticated users to read files
  CREATE POLICY "Allow authenticated users to read files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'chat-attachments'
  );
COMMIT;

-- Update messages table policies
BEGIN;
  -- Allow authenticated users to insert messages for their chats
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