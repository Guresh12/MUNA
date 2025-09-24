/*
  # Add Product Images and Ratings Support

  1. New Tables
    - `product_images`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `image_url` (text)
      - `is_primary` (boolean, default false)
      - `order_index` (integer, default 0)
      - `created_at` (timestamp)

  2. Table Updates
    - Add `rating` (decimal, default 0) to products table
    - Add `reviews_count` (integer, default 0) to products table

  3. Security
    - Enable RLS on product_images table
    - Add policies for public read and authenticated write access
*/

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  is_primary boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Add rating and reviews_count to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'rating'
  ) THEN
    ALTER TABLE products ADD COLUMN rating decimal(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'reviews_count'
  ) THEN
    ALTER TABLE products ADD COLUMN reviews_count integer DEFAULT 0 CHECK (reviews_count >= 0);
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Create policies for product_images
CREATE POLICY "Public can read product_images" ON product_images FOR SELECT TO anon USING (true);
CREATE POLICY "Authenticated users can manage product_images" ON product_images FOR ALL TO authenticated USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_order ON product_images(product_id, order_index);

-- Update sample products with ratings
UPDATE products SET rating = 4.8, reviews_count = 124 WHERE title = 'Chanel No. 5';
UPDATE products SET rating = 4.6, reviews_count = 89 WHERE title = 'Dior Sauvage';
UPDATE products SET rating = 4.9, reviews_count = 156 WHERE title = 'Tom Ford Black Orchid';
UPDATE products SET rating = 4.5, reviews_count = 78 WHERE title = 'Versace Eros';
UPDATE products SET rating = 4.7, reviews_count = 203 WHERE title = 'Chanel Hydra Beauty';
UPDATE products SET rating = 4.4, reviews_count = 67 WHERE title = 'Dior Rouge Lipstick';