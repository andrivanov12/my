/*
  # Update messages table policies

  1. Changes
    - Drop and recreate all message table policies
    - Add proper error handling for existing policies
    - Ensure proper RLS for all CRUD operations

  2. Security
    - Policies ensure users can only access their own chat messages
    - All operations are properly authenticated
*/

DO $$ 
DECLARE
  policy_exists boolean;
BEGIN
  -- Check and drop insert policy
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'messages' 
    AND policyname = 'Users can insert messages in their chats'
  ) INTO policy_exists;
  
  IF policy_exists THEN
    DROP POLICY "Users can insert messages in their chats" ON messages;
  END IF;

  -- Check and drop read policy
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'messages' 
    AND policyname = 'Users can read their chat messages'
  ) INTO policy_exists;
  
  IF policy_exists THEN
    DROP POLICY "Users can read their chat messages" ON messages;
  END IF;

  -- Check and drop update policy
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'messages' 
    AND policyname = 'Users can update their chat messages'
  ) INTO policy_exists;
  
  IF policy_exists THEN
    DROP POLICY "Users can update their chat messages" ON messages;
  END IF;

  -- Check and drop delete policy
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'messages' 
    AND policyname = 'Users can delete their chat messages'
  ) INTO policy_exists;
  
  IF policy_exists THEN
    DROP POLICY "Users can delete their chat messages" ON messages;
  END IF;

  -- Create new policies
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
END $$;