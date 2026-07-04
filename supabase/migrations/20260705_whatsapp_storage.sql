-- ============================================================
-- WhatsApp CRM — Supabase Storage Bucket for Attachments
-- Run this in Supabase SQL Editor AFTER 20260705_whatsapp_crm.sql
-- ============================================================

-- Create a public bucket for campaign attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'wa-attachments',
  'wa-attachments',
  true,
  26214400,   -- 25 MB per file
  ARRAY['image/jpeg','image/png','image/gif','image/webp','image/svg+xml',
        'video/mp4','video/webm','video/quicktime',
        'application/pdf','application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'audio/mpeg','audio/ogg','audio/wav']
)
ON CONFLICT (id) DO NOTHING;

-- Users can upload to their own folder: wa-attachments/{user_id}/...
CREATE POLICY "wa_attach_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'wa-attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Anyone can read (files are embedded in WhatsApp messages)
CREATE POLICY "wa_attach_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'wa-attachments');

-- Users can delete their own files
CREATE POLICY "wa_attach_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'wa-attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
