/*
  # Add file attachments support
  
  1. Changes
    - Add attachments column to messages table to store file metadata
      - Uses JSONB type to store flexible file information
      - Includes file name, type, size, and URL
  
  2. Security
    - Maintain existing RLS policies
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'attachments'
  ) THEN
    ALTER TABLE messages 
    ADD COLUMN attachments JSONB;
  END IF;
END $$;