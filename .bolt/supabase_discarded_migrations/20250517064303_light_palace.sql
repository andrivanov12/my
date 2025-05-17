/*
  # Fix Storage and Messages RLS

  1. Security Updates
    - Create storage bucket policies for chat attachments
    - Update messages table RLS policy
    
  2. Changes
    - Add storage.policy for authenticated users
    - Recreate messages policy with proper checks
*/

-- Create storage policy for authenticated users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Allow authenticated uploads'
  ) THEN
    INSERT INTO storage.policies (name, definition)
    VALUES (
      'Allow authenticated uploads',
      '(bucket_id = ''chat-attachments'' AND auth.role() = ''authenticated'')'
    );
  END IF;
END $$;

-- Ensure messages policy is correct
DROP POLICY IF EXISTS "Users can manage messages in their chats" ON messages;

CREATE POLICY "Users can manage messages in their chats"
ON messages FOR ALL
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