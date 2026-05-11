<template>
  <div class="pt-20">
    <Navbar />
    
    <main class="max-w-7xl mx-auto px-6 py-12">
      <!-- Hero Section -->
      <section class="flex flex-col items-center text-center mb-24 relative overflow-hidden py-12">
        <!-- Background Glow -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <h1 class="font-display-lg text-5xl md:text-6xl text-on-surface mb-8 relative z-10 leading-tight font-bold tracking-tight">
          获取您的<span class="text-primary-container drop-shadow-[0_0_15px_rgba(0,229,255,0.6)]">数字资产</span>
        </h1>
        <p class="text-lg text-on-surface-variant mb-12 max-w-2xl relative z-10">
          高效率、加密、即时获取。探索高能效虚拟资源库，加速您的数字架构建设。
        </p>
        
        <div class="flex gap-6 relative z-10">
          <button class="bg-primary-container text-on-primary font-bold py-3 px-8 rounded btn-glow transition-all duration-300 flex items-center gap-2">
            立即探索
            <ArrowRight class="w-5 h-5" />
          </button>
          <button class="border border-primary-container text-primary-container bg-surface-container/30 backdrop-blur-sm font-bold py-3 px-8 rounded hover:bg-primary-container/10 transition-all duration-300">
            了解协议
          </button>
        </div>
      </section>

      <div class="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-24"></div>

      <!-- Resource Grid Section -->
      <section class="pb-24">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 class="text-3xl font-bold text-on-surface mb-2">前沿市场</h2>
            <p class="text-on-surface-variant">实时高价值资产注入</p>
          </div>
          <div class="flex gap-4">
            <button 
              v-for="filter in ['全部', '脚本', '模型', 'UI组件']" 
              :key="filter"
              class="glass-panel text-sm px-4 py-2 rounded hover:text-primary transition-all"
              :class="{ 'text-primary border-primary/50 bg-primary/5': activeFilter === filter }"
              @click="activeFilter = filter"
            >
              {{ filter }}
            </button>
          </div>
        </div>

        <!-- Grid Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="item in filteredItems" 
            :key="item.id"
            class="glass-panel rounded-xl overflow-hidden flex flex-col group hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-500 border-t-primary/20 pointer-events-auto cursor-pointer"
            @click="$router.push(`/details/${item.id}`)"
          >
            <!-- Thumbnail -->
            <div class="h-48 w-full relative overflow-hidden bg-surface-container-highest">
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
              <h3 class="text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">{{ item.name }}</h3>
              <p class="text-sm text-on-surface-variant line-clamp-2 mb-6 flex-grow">{{ item.description }}</p>
              
              <div class="flex justify-between items-center mt-auto pt-4 border-t border-outline-variant/20">
                <div class="flex flex-col">
                  <span class="text-[10px] text-on-surface-variant uppercase tracking-wider">实时估值</span>
                  <span class="text-lg font-bold text-primary-container animate-pulse">{{ item.price }} NB</span>
                </div>
                <button class="bg-surface-container border border-primary/30 text-primary hover:bg-primary/10 px-4 py-2 rounded transition-all text-sm font-bold">
                  立即获取
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More -->
        <div class="mt-16 flex justify-center">
          <button class="group flex items-center gap-2 text-primary hover:text-primary-fixed transition-colors font-medium border-b border-primary/30 pb-1">
            加载更多序列
            <ChevronDown class="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </section>
    </main>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ArrowRight, ChevronDown } from 'lucide-vue-next';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';

const activeFilter = ref('全部');

const items = [
  {
    id: 1,
    name: '量子认证协议',
    description: '高级加密认证脚本，即插即用，抵抗量子级爆破。附带完整 API 文档。',
    price: '0.45',
    tag: '脚本',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: '星云3D资产包',
    description: '包含 50+ 高精度玻璃态材质几何体，专为 WebGL 引擎优化。',
    price: '1.20',
    tag: '模型',
    image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: '突触仪表盘套件',
    description: '极简科幻风格 Vue 面板组件库，内置动态图表与深色主题支持。',
    price: '0.85',
    tag: 'UI组件',
    image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    name: '核心节点许可',
    description: '限量发行的底层网络节点许可，享受全网资产交易的手续费分红。',
    price: '5.00',
    tag: '系统基建',
    image: 'https://images.unsplash.com/photo-1518433278981-95ec50e64c20?auto=format&fit=crop&w=800&q=80'
  }
];

const filteredItems = computed(() => {
  if (activeFilter.value === '全部') return items;
  return items.filter(item => item.tag === activeFilter.value);
});
</script>
