/*
  # Create Storage Buckets for Image Uploads

  1. Storage Setup
    - Create 'images' bucket for storing product, category, and brand images
    - Set up public access policies for the bucket
    - Allow authenticated users to upload images

  2. Security
    - Enable RLS on storage objects
    - Allow public read access to images
    - Allow authenticated users to upload images
*/

-- Create the images bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view images
CREATE POLICY "Public can view images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Authenticated users can update images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'images');