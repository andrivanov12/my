/*
  # Update storage and message policies

  1. Changes
    - Add policies for chat-attachments bucket if they don't exist
    - Add message policies for authenticated users if they don't exist

  2. Security
    - Ensures authenticated users can upload and read files
    - Ensures users can only access messages from their own chats
*/

DO $$ 
BEGIN
  -- Create storage policies if they don't exist
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

  -- Create message policies if they don't exist
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