<template>
  <div class="relative">
    <Navbar />
    
    <main class="max-w-7xl mx-auto px-6">
      <!-- Hero Container -->
      <div class="relative overflow-hidden mb-24 pt-40">
        <!-- Background Vertical Glow -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-full bg-primary/10 blur-[100px] pointer-events-none rounded-[100%]"></div>
        
        <section class="flex flex-col items-center text-center relative z-10 pb-20">
          <h1 class="font-display-lg text-5xl md:text-6xl text-on-surface mb-8 leading-tight font-bold tracking-tight">
            获取您的<span class="text-primary-container drop-shadow-[0_0_15px_rgba(0,229,255,0.6)]">数字资产</span>
          </h1>
          <p class="text-lg text-on-surface-variant mb-12 max-w-2xl">
            高效率、加密、即时获取。探索高能效虚拟资源库，加速您的数字架构建设。
          </p>
          
          <div class="flex gap-6">
            <button @click="$router.push('/all-assets')" class="bg-primary-container text-on-primary font-bold py-3 px-8 rounded btn-glow transition-all duration-300 flex items-center gap-2">
              立即探索
              <ArrowRight class="w-5 h-5" />
            </button>
          </div>
        </section>

        <!-- Divider Line at the exact bottom boundary -->
        <div class="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent absolute bottom-0 left-0 z-10"></div>
      </div>

      <!-- Resource Grid Section -->
      <section class="pb-24">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-outline-variant/30 pb-6">
          <div>
            <h2 class="text-3xl font-bold text-on-surface mb-2 tracking-tight flex items-center gap-2">
              <Sparkles class="w-6 h-6 text-primary" />
              前沿精选
            </h2>
            <p class="text-on-surface-variant">实时高价值资产注入，探索本周热门数字序列</p>
          </div>
          <router-link to="/all-assets" class="text-primary hover:text-primary-fixed font-bold text-sm transition-colors flex items-center gap-1 group">
            查看全部
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </router-link>
        </div>

        <!-- Grid Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="item in latestItems" 
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
                  立即获取
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- View All Button -->
        <div class="mt-16 flex justify-center">
          <button @click="$router.push('/all-assets')" class="glass-panel px-8 py-4 rounded-xl flex items-center gap-3 text-on-surface hover:text-primary hover:border-primary/50 transition-all duration-300 font-bold group">
            探索完整资产库
            <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform text-primary" />
          </button>
        </div>
      </section>
    </main>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, Sparkles } from 'lucide-vue-next';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { store } from '../store';

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

// Display top 8 latest items
const latestItems = Array.from({ length: 8 }).map((_, i) => ({
  ...baseItems[i % 4],
  id: i + 1,
  name: `${baseItems[i % 4].name} - 最新发布 ${i + 1}`,
  price: (parseFloat(baseItems[i % 4].price) + (i * 0.1)).toFixed(2),
  image: `${baseItems[i % 4].image}&sig=${i}`
}));
</script>
