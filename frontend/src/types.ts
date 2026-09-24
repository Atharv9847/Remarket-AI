export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  profile_image?: string;
  bio?: string;
  role: string;
  status: string;
  response_rate: number;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
}

export interface UserTrust {
  user_id: number;
  name: string;
  profile_image?: string;
  member_since: string;
  email_verified: boolean;
  phone_verified: boolean;
  completed_transactions: number;
  average_rating: number;
  total_reviews: number;
  response_rate: number;
  active_listings_count: number;
}

export interface ProductImage {
  id: number;
  image_url: string;
  sort_order: number;
}

export interface Product {
  id: number;
  seller_id: number;
  title: string;
  description: string;
  category_id?: number;
  subcategory_id?: number;
  brand?: string;
  model?: string;
  year?: number;
  condition: string; // "Brand New", "Like New", "Good", "Fair", "Needs Repair"
  price: number;
  original_price?: number;
  negotiable: boolean;
  exchange_available: boolean;
  delivery_available: boolean;
  location?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  views: number;
  likes_count: number;
  tags?: string;
  attributes?: Record<string, any>;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
  seller?: User;
  category_name?: string;
  subcategory_name?: string;
  distance_km?: number;
  is_favorited?: boolean;
}

export interface ProductDetail extends Product {
  seller_trust?: UserTrust;
  similar_products?: Product[];
  price_recommendation?: {
    deal_verdict: string;
    fair_market_price: number;
    suggested_min: number;
    suggested_max: number;
    confidence_score: number;
    savings_vs_new: number;
  };
  risk_assessment?: {
    risk_level: string;
    is_flagged: boolean;
    warning_message?: string;
    risk_signals: string[];
  };
}

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  product_count: number;
  subcategories: Subcategory[];
}

export interface Offer {
  id: number;
  product_id: number;
  buyer_id: number;
  seller_id: number;
  amount: number;
  counter_amount?: number;
  note?: string;
  status: string;
  created_at: string;
  buyer?: User;
  seller?: User;
  product_title?: string;
  product_price?: number;
  product_image?: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  receiver_id: number;
  product_id?: number;
  message_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: number;
  product_id: number;
  buyer_id: number;
  seller_id: number;
  created_at: string;
  updated_at: string;
  last_message?: Message;
  other_user?: User;
  product_title?: string;
  product_image?: string;
  product_price?: number;
  unread_count: number;
}
