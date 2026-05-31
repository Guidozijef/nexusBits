// ============================================================
// NexusBits API Client
// Centralized HTTP request layer
// ============================================================

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, string | number | undefined>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    const session = localStorage.getItem('nexusbits_session');
    if (!session) return null;
    try {
      const parsed = JSON.parse(session);
      return parsed.access_token || null;
    } catch {
      return null;
    }
  }

  private buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
    const url = new URL(`${this.baseUrl}${path}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.set(key, String(value));
        }
      });
    }
    return url.toString();
  }

  async request<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, params } = options;
    const token = this.getToken();

    const fetchHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (token) {
      fetchHeaders['Authorization'] = `Bearer ${token}`;
    }

    const url = this.buildUrl(path, params);

    const response = await fetch(url, {
      method,
      headers: fetchHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (response.status === 401 && !path.includes('/auth/login')) {
      localStorage.removeItem('nexusbits_session');
      window.location.href = '/login';
      throw new ApiError('登录已过期，请重新登录', 401, data);
    }

    if (!response.ok) {
      throw new ApiError(data.error || '请求失败', response.status, data);
    }

    return data;
  }

  get<T = any>(path: string, params?: Record<string, string | number | undefined>) {
    return this.request<T>(path, { params });
  }

  post<T = any>(path: string, body?: any) {
    return this.request<T>(path, { method: 'POST', body });
  }

  put<T = any>(path: string, body?: any) {
    return this.request<T>(path, { method: 'PUT', body });
  }

  delete<T = any>(path: string) {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const api = new ApiClient(API_BASE);

// ============================================================
// Auth API
// ============================================================
export const authApi = {
  register(email: string, password: string, display_name?: string) {
    return api.post('/auth/register', { email, password, display_name });
  },
  login(email: string, password: string) {
    return api.post('/auth/login', { email, password });
  },
  logout() {
    return api.post('/auth/logout');
  },
  refresh(refresh_token: string) {
    return api.post('/auth/refresh', { refresh_token });
  },
};

// ============================================================
// Products API
// ============================================================
export const productsApi = {
  list(params?: { page?: number; limit?: number; category_id?: number | string; search?: string }) {
    return api.get('/products', params as any);
  },
  featured(limit = 8) {
    return api.get('/products/featured', { limit });
  },
  search(q: string, limit = 20) {
    return api.get('/products/search', { q, limit });
  },
  getById(id: number | string) {
    return api.get(`/products/${id}`);
  },
};

// ============================================================
// Categories API
// ============================================================
export const categoriesApi = {
  list() {
    return api.get('/categories');
  },
};

// ============================================================
// Cart API
// ============================================================
export const cartApi = {
  list() {
    return api.get('/cart');
  },
  add(product_id: number | string) {
    return api.post('/cart', { product_id });
  },
  remove(productId: number | string) {
    return api.delete(`/cart/${productId}`);
  },
  clear() {
    return api.delete('/cart');
  },
};

// ============================================================
// Orders API
// ============================================================
export const ordersApi = {
  list(page = 1, limit = 10) {
    return api.get('/orders', { page, limit });
  },
  checkout() {
    return api.post('/orders');
  },
  directBuy(product_id: number | string, quantity?: number, pkg_id?: number, dur_id?: number, type_idx?: number) {
    return api.post('/orders/direct', { product_id, quantity, pkg_id, dur_id, type_idx });
  },
};

// ============================================================
// User API
// ============================================================
export const userApi = {
  getProfile() {
    return api.get('/user/profile');
  },
  updateProfile(data: { display_name?: string; avatar_url?: string }) {
    return api.put('/user/profile', data);
  },
  getBalance() {
    return api.get('/user/balance');
  },
  recharge(amount: number) {
    return api.post('/user/recharge', { amount });
  },
  getAssets() {
    return api.get('/user/assets');
  },
};

// ============================================================
// Admin API
// ============================================================
export const adminApi = {
  getUsers() {
    return api.get('/admin/users');
  },
  getProducts(params?: any) {
    return api.get('/admin/products', params);
  },
  getProductById(id: number | string) {
    return api.get(`/admin/products/${id}`);
  },
  createProduct(data: any) {
    return api.post('/admin/products', data);
  },
  updateProduct(id: number, data: any) {
    return api.put(`/admin/products/${id}`, data);
  },
  deleteProduct(id: number) {
    return api.delete(`/admin/products/${id}`);
  },
  createCategory(data: any) {
    return api.post('/admin/categories', data);
  },
  updateCategory(id: number, data: any) {
    return api.put(`/admin/categories/${id}`, data);
  },
  deleteCategory(id: number) {
    return api.delete(`/admin/categories/${id}`);
  },
  updateProductStatus(id: number, status: string) {
    return api.put(`/admin/products/${id}/status`, { status });
  },
  getOrders(params?: { order_no?: string; search?: string; status?: string; page?: number; limit?: number }) {
    return api.get('/admin/orders', params as any);
  },
  updateAssetRemark(orderId: number, productId: number, remark: string) {
    return api.put(`/admin/orders/${orderId}/products/${productId}/remark`, { remark });
  },
};
