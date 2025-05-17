/*
  # Add storage policies for chat attachments

  1. Storage Policies
    - Enable authenticated users to upload files to chat-attachments bucket
    - Enable authenticated users to read files from chat-attachments bucket
    - Enable authenticated users to delete their own files
*/

-- Create storage bucket if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'chat-attachments'
  ) THEN
    INSERT INTO storage.buckets (id, name)
    VALUES ('chat-attachments', 'chat-attachments');
  END IF;
END $$;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for uploading files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'chat-attachments' 
    AND name = 'Authenticated users can upload files'
  ) THEN
    CREATE POLICY "Authenticated users can upload files"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'chat-attachments' AND
      (LOWER(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'txt', 'doc', 'docx', 'mp3', 'wav', 'ogg', 'mp4', 'webm'))
    );
  END IF;
END $$;

-- Policy for reading files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'chat-attachments' 
    AND name = 'Authenticated users can view files'
  ) THEN
    CREATE POLICY "Authenticated users can view files"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'chat-attachments');
  END IF;
END $$;

-- Policy for deleting files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'chat-attachments' 
    AND name = 'Users can delete own files'
  ) THEN
    CREATE POLICY "Users can delete own files"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'chat-attachments' AND
      auth.uid()::text = owner
    );
  END IF;
END $$;