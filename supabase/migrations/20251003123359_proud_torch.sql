/*
  # Initial Database Schema for Jowhara Collection E-commerce

  1. New Tables
    - `brands`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `logo_url` (text)
      - `created_at` (timestamp)
    
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `price` (decimal)
      - `image_url` (text)
      - `brand_id` (uuid, foreign key)
      - `category_id` (uuid, foreign key)
      - `stock` (integer)
      - `created_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, optional foreign key)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `total_amount` (decimal)
      - `status` (enum)
      - `order_type` (enum)
      - `created_at` (timestamp)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `price` (decimal)
    
    - `nav_links`
      - `id` (uuid, primary key)
      - `name` (text)
      - `url` (text)
      - `order_index` (integer)
      - `is_dropdown` (boolean)
      - `parent_id` (uuid, optional foreign key)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and public read access where appropriate
*/

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

-- Enable Row Level Security
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_links ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read brands" ON brands FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read categories" ON categories FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read products" ON products FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read nav_links" ON nav_links FOR SELECT TO anon USING (true);

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can manage brands" ON brands FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage categories" ON categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage products" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage orders" ON orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage order_items" ON order_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage nav_links" ON nav_links FOR ALL TO authenticated USING (true);

-- Insert sample data
INSERT INTO brands (name, description, logo_url) VALUES
('Chanel', 'Timeless elegance and French luxury', '/images/brands/chanel.png'),
('Dior', 'Sophistication and haute couture beauty', '/images/brands/dior.png'),
('Tom Ford', 'Modern luxury and bold sophistication', '/images/brands/tomford.png'),
('Versace', 'Italian glamour and vibrant luxury', '/images/brands/versace.png');

INSERT INTO categories (name, description) VALUES
('Perfumes', 'Luxury fragrances for men and women'),
('Skincare', 'Premium skincare products'),
('Makeup', 'High-end cosmetics and beauty products'),
('Hair Care', 'Professional hair care products'),
('Body Care', 'Luxury body care essentials'),
('Men''s Collection', 'Exclusive products for men');

INSERT INTO products (title, description, price, image_url, brand_id, category_id, stock) VALUES
('Chanel No. 5', 'Classic floral aldehyde fragrance that has captivated women for generations', 12000.00, 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM brands WHERE name = 'Chanel'), (SELECT id FROM categories WHERE name = 'Perfumes'), 50),
('Dior Sauvage', 'Fresh and raw composition with bergamot and pepper notes', 9500.00, 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM brands WHERE name = 'Dior'), (SELECT id FROM categories WHERE name = 'Perfumes'), 30),
('Tom Ford Black Orchid', 'Rich, dark and seductive fragrance with luxurious black truffle and ylang ylang', 15000.00, 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM brands WHERE name = 'Tom Ford'), (SELECT id FROM categories WHERE name = 'Perfumes'), 25),
('Versace Eros', 'Fresh, woody and oriental fragrance for the modern man', 8500.00, 'https://images.pexels.com/photos/1961790/pexels-photo-1961790.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM brands WHERE name = 'Versace'), (SELECT id FROM categories WHERE name = 'Perfumes'), 40),
('Chanel Hydra Beauty', 'Anti-aging premium formula with camellia extract', 7500.00, 'https://images.pexels.com/photos/3685523/pexels-photo-3685523.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM brands WHERE name = 'Chanel'), (SELECT id FROM categories WHERE name = 'Skincare'), 60),
('Dior Rouge Lipstick', 'Long-lasting matte finish with intense color payoff', 3500.00, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM brands WHERE name = 'Dior'), (SELECT id FROM categories WHERE name = 'Makeup'), 80);