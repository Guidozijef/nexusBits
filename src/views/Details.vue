<template>
  <div class="pt-20">
    <Navbar />
    
    <main class="max-w-7xl mx-auto px-6 py-12">
      <!-- Breadcrumb -->
      <nav class="mb-12 flex items-center gap-2 text-sm text-on-surface-variant font-mono">
        <router-link to="/market" class="hover:text-primary transition-colors">市场</router-link>
        <ChevronRight class="w-4 h-4" />
        <span class="hover:text-primary cursor-pointer">赛博控制</span>
        <ChevronRight class="w-4 h-4" />
        <span class="text-primary">Quantum Core Node</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <!-- Left: Resource Preview -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          <!-- Main Image Card -->
          <div class="relative w-full aspect-video rounded-xl overflow-hidden glass-panel group shadow-[0_0_40px_rgba(0,229,255,0.1)]">
            <img 
              src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=1200&q=80" 
              alt="Quantum Core"
              class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
            />
            <!-- Tech Overlays -->
            <div class="absolute top-6 left-6 flex gap-2">
              <span class="px-3 py-1 bg-surface/50 backdrop-blur-md border border-outline-variant/30 rounded text-xs font-bold text-on-surface">3D 模型</span>
              <span class="px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded text-xs font-bold text-primary">.OBJ / .FBX</span>
            </div>
            
            <!-- Pulse Glow -->
            <div class="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"></div>
          </div>

          <!-- Thumbnails -->
          <div class="grid grid-cols-4 gap-4">
            <div 
              v-for="i in 3" 
              :key="i"
              class="aspect-square rounded-lg glass-panel overflow-hidden cursor-pointer hover:border-primary transition-all group"
            >
              <img 
                :src="`https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=400&q=80&sig=${i}`" 
                class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div class="aspect-square rounded-lg glass-panel flex items-center justify-center cursor-pointer hover:text-primary transition-all text-outline group">
              <RotateCcw class="w-8 h-8 group-hover:rotate-180 transition-transform duration-700" />
            </div>
          </div>
        </div>

        <!-- Right: Details & Purchase -->
        <div class="lg:col-span-5 flex flex-col gap-12">
          <!-- Header Info -->
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <span class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] uppercase font-bold rounded border border-primary/20">现货</span>
              <span class="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] uppercase font-bold rounded border border-secondary/20">验证来源</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold text-primary tracking-tight text-glow-primary">Quantum Core Node v2.4</h1>
            <p class="text-lg text-on-surface-variant leading-relaxed">
              专为分布式金库环境立即部署而设计的高速加密矩阵。具有实时密码重构和自适应玻璃态外壳结构。
            </p>
          </div>

          <!-- Metadata Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div v-for="stat in stats" :key="stat.label" class="glass-panel p-4 rounded-xl flex flex-col gap-1 hover:border-primary/40 transition-colors">
              <span class="text-[10px] text-outline uppercase tracking-widest">{{ stat.label }}</span>
              <span class="text-xl font-bold text-on-surface">{{ stat.value }}</span>
            </div>
          </div>

          <div class="h-px w-full bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent"></div>

          <!-- Purchase Module -->
          <div class="glass-panel p-8 rounded-2xl relative overflow-hidden flex flex-col gap-8">
            <div class="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div class="flex justify-between items-end">
              <div>
                <span class="text-xs text-outline block mb-2 uppercase tracking-wider">当前价值</span>
                <div class="flex items-baseline gap-2">
                  <span class="text-5xl font-bold text-on-surface tracking-tighter animate-glow">850</span>
                  <span class="text-xl font-bold text-primary">NXT</span>
                </div>
              </div>
              <div class="flex items-center gap-2 text-xs text-on-surface-variant">
                <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                实时市场价格
              </div>
            </div>

            <div class="flex flex-col gap-4">
              <span class="text-xs text-outline uppercase tracking-wider">选择支付</span>
              <div class="grid grid-cols-3 gap-3">
                <button 
                  v-for="method in ['钱包', '卡支付', '加密货币']" 
                  :key="method"
                  class="py-3 border border-outline-variant/30 rounded-lg hover:border-primary hover:text-primary transition-all text-sm font-medium"
                >
                  {{ method }}
                </button>
              </div>
            </div>

            <button class="w-full py-4 bg-primary text-surface font-bold text-lg rounded-xl btn-glow transition-all duration-300 flex items-center justify-center gap-3">
              <Bolt class="w-5 h-5" />
              立即结算
            </button>
            <p class="text-center text-xs text-outline tracking-wide opacity-60">安全的加密交易。</p>
          </div>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ChevronRight, RotateCcw, Bolt } from 'lucide-vue-next';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';

const stats = [
  { label: '文件大小', value: '142 MB' },
  { label: '多边形数量', value: '45,200' },
  { label: '授权', value: '商业使用' },
  { label: '更新', value: '终身' }
];
</script>

<style scoped>
@keyframes glow {
  0%, 100% { filter: drop-shadow(0 0 2px rgba(0, 229, 255, 0.4)); }
  50% { filter: drop-shadow(0 0 10px rgba(0, 229, 255, 0.8)); }
}

.animate-glow {
  animation: glow 3s ease-in-out infinite;
}
</style>
