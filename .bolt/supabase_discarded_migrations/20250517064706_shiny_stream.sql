/*
  # Add storage policies for chat attachments

  1. Changes
    - Create storage bucket for chat attachments
    - Add policies for authenticated users to manage their files
  
  2. Security
    - Enable bucket-level security
    - Add policies for:
      - Authenticated users can upload files
      - Authenticated users can read any file
      - Authenticated users can delete their own files
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'chat-attachments');

-- Policy to allow authenticated users to read any file
CREATE POLICY "Anyone can read chat attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'chat-attachments');

-- Policy to allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-attachments' 
  AND auth.uid()::text = owner
);