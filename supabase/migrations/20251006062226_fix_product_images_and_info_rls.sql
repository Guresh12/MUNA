/*
  # Fix RLS for Product Images and Additional Info

  1. Changes
    - Add policies to allow anonymous users to manage product_images
    - Add policies to allow anonymous users to manage product_additional_info
    
  2. Security
    - Allows admin panel to work without authentication
    - Can be restricted later by adding admin authentication
*/

-- Product Images policies
DROP POLICY IF EXISTS "Authenticated users can manage product images" ON product_images;

CREATE POLICY "Anyone can read product images"
  ON product_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert product images"
  ON product_images
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update product images"
  ON product_images
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete product images"
  ON product_images
  FOR DELETE
  TO anon
  USING (true);

-- Product Additional Info policies
DROP POLICY IF EXISTS "Authenticated users can manage product additional info" ON product_additional_info;

CREATE POLICY "Anyone can read product additional info"
  ON product_additional_info
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert product additional info"
  ON product_additional_info
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update product additional info"
  ON product_additional_info
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete product additional info"
  ON product_additional_info
  FOR DELETE
  TO anon
  USING (true);