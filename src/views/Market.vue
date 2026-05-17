<template>
  <div class="relative">
    <Navbar />
    <main class="max-w-7xl mx-auto px-6">
      <div class="relative overflow-hidden mb-24 pt-40">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-full bg-primary/10 blur-[100px] pointer-events-none rounded-[100%]"></div>
        <section class="flex flex-col items-center text-center relative z-10 pb-20">
          <h1 class="font-display-lg text-3xl sm:text-4xl md:text-6xl text-on-surface mb-6 md:mb-8 leading-tight font-bold tracking-tight">
            获取您的<span class="text-primary-container drop-shadow-[0_0_15px_rgba(0,229,255,0.6)]">虚拟商品</span>
          </h1>
          <p class="text-base md:text-lg text-on-surface-variant mb-8 md:mb-12 max-w-2xl">安全、快捷、即时获取。探索优质虚拟商品，满足您的多样化需求。</p>
          <div class="flex gap-6">
            <button @click="$router.push('/all-assets')" class="bg-primary-container text-on-primary font-bold py-3 px-8 rounded btn-glow transition-all duration-300 flex items-center gap-2">
              立即探索 <ArrowRight class="w-5 h-5" />
            </button>
          </div>
        </section>
        <div class="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent absolute bottom-0 left-0 z-10"></div>
      </div>

      <section class="pb-24">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-outline-variant/30 pb-6">
          <div>
            <h2 class="text-3xl font-bold text-on-surface mb-2 tracking-tight flex items-center gap-2">
              <Sparkles class="w-6 h-6 text-primary" /> 前沿精选
            </h2>
            <p class="text-on-surface-variant">精选高价值商品，探索本周热门特惠</p>
          </div>
          <router-link to="/all-assets" class="text-primary hover:text-primary-fixed font-bold text-sm transition-colors flex items-center gap-1 group">
            查看全部 <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </router-link>
        </div>

        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="glass-panel rounded-xl overflow-hidden flex flex-col animate-pulse">
            <div class="h-48 w-full bg-surface-container-highest"></div>
            <div class="p-6 flex flex-col gap-3"><div class="h-5 bg-surface-container-highest rounded w-3/4"></div><div class="h-4 bg-surface-container-highest rounded w-full"></div></div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="item in latestItems" :key="item.id" class="glass-panel rounded-xl overflow-hidden flex flex-col group hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-500 cursor-pointer">
            <div class="h-48 w-full relative overflow-hidden bg-surface-container-highest" @click="$router.push(`/details/${item.id}`)">
              <img :src="item.image_url" :alt="item.name" class="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
              <div class="absolute top-4 right-4"><span class="bg-primary/20 text-primary border border-primary/30 text-xs font-bold px-2 py-1 rounded backdrop-blur-md">{{ item.tag }}</span></div>
            </div>
            <div class="p-6 flex flex-col flex-grow">
              <h3 class="text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors" @click="$router.push(`/details/${item.id}`)">{{ item.name }}</h3>
              <p class="text-sm text-on-surface-variant line-clamp-2 mb-6 flex-grow">{{ item.description }}</p>
              <div class="flex justify-between items-center mt-auto pt-4 border-t border-outline-variant/20">
                <div class="flex flex-col">
                  <span class="text-[10px] text-on-surface-variant uppercase tracking-wider">价格</span>
                  <span class="text-lg font-bold text-primary-container animate-pulse">{{ item.price }} {{ item.currency || 'NB' }}</span>
                </div>
                <button @click.stop="handleAddToCart(item)" class="bg-surface-container border border-primary/30 text-primary hover:bg-primary/10 px-4 py-2 rounded transition-all text-sm font-bold">立即获取</button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-16 flex justify-center">
          <button @click="$router.push('/all-assets')" class="glass-panel px-8 py-4 rounded-xl flex items-center gap-3 text-on-surface hover:text-primary hover:border-primary/50 transition-all duration-300 font-bold group">
            探索完整商品库 <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform text-primary" />
          </button>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowRight, Sparkles } from 'lucide-vue-next';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { store } from '../store';
import { productsApi } from '../api';

const router = useRouter();
const latestItems = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await productsApi.featured(8);
    if (res.success) latestItems.value = res.data;
  } catch (e) { console.error('Failed to load featured products:', e); }
  loading.value = false;
});

const handleAddToCart = async (item: any) => {
  if (!store.isLoggedIn) { router.push('/login'); return; }
  await store.addToCart(item.id);
};
</script>
