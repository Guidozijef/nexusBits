import { reactive, computed } from 'vue';
import { authApi, cartApi, userApi, ordersApi, type ApiError } from './api';

export interface UserSession {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface CartItemData {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    currency: string;
    image_url: string;
    tag: string;
  };
}

export interface ProfileData {
  id: string;
  display_name: string;
  avatar_url: string | null;
  level: string;
  role: string;
  balance: number;
  email: string | null;
}

const store = reactive({
  // Auth state
  session: null as UserSession | null,
  profile: null as ProfileData | null,

  // Cart state
  cart: [] as CartItemData[],
  isCartOpen: false,
  cartLoading: false,

  // Computed-like
  get isLoggedIn(): boolean {
    return !!this.session?.access_token;
  },

  get isAdmin(): boolean {
    return this.profile?.role === 'admin';
  },

  get balance(): number {
    return this.profile?.balance || 0;
  },

  get cartTotal(): string {
    return this.cart
      .reduce((total: number, item: CartItemData) => total + (item.product?.price || 0) * item.quantity, 0)
      .toFixed(2);
  },

  // ---- Auth Actions ----
  async login(email: string, password: string) {
    const res = await authApi.login(email, password);
    if (res.success && res.data?.session) {
      this.session = {
        access_token: res.data.session.access_token,
        refresh_token: res.data.session.refresh_token,
        user: {
          id: res.data.user.id,
          email: res.data.user.email,
        },
      };
      localStorage.setItem('nexusbits_session', JSON.stringify(this.session));
      // Load profile and cart after login
      await Promise.all([this.fetchProfile(), this.fetchCart()]);
    }
    return res;
  },

  async register(email: string, password: string, display_name?: string) {
    const res = await authApi.register(email, password, display_name);
    if (res.success && res.data?.session) {
      this.session = {
        access_token: res.data.session.access_token,
        refresh_token: res.data.session.refresh_token,
        user: {
          id: res.data.user.id,
          email: res.data.user.email,
        },
      };
      localStorage.setItem('nexusbits_session', JSON.stringify(this.session));
      await Promise.all([this.fetchProfile(), this.fetchCart()]);
    }
    return res;
  },

  async logout() {
    try {
      await authApi.logout();
    } catch { /* ignore */ }
    this.session = null;
    this.profile = null;
    this.cart = [];
    localStorage.removeItem('nexusbits_session');
  },

  // Restore session from localStorage on app start
  initSession() {
    const stored = localStorage.getItem('nexusbits_session');
    if (stored) {
      try {
        this.session = JSON.parse(stored);
        // Fetch fresh profile/cart in background
        this.fetchProfile().catch(() => {});
        this.fetchCart().catch(() => {});
      } catch {
        localStorage.removeItem('nexusbits_session');
      }
    }
  },

  // ---- Profile Actions ----
  async fetchProfile() {
    if (!this.isLoggedIn) return;
    try {
      const res = await userApi.getProfile();
      if (res.success) {
        this.profile = res.data;
      }
    } catch (e: any) {
      if (e.status === 401) {
        this.logout();
      }
    }
  },

  async updateProfile(data: { display_name?: string; avatar_url?: string }) {
    const res = await userApi.updateProfile(data);
    if (res.success) {
      this.profile = res.data;
    }
    return res;
  },

  // ---- Cart Actions ----
  async fetchCart() {
    if (!this.isLoggedIn) return;
    this.cartLoading = true;
    try {
      const res = await cartApi.list();
      if (res.success) {
        this.cart = res.data || [];
      }
    } catch { /* ignore */ }
    this.cartLoading = false;
  },

  async addToCart(productId: number) {
    if (!this.isLoggedIn) return { success: false, error: '请先登录' };
    try {
      const res = await cartApi.add(productId);
      if (res.success) {
        await this.fetchCart();
        this.isCartOpen = true;
      }
      return res;
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async removeFromCart(productId: number) {
    try {
      const res = await cartApi.remove(productId);
      if (res.success) {
        this.cart = this.cart.filter(item => item.product_id !== productId);
      }
      return res;
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async checkout() {
    try {
      const res = await ordersApi.checkout();
      if (res.success) {
        this.cart = [];
        if (res.data?.new_balance !== undefined) {
          if (this.profile) this.profile.balance = res.data.new_balance;
        }
      }
      return res;
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  // ---- Recharge ----
  async recharge(amount: number) {
    try {
      const res = await userApi.recharge(amount);
      if (res.success && res.data?.balance !== undefined) {
        if (this.profile) this.profile.balance = res.data.balance;
      }
      return res;
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },
});

export { store };
