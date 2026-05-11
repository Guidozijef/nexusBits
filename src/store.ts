import { reactive } from 'vue';

export const store = reactive({
  balance: 2450.00,
  cart: [] as any[],
  isCartOpen: false,
  
  addToCart(item: any) {
    const exists = this.cart.find(i => i.id === item.id);
    if (!exists) {
      this.cart.push(item);
    }
    this.isCartOpen = true;
  },
  
  removeFromCart(id: any) {
    this.cart = this.cart.filter(i => i.id !== id);
  },
  
  get cartTotal() {
    return this.cart.reduce((total: number, item: any) => total + parseFloat(item.price), 0).toFixed(2);
  },

  checkout() {
    const total = parseFloat(this.cartTotal);
    if (this.balance >= total) {
      this.balance -= total;
      this.cart = [];
      return true;
    }
    return false;
  }
});
