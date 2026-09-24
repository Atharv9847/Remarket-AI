import type { Product, ProductDetail, Category, Offer, Conversation, Message, User } from './types';

const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('remarket_token');
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('remarket_token', token);
  } else {
    localStorage.removeItem('remarket_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: { name: string; email: string; password: string; phone?: string; location?: string }) =>
    request<{ access_token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () => request<User>('/auth/me'),

  getUserTrust: (userId: number) => request<any>(`/auth/users/${userId}/trust`),

  // Categories
  getCategories: () => request<Category[]>('/categories'),

  // Products
  getProducts: (params?: {
    q?: string;
    category_id?: number;
    condition?: string;
    min_price?: number;
    max_price?: number;
    sort_by?: string;
    exchange_available?: boolean;
    negotiable?: boolean;
  }) => {
    const query = new URLSearchParams();
    if (params?.q) query.append('q', params.q);
    if (params?.category_id) query.append('category_id', params.category_id.toString());
    if (params?.condition && params.condition !== 'All') query.append('condition', params.condition);
    if (params?.min_price !== undefined) query.append('min_price', params.min_price.toString());
    if (params?.max_price !== undefined) query.append('max_price', params.max_price.toString());
    if (params?.sort_by) query.append('sort_by', params.sort_by);
    if (params?.exchange_available !== undefined) query.append('exchange_available', String(params.exchange_available));
    if (params?.negotiable !== undefined) query.append('negotiable', String(params.negotiable));

    return request<Product[]>(`/products?${query.toString()}`);
  },

  getProduct: (id: number) => request<ProductDetail>(`/products/${id}`),

  createProduct: (data: any) =>
    request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  toggleFavorite: (productId: number) =>
    request<{ favorited: boolean; likes_count: number }>(`/products/${productId}/favorite`, {
      method: 'POST',
    }),

  getFavorites: () => request<Product[]>('/products/favorites'),

  // Offers
  createOffer: (productId: number, amount: number, note?: string) =>
    request<Offer>('/offers', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, amount, note }),
    }),

  getOffers: (type: 'all' | 'made' | 'received' = 'all') => request<Offer[]>(`/offers?type=${type}`),

  acceptOffer: (offerId: number) =>
    request<Offer>(`/offers/${offerId}/accept`, {
      method: 'PUT',
    }),

  counterOffer: (offerId: number, counter_amount: number, note?: string) =>
    request<Offer>(`/offers/${offerId}/counter`, {
      method: 'PUT',
      body: JSON.stringify({ counter_amount, note }),
    }),

  rejectOffer: (offerId: number) =>
    request<Offer>(`/offers/${offerId}/reject`, {
      method: 'PUT',
    }),

  // Chat
  getConversations: () => request<Conversation[]>('/chat/conversations'),

  getMessages: (conversationId: number) => request<Message[]>(`/chat/conversations/${conversationId}/messages`),

  sendMessage: (receiverId: number, message: string, productId?: number, conversationId?: number) =>
    request<Message>('/chat/messages', {
      method: 'POST',
      body: JSON.stringify({
        receiver_id: receiverId,
        message,
        product_id: productId,
        conversation_id: conversationId,
      }),
    }),

  // AI Services
  estimatePrice: (data: {
    title?: string;
    brand?: string;
    model?: string;
    year?: number;
    condition?: string;
    original_price?: number;
    category_id?: number;
  }) =>
    request<{
      suggested_min: number;
      suggested_max: number;
      median_price: number;
      confidence_score: number;
      fair_market_price: number;
      factors: Record<string, any>;
      comparable_listings: any[];
      disclaimer: string;
    }>('/ai/estimate-price', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  analyzeCondition: (data: { notes?: string; image_url?: string }) =>
    request<{
      suggested_condition: string;
      confidence: number;
      cosmetic_score: number;
      detected_signals: Array<{ component: string; finding: string; severity: string }>;
      recommendation: string;
      disclaimer: string;
    }>('/ai/analyze-condition', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  smartSearch: (query: string) =>
    request<{
      original_query: string;
      extracted_category?: string;
      extracted_condition?: string;
      max_budget?: number;
      min_budget?: number;
      near_me: boolean;
      cleaned_keywords: string;
    }>('/ai/smart-search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    }),

  generateListing: (raw_notes: string) =>
    request<{
      suggested_title: string;
      structured_description: string;
      suggested_category: string;
      suggested_category_id: number;
      suggested_brand: string;
      suggested_model: string;
      suggested_year: number;
      suggested_condition: string;
      suggested_tags: string[];
      suggested_price_range: { min: number; max: number; fair: number };
      extracted_attributes: Record<string, any>;
    }>('/ai/generate-listing', {
      method: 'POST',
      body: JSON.stringify({ raw_notes }),
    }),
};
