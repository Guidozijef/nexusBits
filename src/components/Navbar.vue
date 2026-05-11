<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant shadow-lg shadow-primary-container/10 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
      <!-- Brand -->
      <router-link to="/market" class="flex items-center gap-3 group">
        <div class="w-8 h-8 rounded bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-on-primary font-bold shadow-[0_0_10px_rgba(0,229,255,0.5)] group-hover:scale-110 transition-transform">
          N
        </div>
        <span class="font-display-lg text-2xl font-bold text-primary tracking-tight text-glow-primary">NexusBits</span>
      </router-link>

      <!-- Navigation Links -->
      <nav class="hidden md:flex items-center gap-8">
        <router-link 
          v-for="link in navLinks" 
          :key="link.path"
          :to="link.path"
          class="text-on-surface-variant hover:text-primary transition-all duration-300 font-medium relative group"
          :class="{ 'text-primary': $route.path === link.path }"
        >
          {{ link.name }}
          <span 
            class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"
            :class="{ 'w-full': $route.path === link.path }"
          ></span>
        </router-link>
      </nav>

      <!-- Trailing Icons -->
      <div class="flex items-center gap-4">
        <div class="hidden sm:flex relative items-center">
          <input 
            type="text" 
            placeholder="搜索资产..."
            class="bg-surface-container/50 border-b border-outline-variant/50 focus:border-primary focus:ring-0 text-on-surface text-sm py-1 px-3 outline-none w-48 transition-all duration-300 placeholder-on-surface-variant/50"
          />
          <Search class="absolute right-2 w-4 h-4 text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
        </div>
        <button class="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-variant/50 rounded-full transition-all">
          <ShoppingCart class="w-5 h-5" />
        </button>
        <router-link to="/profile" class="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-variant/50 rounded-full transition-all">
          <User class="w-5 h-5" />
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Search, ShoppingCart, User } from 'lucide-vue-next';

const navLinks = [
  { name: '市场', path: '/market' },
  { name: '资产', path: '#' },
  { name: '金库', path: '#' },
  { name: '节点', path: '#' },
];
</script>
