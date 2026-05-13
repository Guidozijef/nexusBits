<template>
  <div class="pt-20">
    <Navbar />
    <main class="max-w-7xl mx-auto px-6 py-12">
      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
        <Loader2 class="w-8 h-8 animate-spin text-primary" />
      </div>

      <template v-else-if="product">
        <!-- Breadcrumb -->
        <nav class="mb-12 flex items-center gap-2 text-sm text-on-surface-variant font-mono">
          <router-link to="/market" class="hover:text-primary transition-colors">市场</router-link>
          <ChevronRight class="w-4 h-4" />
          <span class="hover:text-primary cursor-pointer">{{ product.tag }}</span>
          <ChevronRight class="w-4 h-4" />
          <span class="text-primary">{{ product.name }}</span>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <!-- Left: Preview -->
          <div class="lg:col-span-7 flex flex-col gap-6">
            <div class="relative w-full aspect-video rounded-xl overflow-hidden glass-panel group shadow-[0_0_40px_rgba(0,229,255,0.1)]">
              <img :src="product.image_url" :alt="product.name" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
              <div class="absolute top-6 left-6 flex gap-2">
                <span class="px-3 py-1 bg-surface/50 backdrop-blur-md border border-outline-variant/30 rounded text-xs font-bold text-on-surface">{{ product.asset_type || product.tag }}</span>
                <span v-if="product.file_format" class="px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded text-xs font-bold text-primary">{{ product.file_format }}</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"></div>
            </div>

            <!-- Thumbnails -->
            <div v-if="product.thumbnail_urls?.length" class="grid grid-cols-4 gap-4">
              <div v-for="(thumb, i) in product.thumbnail_urls.slice(0, 3)" :key="i" class="aspect-square rounded-lg glass-panel overflow-hidden cursor-pointer hover:border-primary transition-all group">
                <img :src="thumb" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <div class="aspect-square rounded-lg glass-panel flex items-center justify-center cursor-pointer hover:text-primary transition-all text-outline group">
                <RotateCcw class="w-8 h-8 group-hover:rotate-180 transition-transform duration-700" />
              </div>
            </div>

            <!-- Description -->
            <div class="glass-panel p-8 rounded-2xl flex flex-col gap-6 mt-4">
              <h2 class="text-2xl font-bold text-on-surface border-b border-outline-variant/30 pb-4 flex items-center gap-2">
                <FileText class="w-6 h-6 text-primary" /> 资源介绍
              </h2>
              <div class="text-on-surface-variant space-y-4 leading-relaxed text-sm">
                <p>{{ product.long_description || product.description }}</p>
              </div>
            </div>

            <!-- Notes -->
            <div class="glass-panel p-8 rounded-2xl flex flex-col gap-6 border border-error/20 bg-error/5 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-error/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
              <h2 class="text-2xl font-bold text-error border-b border-error/20 pb-4 flex items-center gap-2 relative z-10">
                <AlertTriangle class="w-6 h-6" /> 注意事项
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
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-3">
                <span class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] uppercase font-bold rounded border border-primary/20">现货</span>
                <span class="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] uppercase font-bold rounded border border-secondary/20">验证来源</span>
              </div>
              <h1 class="text-4xl md:text-5xl font-bold text-primary tracking-tight text-glow-primary">{{ product.name }}</h1>
              <p class="text-lg text-on-surface-variant leading-relaxed">{{ product.description }}</p>
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
                    <span class="text-5xl font-bold text-on-surface tracking-tighter animate-glow">{{ product.price }}</span>
                    <span class="text-xl font-bold text-primary">{{ product.currency || 'NB' }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-2 text-xs text-on-surface-variant">
                  <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span> 实时市场价格
                </div>
              </div>

              <div class="flex flex-col gap-4">
                <span class="text-xs text-outline uppercase tracking-wider">选择支付</span>
                <div class="grid grid-cols-3 gap-3">
                  <button v-for="method in ['钱包', '卡支付', '加密货币']" :key="method"
                    class="py-3 border border-outline-variant/30 rounded-lg hover:border-primary hover:text-primary transition-all text-sm font-medium">{{ method }}</button>
                </div>
              </div>

              <div class="flex gap-4">
                <button @click="handleAddToCart" class="flex-1 py-4 bg-surface-container border border-primary/30 text-primary font-bold text-lg rounded-xl hover:bg-primary/10 transition-all duration-300 flex items-center justify-center gap-2">
                  <ShoppingCart class="w-5 h-5" /> 加入购物车
                </button>
                <button @click="handleBuyNow" :disabled="buyLoading" class="flex-1 py-4 bg-primary text-surface font-bold text-lg rounded-xl btn-glow transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50">
                  <Loader2 v-if="buyLoading" class="w-5 h-5 animate-spin" />
                  <Bolt v-else class="w-5 h-5" /> 立即支付
                </button>
              </div>
              
              <p v-if="buyError" class="text-error text-xs text-center animate-pulse">{{ buyError }}</p>
              <p v-else-if="buySuccess" class="text-primary text-xs text-center animate-pulse">支付成功！资源已发放至您的仓库。</p>
              <p v-else class="text-center text-xs text-outline tracking-wide opacity-60">安全的加密交易。</p>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="flex items-center justify-center min-h-[60vh] text-on-surface-variant">商品不存在</div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronRight, RotateCcw, Bolt, FileText, AlertTriangle, ShoppingCart, Loader2 } from 'lucide-vue-next';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { store } from '../store';
import { productsApi, ordersApi } from '../api';

const route = useRoute();
const router = useRouter();
const product = ref<any>(null);
const loading = ref(true);
const buyError = ref('');
const buySuccess = ref(false);
const buyLoading = ref(false);

const stats = computed(() => {
  if (!product.value) return [];
  return [
    { label: '文件大小', value: product.value.file_size || '-' },
    { label: '多边形数量', value: product.value.polygon_count || '-' },
    { label: '授权', value: product.value.license_type || '商业使用' },
    { label: '更新', value: product.value.update_policy || '终身' }
  ];
});

onMounted(async () => {
  try {
    const id = route.params.id;
    const res = await productsApi.getById(id as string);
    if (res.success) product.value = res.data;
  } catch (e) { console.error('Failed to load product:', e); }
  loading.value = false;
});

const handleAddToCart = async () => {
  if (!store.isLoggedIn) { router.push('/login'); return; }
  if (!product.value) return;
  await store.addToCart(product.value.id);
};

const handleBuyNow = async () => {
  if (!store.isLoggedIn) { router.push('/login'); return; }
  if (!product.value) return;
  buyError.value = '';
  buySuccess.value = false;
  buyLoading.value = true;
  try {
    const res = await ordersApi.directBuy(product.value.id);
    if (res.success) {
      buySuccess.value = true;
      if (res.data?.new_balance !== undefined && store.profile) {
        store.profile.balance = res.data.new_balance;
      }
      setTimeout(() => { buySuccess.value = false; }, 2500);
    } else {
      buyError.value = res.error || '支付失败';
      setTimeout(() => { buyError.value = ''; }, 3000);
    }
  } catch (e: any) {
    buyError.value = e.message || '支付失败';
    setTimeout(() => { buyError.value = ''; }, 3000);
  }
  buyLoading.value = false;
};
</script>

<style scoped>
@keyframes glow {
  0%, 100% { filter: drop-shadow(0 0 2px rgba(0, 229, 255, 0.4)); }
  50% { filter: drop-shadow(0 0 10px rgba(0, 229, 255, 0.8)); }
}
.animate-glow { animation: glow 3s ease-in-out infinite; }
</style>
