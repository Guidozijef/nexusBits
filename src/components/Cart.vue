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
          <img :src="item.image" class="w-16 h-16 rounded object-cover border border-outline-variant/30" />
          <div class="flex-1">
            <h4 class="font-bold text-on-surface text-sm truncate pr-6">{{ item.name }}</h4>
            <div class="text-primary font-mono text-sm mt-1">{{ item.price }} NX</div>
          </div>
          <button @click="store.removeFromCart(item.id)" class="text-on-surface-variant hover:text-error transition-colors p-2">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="store.cart.length > 0" class="p-6 border-t border-outline-variant/30 bg-surface-container/30">
        <div class="flex justify-between items-center mb-6">
          <span class="text-on-surface-variant">总计</span>
          <span class="text-2xl font-bold text-primary font-mono">{{ store.cartTotal }} NX</span>
        </div>
        
        <button 
          @click="handleCheckout"
          class="w-full py-4 bg-primary text-surface font-bold text-lg rounded-xl btn-glow transition-all duration-300 flex items-center justify-center gap-2"
        >
          <CreditCard class="w-5 h-5" />
          立即结算
        </button>
        
        <p v-if="checkoutError" class="text-error text-xs text-center mt-3 animate-pulse">余额不足，请先充值！</p>
        <p v-if="checkoutSuccess" class="text-primary text-xs text-center mt-3 animate-pulse">支付成功！已添加至您的仓库。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ShoppingCart, X, Trash2, CreditCard } from 'lucide-vue-next';
import { store } from '../store';

const checkoutError = ref(false);
const checkoutSuccess = ref(false);

const handleCheckout = () => {
  checkoutError.value = false;
  checkoutSuccess.value = false;
  
  if (store.checkout()) {
    checkoutSuccess.value = true;
    setTimeout(() => {
      checkoutSuccess.value = false;
      store.isCartOpen = false;
    }, 2000);
  } else {
    checkoutError.value = true;
    setTimeout(() => {
      checkoutError.value = false;
    }, 3000);
  }
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
