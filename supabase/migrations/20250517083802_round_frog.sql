/*
  # Fix RLS policies for messages and storage

  1. Changes
    - Add RLS policy for messages table to allow users to insert messages linked to their chats
    - Add storage bucket policy for chat-attachments to allow authenticated users to upload files
    
  2. Security
    - Ensures users can only insert messages for chats they own
    - Allows authenticated users to upload attachments
    - Maintains existing security constraints
*/

-- First ensure the storage bucket exists and has RLS enabled
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the storage bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-attachments'
  AND auth.role() = 'authenticated'
);

-- Create storage policy to allow public access to uploaded files
CREATE POLICY "Allow public access to uploaded files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'chat-attachments');

-- Update messages table policies
CREATE POLICY "Users can insert messages for their chats"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chats
    WHERE chats.id = messages.chat_id
    AND chats.user_id = auth.uid()
  )
);