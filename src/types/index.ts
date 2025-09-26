export interface Brand {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  brand_id: string;
  category_id: string;
  stock: number;
  created_at?: string;
  rating?: number;
  reviews_count?: number;
  brand?: Brand;
  category?: Category;
  product_images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  order_index: number;
  created_at?: string;
}

export interface TrendingPerfume {
  id: string;
  product_id: string;
  order_index: number;
  is_active: boolean;
  created_at?: string;
  product?: Product;
}

export interface ProductAdditionalInfo {
  id: string;
  product_id: string;
  key: string;
  value: string;
  created_at?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  created_at?: string;
}

export interface Order {
  id: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  order_type: 'website' | 'whatsapp';
  created_at?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface NavLink {
  id: string;
  name: string;
  url: string;
  order_index: number;
  is_dropdown: boolean;
  parent_id?: string;
}