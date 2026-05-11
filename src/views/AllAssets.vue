<template>
  <div class="pt-20">
    <Navbar />
    
    <main class="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
      
      <!-- Left Sidebar: Filters -->
      <aside class="w-full lg:w-1/4 shrink-0 flex flex-col gap-6">
        <div class="glass-panel p-6 rounded-2xl flex flex-col h-full max-h-[calc(100vh-8rem)] sticky top-28">
          <h3 class="text-lg font-bold text-on-surface mb-6 flex items-center gap-2 border-b border-outline-variant/30 pb-4">
            <Layers class="w-5 h-5 text-primary" />
            资产分类
          </h3>
          
          <!-- Category List (Scrollable) -->
          <div class="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2 flex-grow">
            <button 
              v-for="filter in categories" 
              :key="filter"
              class="text-left px-4 py-3 rounded-xl transition-all text-sm font-medium flex justify-between items-center group"
              :class="activeFilter === filter ? 'bg-primary/10 text-primary border border-primary/30 shadow-[0_0_15px_rgba(0,229,255,0.1)]' : 'text-on-surface-variant border border-transparent hover:bg-surface-container/50 hover:text-on-surface hover:border-outline-variant/30'"
              @click="activeFilter = filter"
            >
              {{ filter }}
              <ChevronRight v-if="activeFilter === filter" class="w-4 h-4 text-primary animate-pulse" />
            </button>
          </div>
        </div>
      </aside>

      <!-- Right Content: Resource Grid -->
      <section class="w-full lg:w-3/4 pb-24">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-outline-variant/30 pb-6">
          <div>
            <h1 class="text-4xl font-bold text-on-surface mb-2 tracking-tight">探索资产库</h1>
            <div class="flex items-center gap-3 text-sm">
              <span class="text-on-surface-variant">当前分类:</span>
              <span class="bg-surface-container px-2 py-1 rounded text-primary font-bold border border-primary/20">{{ activeFilter }}</span>
              <span class="text-outline">·</span>
              <span class="text-on-surface-variant">共 {{ filteredItems.length }} 个结果</span>
            </div>
          </div>
        </div>

        <!-- Grid Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          <div 
            v-for="item in displayedItems" 
            :key="item.id"
            class="glass-panel rounded-xl overflow-hidden flex flex-col group hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-500 border-t-primary/20 pointer-events-auto cursor-pointer"
          >
            <!-- Thumbnail -->
            <div class="h-48 w-full relative overflow-hidden bg-surface-container-highest" @click="$router.push(`/details/${item.id}`)">
              <img 
                :src="item.image" 
                :alt="item.name"
                class="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
              />
              <div class="absolute top-4 right-4">
                <span class="bg-primary/20 text-primary border border-primary/30 text-xs font-bold px-2 py-1 rounded backdrop-blur-md">
                  {{ item.tag }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 flex flex-col flex-grow">
              <h3 class="text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors" @click="$router.push(`/details/${item.id}`)">{{ item.name }}</h3>
              <p class="text-sm text-on-surface-variant line-clamp-2 mb-6 flex-grow" @click="$router.push(`/details/${item.id}`)">{{ item.description }}</p>
              
              <div class="flex justify-between items-center mt-auto pt-4 border-t border-outline-variant/20">
                <div class="flex flex-col">
                  <span class="text-[10px] text-on-surface-variant uppercase tracking-wider">实时估值</span>
                  <span class="text-lg font-bold text-primary-container animate-pulse">{{ item.price }} NB</span>
                </div>
                <button @click.stop="store.addToCart(item)" class="bg-surface-container border border-primary/30 text-primary hover:bg-primary/10 px-4 py-2 rounded transition-all text-sm font-bold">
                  加入购物车
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Trigger -->
        <div ref="loadMoreTrigger" class="mt-16 flex justify-center h-10 items-center">
          <Loader2 v-if="itemsToShow < filteredItems.length" class="w-6 h-6 animate-spin text-primary" />
          <span v-else class="text-on-surface-variant text-sm font-mono tracking-widest uppercase opacity-60">已到达数据边界</span>
        </div>
      </section>
    </main>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { Loader2, Layers, ChevronRight } from 'lucide-vue-next';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { store } from '../store';

const activeFilter = ref('全部');
const loadMoreTrigger = ref<HTMLElement | null>(null);
const itemsToShow = ref(12);

// Simulate a large list of categories
const categories = [
  '全部', '脚本', '模型', 'UI组件', '系统基建', 
  '智能合约', '音频资产', '动画序列', '环境材质', 
  '数据节点', '神经网络', '身份插件', '安全协议', '支付网关'
];

const baseItems = [
  {
    name: '量子认证协议',
    description: '高级加密认证脚本，即插即用，抵抗量子级爆破。附带完整 API 文档。',
    price: '0.45',
    tag: '脚本',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: '星云3D资产包',
    description: '包含 50+ 高精度玻璃态材质几何体，专为 WebGL 引擎优化。',
    price: '1.20',
    tag: '模型',
    image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: '突触仪表盘套件',
    description: '极简科幻风格 Vue 面板组件库，内置动态图表与深色主题支持。',
    price: '0.85',
    tag: 'UI组件',
    image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: '核心节点许可',
    description: '限量发行的底层网络节点许可，享受全网资产交易的手续费分红。',
    price: '5.00',
    tag: '系统基建',
    image: 'https://images.unsplash.com/photo-1518433278981-95ec50e64c20?auto=format&fit=crop&w=800&q=80'
  }
];

// Generate 48 items programmatically for demonstration, distributed across the new categories
const items = Array.from({ length: 48 }).map((_, i) => {
  const base = baseItems[i % 4];
  // Assign random categories from our extended list to test filtering
  const categoryIndex = (i % (categories.length - 1)) + 1; // skip '全部'
  
  return {
    ...base,
    id: i + 1,
    name: `${base.name} - Gen ${i + 1}`,
    tag: categories[categoryIndex],
    price: (parseFloat(base.price) + (i * 0.05)).toFixed(2),
    image: `${base.image}&sig=${i}`
  };
});

const filteredItems = computed(() => {
  if (activeFilter.value === '全部') return items;
  return items.filter(item => item.tag === activeFilter.value);
});

const displayedItems = computed(() => {
  return filteredItems.value.slice(0, itemsToShow.value);
});

// Reset pagination on filter change
watch(activeFilter, () => {
  itemsToShow.value = 12;
});

// Infinite Scroll logic
let observer: IntersectionObserver;

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && itemsToShow.value < filteredItems.value.length) {
      setTimeout(() => {
        itemsToShow.value += 8;
      }, 500); // Simulate network load
    }
  }, { threshold: 0.1, rootMargin: '150px' });
  
  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 229, 255, 0.2);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 229, 255, 0.5);
}
</style>
