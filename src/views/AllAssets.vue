<template>
  <div class="pt-20">
    <Navbar />
    <main class="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
      <!-- Left Sidebar: Filters -->
      <aside class="w-full lg:w-1/4 shrink-0 flex flex-col gap-6 sticky top-24 self-start z-10">
        <div class="category-panel glass-panel p-6 rounded-2xl flex flex-col max-h-[calc(100vh-8rem)] w-full">
          <h3 class="text-lg font-bold text-on-surface mb-6 flex items-center gap-2 border-b border-outline-variant/30 pb-4">
            <Layers class="w-5 h-5 text-primary" /> 商品分类
          </h3>
          <div v-if="categoriesLoading" class="flex flex-col gap-2">
            <div v-for="i in 8" :key="i" class="h-10 bg-surface-container-highest rounded-xl animate-pulse"></div>
          </div>
          <div v-else class="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2 flex-grow">
            <button v-for="cat in categories" :key="cat.id" @click="selectCategory(cat)"
              class="text-left px-4 py-3 rounded-xl transition-all text-sm font-medium flex justify-between items-center group"
              :class="activeFilter === cat.name ? 'bg-primary/10 text-primary border border-primary/30 shadow-[0_0_15px_rgba(0,229,255,0.1)]' : 'text-on-surface-variant border border-transparent hover:bg-surface-container/50 hover:text-on-surface hover:border-outline-variant/30'">
              {{ cat.name }}
              <ChevronRight v-if="activeFilter === cat.name" class="w-4 h-4 text-primary animate-pulse" />
            </button>
          </div>
        </div>
      </aside>

      <!-- Right Content -->
      <section class="w-full lg:w-3/4 pb-24">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-outline-variant/30 pb-6">
          <div>
            <h1 class="text-4xl font-bold text-on-surface mb-2 tracking-tight">探索商品库</h1>
            <div class="flex items-center gap-3 text-sm">
              <span class="text-on-surface-variant">当前分类:</span>
              <span class="bg-surface-container px-2 py-1 rounded text-primary font-bold border border-primary/20">{{ activeFilter }}</span>
              <span class="text-outline">·</span>
              <span class="text-on-surface-variant">共 {{ totalCount }} 个结果</span>
            </div>
          </div>
        </div>

        <div v-if="productsLoading && items.length === 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="glass-panel rounded-xl overflow-hidden flex flex-col animate-pulse">
            <div class="h-48 w-full bg-surface-container-highest"></div>
            <div class="p-6 flex flex-col gap-3"><div class="h-5 bg-surface-container-highest rounded w-3/4"></div><div class="h-4 bg-surface-container-highest rounded w-full"></div></div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div v-for="item in items" :key="item.id" class="glass-panel rounded-xl overflow-hidden flex flex-col group hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-500 cursor-pointer">
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
                <button @click.stop="handleAddToCart(item)" class="bg-surface-container border border-primary/30 text-primary hover:bg-primary/10 px-4 py-2 rounded transition-all text-sm font-bold">加入购物车</button>
              </div>
            </div>
          </div>
        </div>

        <div ref="loadMoreTrigger" class="mt-16 flex justify-center h-10 items-center">
          <Loader2 v-if="productsLoading" class="w-6 h-6 animate-spin text-primary" />
          <span v-else-if="!hasMore" class="text-on-surface-variant text-sm font-mono tracking-widest uppercase opacity-60">已到达数据边界</span>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Loader2, Layers, ChevronRight } from 'lucide-vue-next';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { store } from '../store';
import { productsApi, categoriesApi } from '../api';

const router = useRouter();
const activeFilter = ref('全部');
const activeCategoryId = ref<number | undefined>(undefined);
const loadMoreTrigger = ref<HTMLElement | null>(null);
const categories = ref<any[]>([]);
const items = ref<any[]>([]);
const totalCount = ref(0);
const page = ref(1);
const limit = 12;
const hasMore = ref(true);
const categoriesLoading = ref(true);
const productsLoading = ref(false);

const selectCategory = (cat: any) => {
  activeFilter.value = cat.name;
  activeCategoryId.value = cat.slug === 'all' ? undefined : cat.id;
  page.value = 1;
  items.value = [];
  hasMore.value = true;
  loadProducts();
};

import { useRoute } from 'vue-router';
const route = useRoute();

const loadProducts = async () => {
  productsLoading.value = true;
  try {
    const res = await productsApi.list({ 
      page: page.value, 
      limit, 
      category_id: activeCategoryId.value,
      search: route.query.search as string || undefined
    });
    if (res.success) {
      if (page.value === 1) { items.value = res.data; } else { items.value.push(...res.data); }
      totalCount.value = res.total;
      hasMore.value = items.value.length < res.total;
    }
  } catch (e) { console.error('Failed to load products:', e); }
  productsLoading.value = false;
};

const loadCategories = async () => {
  try {
    const res = await categoriesApi.list();
    if (res.success) categories.value = res.data;
  } catch (e) { console.error('Failed to load categories:', e); }
  categoriesLoading.value = false;
};

const handleAddToCart = async (item: any) => {
  if (!store.isLoggedIn) { router.push('/login'); return; }
  await store.addToCart(item.id);
};

let observer: IntersectionObserver;

onMounted(async () => {
  await loadCategories();
  await loadProducts();
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore.value && !productsLoading.value) {
      page.value++;
      loadProducts();
    }
  }, { threshold: 0.1, rootMargin: '150px' });
  if (loadMoreTrigger.value) observer.observe(loadMoreTrigger.value);
});

// Watch search query in URL to reload products
watch(() => route.query.search, () => {
  page.value = 1;
  items.value = [];
  hasMore.value = true;
  loadProducts();
});

onUnmounted(() => { if (observer) observer.disconnect(); });
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 229, 255, 0.2); border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 229, 255, 0.5); }


</style>
