/*
  # Create storage bucket for chat attachments

  1. New Storage Bucket
    - Creates a new storage bucket named 'chat-attachments'
    - Enables public access for authenticated users
  
  2. Security
    - Adds policies to allow authenticated users to:
      - Upload files to their own chat messages
      - Read files from chats they have access to
      - Delete their own uploaded files
*/

-- Create the storage bucket
insert into storage.buckets (id, name, public)
values ('chat-attachments', 'chat-attachments', false);

-- Policy to allow authenticated users to upload files
create policy "Users can upload files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'chat-attachments'
  and auth.uid() = owner
);

-- Policy to allow users to read files from their chats
create policy "Users can view files from their chats"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'chat-attachments'
  and auth.uid() = owner
);

-- Policy to allow users to delete their own files
create policy "Users can delete their own files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'chat-attachments'
  and auth.uid() = owner
);