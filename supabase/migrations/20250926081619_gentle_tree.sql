/*
  # Create Trending Perfumes and Additional Product Information

  1. New Tables
    - `trending_perfumes`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `order_index` (integer)
      - `is_active` (boolean)
      - `created_at` (timestamp)
    
    - `product_additional_info`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `key` (text)
      - `value` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on new tables
    - Add policies for public read and authenticated write access
*/

-- Create trending_perfumes table
CREATE TABLE IF NOT EXISTS trending_perfumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create product_additional_info table
CREATE TABLE IF NOT EXISTS product_additional_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  key text NOT NULL,
  value text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE trending_perfumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_additional_info ENABLE ROW LEVEL SECURITY;

-- Create policies for trending_perfumes
CREATE POLICY "Public can read trending_perfumes" ON trending_perfumes FOR SELECT TO anon USING (true);
CREATE POLICY "Authenticated users can manage trending_perfumes" ON trending_perfumes FOR ALL TO authenticated USING (true);

-- Create policies for product_additional_info
CREATE POLICY "Public can read product_additional_info" ON product_additional_info FOR SELECT TO anon USING (true);
CREATE POLICY "Authenticated users can manage product_additional_info" ON product_additional_info FOR ALL TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trending_perfumes_product_id ON trending_perfumes(product_id);
CREATE INDEX IF NOT EXISTS idx_trending_perfumes_active ON trending_perfumes(is_active, order_index);
CREATE INDEX IF NOT EXISTS idx_product_additional_info_product_id ON product_additional_info(product_id);

-- Insert some sample trending perfumes
INSERT INTO trending_perfumes (product_id, order_index, is_active)
SELECT id, ROW_NUMBER() OVER (ORDER BY rating DESC), true
FROM products 
WHERE category_id = (SELECT id FROM categories WHERE name = 'Perfumes')
LIMIT 5;