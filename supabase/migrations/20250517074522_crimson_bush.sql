/*
  # Add storage and messages policies

  1. Storage Policies
    - Add policies for chat-attachments bucket if they don't exist
    - Allow authenticated users to upload and read files

  2. Messages Policies
    - Add policies for messages table if they don't exist
    - Allow users to insert and read messages in their chats
*/

DO $$ 
BEGIN
  -- Check and create storage policy for file uploads
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload files'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload files"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'chat-attachments');
  END IF;

  -- Check and create storage policy for file reads
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow authenticated users to read files'
  ) THEN
    CREATE POLICY "Allow authenticated users to read files"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'chat-attachments');
  END IF;

  -- Check and create policy for message insertion
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' 
    AND policyname = 'Users can insert messages in their chats'
  ) THEN
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
  END IF;

  -- Check and create policy for message reading
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' 
    AND policyname = 'Users can read messages from their chats'
  ) THEN
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
  END IF;
END $$;