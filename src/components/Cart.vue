<template>
  <div v-if="store.isCartOpen" class="fixed inset-0 z-[100] flex justify-end">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity cursor-pointer"
      @click="store.isCartOpen = false"
    ></div>

    <!-- Panel -->
    <div class="relative w-full max-w-md h-full bg-surface-container-lowest border-l border-outline-variant/30 shadow-2xl flex flex-col transform transition-transform duration-300 animate-slide-in">
      
      <!-- Header -->
      <div class="px-6 py-5 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container/50">
        <h2 class="text-xl font-bold text-primary flex items-center gap-2">
          <ShoppingCart class="w-5 h-5" />
          您的购物车
        </h2>
        <button @click="store.isCartOpen = false" class="text-on-surface-variant hover:text-primary transition-colors">
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        <div v-if="store.cart.length === 0" class="text-center text-on-surface-variant mt-12 flex flex-col items-center gap-4">
          <ShoppingCart class="w-16 h-16 opacity-20" />
          <p>购物车是空的</p>
          <button @click="store.isCartOpen = false" class="text-primary hover:underline text-sm">去市场逛逛</button>
        </div>

        <div v-else v-for="item in store.cart" :key="item.id" class="glass-panel p-4 rounded-xl flex gap-4 items-center group relative overflow-hidden">
          <img :src="item.product?.image_url || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'" class="w-16 h-16 rounded object-cover border border-outline-variant/30" />
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-on-surface text-sm truncate pr-6">{{ item.product?.name }}</h4>
            <div class="text-primary font-mono text-sm mt-1">{{ item.product?.price }} NB</div>
          </div>
          <button @click="store.removeFromCart(item.product_id)" class="text-on-surface-variant hover:text-error transition-colors p-2">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="store.cart.length > 0" class="p-6 border-t border-outline-variant/30 bg-surface-container/30">
        <div class="flex justify-between items-center mb-6">
          <span class="text-on-surface-variant">总计</span>
          <span class="text-2xl font-bold text-primary font-mono">{{ store.cartTotal }} NB</span>
        </div>
        
        <button 
          @click="handleCheckout"
          :disabled="checkoutLoading"
          class="w-full py-4 bg-primary text-surface font-bold text-lg rounded-xl btn-glow transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Loader2 v-if="checkoutLoading" class="w-5 h-5 animate-spin" />
          <CreditCard v-else class="w-5 h-5" />
          立即结算
        </button>
        
        <p v-if="checkoutError" class="text-error text-xs text-center mt-3 animate-pulse">{{ checkoutError }}</p>
        <p v-if="checkoutSuccess" class="text-primary text-xs text-center mt-3 animate-pulse">支付成功！已添加至您的仓库。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ShoppingCart, X, Trash2, CreditCard, Loader2 } from 'lucide-vue-next';
import { store } from '../store';

const checkoutError = ref('');
const checkoutSuccess = ref(false);
const checkoutLoading = ref(false);

const handleCheckout = async () => {
  checkoutError.value = '';
  checkoutSuccess.value = false;
  checkoutLoading.value = true;
  
  try {
    const res = await store.checkout();
    if (res.success) {
      checkoutSuccess.value = true;
      setTimeout(() => {
        checkoutSuccess.value = false;
        store.isCartOpen = false;
      }, 2000);
    } else {
      checkoutError.value = res.error || '结算失败';
    }
  } catch (e: any) {
    checkoutError.value = e.message || '结算发生错误';
  }
  checkoutLoading.value = false;
};
</script>

<style scoped>
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.animate-slide-in {
  animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
