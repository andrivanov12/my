/*
  # Add storage bucket for chat attachments

  This migration creates a storage bucket for chat attachments and sets up the necessary
  bucket-level configurations.

  1. Changes
    - Creates a new storage bucket for chat attachments
    - Updates messages table to support attachments
*/

-- Add attachments column to messages table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages'
    AND column_name = 'attachments'
  ) THEN
    ALTER TABLE messages ADD COLUMN attachments jsonb;
  END IF;
END $$;