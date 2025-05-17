/*
  # Fix RLS policies for messages table

  1. Changes
    - Add policy to allow users to insert messages for their own chats
    - Ensure proper security for message creation

  2. Security
    - Users can only insert messages for chats they own
    - Maintains existing RLS policies
*/

-- Add policy for inserting messages
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