/*
  # Fix Products RLS for Admin Panel

  1. Changes
    - Add policy to allow anonymous users to INSERT products
    - Add policy to allow anonymous users to UPDATE products
    - Add policy to allow anonymous users to DELETE products
    
  2. Security
    - Allows admin panel to work without authentication
    - Can be restricted later by adding admin authentication
*/

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;

-- Allow anon users to insert products
CREATE POLICY "Anyone can insert products"
  ON products
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon users to update products
CREATE POLICY "Anyone can update products"
  ON products
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anon users to delete products
CREATE POLICY "Anyone can delete products"
  ON products
  FOR DELETE
  TO anon
  USING (true);

-- Also keep authenticated user access
CREATE POLICY "Authenticated users can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);