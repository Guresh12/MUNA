/*
  # Add Stock Status and Compare Price to Products

  1. Changes to Products Table
    - Add `in_stock` (boolean) - Indicates if product is in stock or sold out
      - Default: true
    - Add `compare_at_price` (numeric) - Original/strikethrough price for showing discounts
      - Optional field, null means no discount
      - Must be greater than or equal to price when set
  
  2. Notes
    - `in_stock` allows admins to manually mark products as sold out regardless of stock count
    - `compare_at_price` shows the original price when displaying sales/discounts
    - Both fields have sensible defaults and are nullable where appropriate
*/

-- Add in_stock column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'in_stock'
  ) THEN
    ALTER TABLE products ADD COLUMN in_stock boolean DEFAULT true;
  END IF;
END $$;

-- Add compare_at_price column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'compare_at_price'
  ) THEN
    ALTER TABLE products ADD COLUMN compare_at_price numeric(10,2) DEFAULT NULL;
  END IF;
END $$;

-- Create index for in_stock filtering
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);

-- Add check constraint to ensure compare_at_price is >= price if set
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