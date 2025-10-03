-- ============================================
-- MIGRATION INSTRUCTIONS FOR YOUR SUPABASE PROJECT
-- ============================================
-- Run these SQL commands in your Supabase SQL Editor
-- Go to: Your Supabase Dashboard → SQL Editor → New Query
-- Copy and paste each section, then click RUN

-- ============================================
-- MIGRATION 1: Initial Schema
-- ============================================

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  logo_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  price decimal(10,2) NOT NULL DEFAULT 0,
  image_url text DEFAULT '',
  brand_id uuid REFERENCES brands(id) ON DELETE SET NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  stock integer DEFAULT 0,
  rating decimal(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count integer DEFAULT 0 CHECK (reviews_count >= 0),
  in_stock boolean DEFAULT true,
  compare_at_price numeric(10,2) DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text DEFAULT '',
  customer_phone text DEFAULT '',
  total_amount decimal(10,2) NOT NULL DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered')),
  order_type text DEFAULT 'website' CHECK (order_type IN ('website', 'whatsapp')),
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  price decimal(10,2) NOT NULL DEFAULT 0
);

-- Create nav_links table
CREATE TABLE IF NOT EXISTS nav_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  order_index integer DEFAULT 0,
  is_dropdown boolean DEFAULT false,
  parent_id uuid REFERENCES nav_links(id) ON DELETE CASCADE
);

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  is_primary boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

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

-- ============================================
-- MIGRATION 2: Enable Row Level Security
-- ============================================

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE trending_perfumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_additional_info ENABLE ROW LEVEL SECURITY;

-- ============================================
-- MIGRATION 3: Create RLS Policies
-- ============================================

-- Policies for brands
CREATE POLICY "Public can read brands" ON brands FOR SELECT TO anon USING (true);
CREATE POLICY "Authenticated users can manage brands" ON brands FOR ALL TO authenticated USING (true);

-- Policies for categories
CREATE POLICY "Public can read categories" ON categories FOR SELECT TO anon USING (true);
CREATE POLICY "Authenticated users can manage categories" ON categories FOR ALL TO authenticated USING (true);

-- Policies for products
CREATE POLICY "Public can read products" ON products FOR SELECT TO anon USING (true);
CREATE POLICY "Authenticated users can manage products" ON products FOR ALL TO authenticated USING (true);

-- Policies for orders
CREATE POLICY "Authenticated users can manage orders" ON orders FOR ALL TO authenticated USING (true);

-- Policies for order_items
CREATE POLICY "Authenticated users can manage order_items" ON order_items FOR ALL TO authenticated USING (true);

-- Policies for nav_links
CREATE POLICY "Public can read nav_links" ON nav_links FOR SELECT TO anon USING (true);
CREATE POLICY "Authenticated users can manage nav_links" ON nav_links FOR ALL TO authenticated USING (true);

-- Policies for product_images
CREATE POLICY "Public can read product_images" ON product_images FOR SELECT TO anon USING (true);
CREATE POLICY "Authenticated users can manage product_images" ON product_images FOR ALL TO authenticated USING (true);

-- Policies for trending_perfumes
CREATE POLICY "Public can read trending_perfumes" ON trending_perfumes FOR SELECT TO anon USING (true);
CREATE POLICY "Authenticated users can manage trending_perfumes" ON trending_perfumes FOR ALL TO authenticated USING (true);

-- Policies for product_additional_info
CREATE POLICY "Public can read product_additional_info" ON product_additional_info FOR SELECT TO anon USING (true);
CREATE POLICY "Authenticated users can manage product_additional_info" ON product_additional_info FOR ALL TO authenticated USING (true);

-- ============================================
-- MIGRATION 4: Create Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_order ON product_images(product_id, order_index);
CREATE INDEX IF NOT EXISTS idx_trending_perfumes_product_id ON trending_perfumes(product_id);
CREATE INDEX IF NOT EXISTS idx_trending_perfumes_active ON trending_perfumes(is_active, order_index);
CREATE INDEX IF NOT EXISTS idx_product_additional_info_product_id ON product_additional_info(product_id);

-- ============================================
-- MIGRATION 5: Add Constraints
-- ============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'products_compare_at_price_check'
  ) THEN
    ALTER TABLE products
    ADD CONSTRAINT products_compare_at_price_check
    CHECK (compare_at_price IS NULL OR compare_at_price >= price);
  END IF;
END $$;

-- ============================================
-- MIGRATION 6: Storage Setup
-- ============================================

-- Create the images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public can view images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can update images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can delete images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'images');

-- ============================================
-- MIGRATION 7: Sample Data (Optional)
-- ============================================

-- Insert sample brands
INSERT INTO brands (name, description, logo_url) VALUES
('Chanel', 'Timeless elegance and French luxury', '/images/brands/chanel.png'),
('Dior', 'Sophistication and haute couture beauty', '/images/brands/dior.png'),
('Tom Ford', 'Modern luxury and bold sophistication', '/images/brands/tomford.png'),
('Versace', 'Italian glamour and vibrant luxury', '/images/brands/versace.png')
ON CONFLICT (name) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Perfumes', 'Luxury fragrances for men and women'),
('Skincare', 'Premium skincare products'),
('Makeup', 'High-end cosmetics and beauty products'),
('Hair Care', 'Professional hair care products'),
('Body Care', 'Luxury body care essentials'),
('Men''s Collection', 'Exclusive products for men')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (title, description, price, image_url, brand_id, category_id, stock, rating, reviews_count, in_stock) VALUES
('Chanel No. 5', 'Classic floral aldehyde fragrance that has captivated women for generations', 12000.00, 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM brands WHERE name = 'Chanel'), (SELECT id FROM categories WHERE name = 'Perfumes'), 50, 4.8, 124, true),
('Dior Sauvage', 'Fresh and raw composition with bergamot and pepper notes', 9500.00, 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM brands WHERE name = 'Dior'), (SELECT id FROM categories WHERE name = 'Perfumes'), 30, 4.6, 89, true),
('Tom Ford Black Orchid', 'Rich, dark and seductive fragrance with luxurious black truffle and ylang ylang', 15000.00, 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM brands WHERE name = 'Tom Ford'), (SELECT id FROM categories WHERE name = 'Perfumes'), 25, 4.9, 156, true),
('Versace Eros', 'Fresh, woody and oriental fragrance for the modern man', 8500.00, 'https://images.pexels.com/photos/1961790/pexels-photo-1961790.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM brands WHERE name = 'Versace'), (SELECT id FROM categories WHERE name = 'Perfumes'), 40, 4.5, 78, true),
('Chanel Hydra Beauty', 'Anti-aging premium formula with camellia extract', 7500.00, 'https://images.pexels.com/photos/3685523/pexels-photo-3685523.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM brands WHERE name = 'Chanel'), (SELECT id FROM categories WHERE name = 'Skincare'), 60, 4.7, 203, true),
('Dior Rouge Lipstick', 'Long-lasting matte finish with intense color payoff', 3500.00, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM brands WHERE name = 'Dior'), (SELECT id FROM categories WHERE name = 'Makeup'), 80, 4.4, 67, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- DONE!
-- ============================================
-- Your database is now ready with:
-- ✓ All tables created
-- ✓ Stock status (in_stock) field added
-- ✓ Compare at price (compare_at_price) field added
-- ✓ Row Level Security enabled
-- ✓ Policies configured
-- ✓ Storage bucket for images
-- ✓ Sample data (optional)
--
-- Next step: Update your .env file with your Supabase credentials
-- ============================================
