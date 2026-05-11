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

          <!-- Resource Description -->
          <div class="glass-panel p-8 rounded-2xl flex flex-col gap-6 mt-4">
            <h2 class="text-2xl font-bold text-on-surface border-b border-outline-variant/30 pb-4 flex items-center gap-2">
              <FileText class="w-6 h-6 text-primary" />
              资源介绍
            </h2>
            <div class="text-on-surface-variant space-y-4 leading-relaxed text-sm">
              <p>此 Quantum Core Node 是专为下一代分布式网络与去中心化应用架构打造的顶级基础设施组件。随附完整的核心加密算法模块、预编译的节点客户端，以及可供前端直接调用的 API SDK。</p>
              <p>其自适应玻璃态外壳能够根据当前网络的吞吐量和负载自动调节视觉反馈，完美适配数据大屏与科幻风仪表盘。所有的 3D 视觉资产均已在主流渲染引擎（如 Three.js, WebGL）中进行过深度优化，确保复杂场景下依然维持 60fps 以上的流畅体验。</p>
            </div>
          </div>

          <!-- Important Notes -->
          <div class="glass-panel p-8 rounded-2xl flex flex-col gap-6 border border-error/20 bg-error/5 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-error/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            <h2 class="text-2xl font-bold text-error border-b border-error/20 pb-4 flex items-center gap-2 relative z-10">
              <AlertTriangle class="w-6 h-6" />
              注意事项
            </h2>
            <ul class="text-on-surface-variant space-y-3 leading-relaxed text-sm list-disc pl-5 relative z-10">
              <li>此资产为数字加密虚拟商品，一经购买获取密钥后，<span class="text-error font-bold">概不退款</span>。</li>
              <li>附带的商业授权允许您在无限制的最终商业项目中合法使用，但严禁将原始模型与代码文件直接转售或进行任何形式的重新打包分发。</li>
              <li>如需部署至生产级主网环境，请务必确保您的宿主服务器集群具备至少 16GB 内存以支持其实时密码重构机制。</li>
            </ul>
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

            <div class="flex gap-4">
              <button @click="handleAddToCart" class="flex-1 py-4 bg-surface-container border border-primary/30 text-primary font-bold text-lg rounded-xl hover:bg-primary/10 transition-all duration-300 flex items-center justify-center gap-2">
                <ShoppingCart class="w-5 h-5" />
                加入购物车
              </button>
              <button @click="handleBuyNow" class="flex-1 py-4 bg-primary text-surface font-bold text-lg rounded-xl btn-glow transition-all duration-300 flex items-center justify-center gap-2">
                <Bolt class="w-5 h-5" />
                立即支付
              </button>
            </div>
            
            <p v-if="buyError" class="text-error text-xs text-center animate-pulse">余额不足，请前往个人中心充值！</p>
            <p v-else-if="buySuccess" class="text-primary text-xs text-center animate-pulse">支付成功！资源已发放至您的仓库。</p>
            <p v-else class="text-center text-xs text-outline tracking-wide opacity-60">安全的加密交易。</p>
          </div>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChevronRight, RotateCcw, Bolt, FileText, AlertTriangle, ShoppingCart } from 'lucide-vue-next';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { store } from '../store';
import { useRoute } from 'vue-router';

const route = useRoute();

const stats = [
  { label: '文件大小', value: '142 MB' },
  { label: '多边形数量', value: '45,200' },
  { label: '授权', value: '商业使用' },
  { label: '更新', value: '终身' }
];

const buyError = ref(false);
const buySuccess = ref(false);

const handleAddToCart = () => {
  store.addToCart({
    id: route.params.id || 'qc-24',
    name: 'Quantum Core Node v2.4',
    price: '850',
    image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=400&q=80'
  });
};

const handleBuyNow = () => {
  buyError.value = false;
  buySuccess.value = false;
  
  if (store.balance >= 850) {
    store.balance -= 850;
    buySuccess.value = true;
    setTimeout(() => buySuccess.value = false, 2500);
  } else {
    buyError.value = true;
    setTimeout(() => buyError.value = false, 3000);
  }
};
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
