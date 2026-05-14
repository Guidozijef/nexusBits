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
        <nav class="mb-8 flex items-center gap-2 text-sm text-on-surface-variant font-mono">
          <router-link to="/market" class="hover:text-primary transition-colors">市场</router-link>
          <ChevronRight class="w-4 h-4" />
          <span class="hover:text-primary cursor-pointer">{{ product.tag }}</span>
          <ChevronRight class="w-4 h-4" />
          <span class="text-primary">{{ product.name }}</span>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Left: Options & Details -->
          <div class="lg:col-span-8 flex flex-col gap-10">
            <!-- Cover Image -->
            <div class="relative w-full aspect-[21/9] rounded-xl overflow-hidden glass-panel group shadow-[0_0_40px_rgba(0,229,255,0.1)]">
              <img :src="product.image_url" :alt="product.name" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
              <div class="absolute top-6 left-6 flex gap-2">
                <span class="px-3 py-1 bg-surface/80 backdrop-blur-md border border-outline-variant/50 rounded text-xs font-bold text-on-surface">{{ product.asset_type || product.tag }}</span>
                <span v-if="product.file_format" class="px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded text-xs font-bold text-primary">{{ product.file_format }}</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent pointer-events-none"></div>
              <div class="absolute bottom-6 left-6 pr-6">
                <h1 class="text-3xl md:text-4xl font-bold text-primary tracking-tight text-glow-primary mb-2">{{ product.name }}</h1>
                <p class="text-on-surface-variant line-clamp-2 max-w-2xl">{{ product.description }}</p>
              </div>
            </div>

            <!-- 1. Type Selection -->
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-2 border-l-4 border-primary pl-3">
                <h3 class="text-lg font-bold text-on-surface tracking-wide">类型</h3>
              </div>
              <div class="flex flex-wrap gap-3">
                <button v-for="t in types" :key="t" 
                  @click="selectedType = t"
                  class="px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border"
                  :class="selectedType === t ? 'bg-primary text-surface-container-lowest border-primary shadow-[0_0_15px_rgba(0,229,255,0.3)]' : 'bg-surface-container/30 text-on-surface-variant border-outline-variant/30 hover:border-primary/50 hover:text-on-surface hover:bg-surface-container/80'"
                >
                  {{ t }}
                </button>
              </div>
            </div>

            <!-- 2. Package Selection -->
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-2 border-l-4 border-primary pl-3">
                <h3 class="text-lg font-bold text-on-surface tracking-wide">套餐</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div v-for="pkg in packages" :key="pkg.id"
                  @click="selectedPackage = pkg"
                  class="glass-panel p-6 rounded-xl flex flex-col gap-4 cursor-pointer transition-all duration-300 relative border-2 overflow-hidden"
                  :class="selectedPackage.id === pkg.id ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(0,229,255,0.25)] scale-[1.02]' : 'border-outline-variant/20 hover:border-primary/40'"
                >
                  <!-- Decorative Selected Corner -->
                  <div v-if="selectedPackage.id === pkg.id" class="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 blur-xl pointer-events-none transition-all"></div>
                  <div v-if="selectedPackage.id === pkg.id" class="absolute top-0 right-0 bg-primary rounded-bl-xl w-8 h-8 flex items-center justify-center shadow-md transition-all">
                    <Check class="w-5 h-5 text-surface-container-lowest" stroke-width="3" />
                  </div>

                  <div v-if="pkg.recommended" class="absolute -top-3 left-4 bg-primary text-surface-container-lowest text-[10px] font-bold px-2 py-0.5 rounded shadow-[0_0_10px_rgba(0,229,255,0.5)]">
                    {{ product.tag }} 推荐
                  </div>
                  <div class="text-center pb-4 border-b border-outline-variant/20">
                    <h4 class="text-base font-bold text-on-surface">{{ pkg.name }}</h4>
                    <div class="text-3xl font-bold text-primary mt-3 flex items-baseline justify-center gap-1">
                      <span class="text-lg">¥</span>{{ pkg.price }}<span class="text-xs text-on-surface-variant font-normal">起</span>
                    </div>
                  </div>
                  <ul class="flex flex-col gap-3 text-xs text-on-surface-variant pt-2">
                    <li v-for="feat in pkg.features" :key="feat" class="flex items-start gap-2">
                      <div class="w-4 h-4 rounded bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check class="w-3 h-3 text-primary" />
                      </div>
                      <span class="leading-snug">{{ feat }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- 3. Duration Selection -->
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-2 border-l-4 border-primary pl-3">
                <h3 class="text-lg font-bold text-on-surface tracking-wide">时长</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div v-for="dur in durations" :key="dur.id"
                  @click="selectedDuration = dur"
                  class="glass-panel p-4 rounded-xl flex flex-col justify-center cursor-pointer transition-all duration-300 relative border-2 min-h-[80px] overflow-hidden"
                  :class="selectedDuration.id === dur.id ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(0,229,255,0.25)] scale-[1.02]' : 'border-outline-variant/20 hover:border-primary/40'"
                >
                  <!-- Decorative Selected Corner -->
                  <div v-if="selectedDuration.id === dur.id" class="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 blur-xl pointer-events-none transition-all"></div>
                  <div v-if="selectedDuration.id === dur.id" class="absolute top-0 right-0 bg-primary rounded-bl-xl w-7 h-7 flex items-center justify-center shadow-md transition-all">
                    <Check class="w-4 h-4 text-surface-container-lowest" stroke-width="3" />
                  </div>

                  <div v-if="dur.tag" class="absolute -top-3 left-4 bg-secondary text-surface-container-lowest text-[10px] font-bold px-2 py-0.5 rounded shadow-[0_0_10px_rgba(255,42,109,0.5)]">
                    {{ dur.tag }}
                  </div>
                  <div class="flex justify-between items-center w-full gap-2">
                    <span class="text-sm font-medium text-on-surface leading-tight">{{ dur.name }}</span>
                    <span class="text-base font-bold text-primary shrink-0">¥ {{ selectedPackage.price + dur.priceMod }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="glass-panel p-8 rounded-2xl flex flex-col gap-6 mt-4">
              <h2 class="text-xl font-bold text-on-surface border-b border-outline-variant/30 pb-4 flex items-center gap-2">
                <FileText class="w-5 h-5 text-primary" /> 资源介绍
              </h2>
              <div class="text-on-surface-variant space-y-4 leading-relaxed text-sm">
                <p>{{ product.long_description || product.description }}</p>
              </div>
            </div>

            <!-- Notes -->
            <div class="glass-panel p-8 rounded-2xl flex flex-col gap-6 border border-error/20 bg-error/5 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-error/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
              <h2 class="text-xl font-bold text-error border-b border-error/20 pb-4 flex items-center gap-2 relative z-10">
                <AlertTriangle class="w-5 h-5" /> 注意事项
              </h2>
              <ul class="text-on-surface-variant space-y-3 leading-relaxed text-sm list-disc pl-5 relative z-10">
                <li>此资产为数字加密虚拟商品，一经购买获取密钥后，<span class="text-error font-bold">概不退款</span>。</li>
                <li>附带的商业授权允许您在无限制的最终商业项目中合法使用，但严禁将原始模型与代码文件直接转售或进行任何形式的重新打包分发。</li>
                <li>如需部署至生产级主网环境，请务必确保您的宿主服务器具备足够资源支持其实时重构机制。</li>
              </ul>
            </div>
          </div>

          <!-- Right: Summary & Purchase -->
          <div class="lg:col-span-4">
            <div class="glass-panel p-6 rounded-2xl flex flex-col gap-6 sticky top-28 border border-primary/20 shadow-[0_0_30px_rgba(0,229,255,0.05)]">
              
              <!-- Quantity -->
              <div class="flex justify-between items-center border-b border-outline-variant/30 pb-6">
                <span class="text-on-surface font-medium">数量</span>
                <div class="flex items-center bg-surface-container/50 rounded border border-outline-variant/30 overflow-hidden">
                  <button @click="decreaseQuantity" class="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors disabled:opacity-30" :disabled="quantity <= 1">
                    <Minus class="w-3 h-3" />
                  </button>
                  <input type="number" v-model="quantity" class="w-10 h-8 bg-transparent text-center text-sm text-on-surface font-bold focus:outline-none" min="1" readonly />
                  <button @click="increaseQuantity" class="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors">
                    <Plus class="w-3 h-3" />
                  </button>
                </div>
              </div>

              <!-- Price Breakdown -->
              <div class="flex flex-col gap-3 pb-6 border-b border-outline-variant/30 text-sm">
                <div class="flex justify-between items-center text-on-surface-variant">
                  <span>原价</span>
                  <span class="line-through">¥ {{ originalPrice.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between items-center text-secondary">
                  <span class="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">优惠合计 <ChevronDown class="w-3 h-3"/></span>
                  <span>- ¥ {{ discountAmount.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between items-center text-secondary pl-4 text-xs opacity-80">
                  <span>商品折扣</span>
                  <span>- ¥ {{ discountAmount.toFixed(2) }}</span>
                </div>
              </div>

              <!-- Final Price -->
              <div class="flex justify-between items-end pt-2">
                <span class="text-on-surface font-bold text-base mb-1">到手价</span>
                <span class="text-4xl font-bold text-primary animate-glow">¥ {{ finalPrice.toFixed(2) }}</span>
              </div>

              <!-- Actions -->
              <div class="flex flex-col gap-3 mt-4">
                <button @click="handleBuyNow" :disabled="buyLoading" class="w-full py-4 bg-primary text-surface-container-lowest font-bold text-base rounded-xl hover:bg-primary-fixed transition-all duration-300 btn-glow flex items-center justify-center gap-2">
                  <Loader2 v-if="buyLoading" class="w-5 h-5 animate-spin" />
                  <Bolt v-else class="w-5 h-5" /> 立即购买
                </button>
                <button @click="handleAddToCart" class="w-full py-3 bg-surface-container border border-primary/30 text-primary font-bold text-sm rounded-xl hover:bg-primary/10 transition-all duration-300 flex items-center justify-center gap-2">
                  <ShoppingCart class="w-4 h-4" /> 加入购物车
                </button>
              </div>
              
              <p v-if="buyError" class="text-error text-xs text-center animate-pulse">{{ buyError }}</p>
              <p v-else-if="buySuccess" class="text-primary text-xs text-center animate-pulse">支付成功！资源已发放至您的仓库。</p>
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
import { ChevronRight, Bolt, FileText, AlertTriangle, ShoppingCart, Loader2, Check, Minus, Plus, MessageSquare, ChevronDown } from 'lucide-vue-next';
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

// --- Mocked Variant State ---
const types = ['账号', '代充', '家庭组账号', '下载号'];
const selectedType = ref('账号');

const packages = [
  {
    id: 1,
    name: '基础版',
    price: 38,
    features: ['仅支持免费版基础模型', '基础功能权限']
  },
  {
    id: 2,
    name: 'Pro 进阶版',
    price: 178,
    features: ['支持最新的 Pro 级模型', '支持全量文字与图像融合', '最多5名家庭成员共享权益'],
    recommended: true
  },
  {
    id: 3,
    name: 'Ultra 旗舰版',
    price: 599,
    features: ['提供最高模型和功能限制', '抢先体验 Project Mariner', '每月 25,000 AI 算力积分']
  }
];
const selectedPackage = ref(packages[1]);

const durations = [
  { id: 1, name: '12个月(优惠质保30天)', priceMod: 10 },
  { id: 2, name: '12个月(学生优惠质保20天)', priceMod: 0, tag: '热门推荐 (80%用户选择)' },
  { id: 3, name: '30天(全程质保)', priceMod: 21 }
];
const selectedDuration = ref(durations[1]);

const quantity = ref(1);

const increaseQuantity = () => quantity.value++;
const decreaseQuantity = () => { if (quantity.value > 1) quantity.value--; };

// Assume a flat 46 RMB discount logic per item for demonstration
const discountPerItem = 46;

const originalPrice = computed(() => {
  return (selectedPackage.value.price + selectedDuration.value.priceMod + discountPerItem) * quantity.value;
});

const discountAmount = computed(() => {
  return discountPerItem * quantity.value;
});

const finalPrice = computed(() => {
  return (selectedPackage.value.price + selectedDuration.value.priceMod) * quantity.value;
});

// --- API Calls ---
onMounted(async () => {
  try {
    const id = route.params.id;
    const res = await productsApi.getById(id as string);
    if (res.success) {
      product.value = res.data;
      // In a real scenario, we might initialize `packages[0].price = product.value.price`, but we use mock data.
    }
  } catch (e) { console.error('Failed to load product:', e); }
  loading.value = false;
});

const handleAddToCart = async () => {
  if (!store.isLoggedIn) { router.push('/login'); return; }
  if (!product.value) return;
  await store.addToCart(product.value.id); // Would pass variant IDs in a real app
};

const handleBuyNow = async () => {
  if (!store.isLoggedIn) { router.push('/login'); return; }
  if (!product.value) return;
  buyError.value = '';
  buySuccess.value = false;
  buyLoading.value = true;
  try {
    // In a real app, directBuy would take quantity and variant IDs. 
    // Here we just use the base directBuy.
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
  50% { filter: drop-shadow(0 0 15px rgba(0, 229, 255, 0.8)); }
}
.animate-glow { animation: glow 3s ease-in-out infinite; }

/* Hidden increment/decrement arrows in number input */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
