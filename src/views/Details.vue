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
            <!-- Header Section (replaces Cover Image) -->
            <div class="glass-panel p-6 md:p-8 rounded-2xl flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden group/header">
              <!-- Background Ambient Glow -->
              <div class="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover/header:bg-primary/20"></div>
              
              <!-- Product Square Image -->
              <div class="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 shrink-0 rounded-2xl overflow-hidden border border-outline-variant/30 bg-surface-container/50 relative shadow-[0_0_25px_rgba(0,229,255,0.1)]">
                <img :src="product.image_url" :alt="product.name" class="w-full h-full object-cover filter group-hover/header:scale-110 transition-transform duration-500" />
              </div>
              
              <!-- Product Info & Trust Badges -->
              <div class="flex flex-col justify-center gap-4 flex-grow w-full z-10 h-full">
                <!-- Title & Tags -->
                <div>
                  <div class="flex gap-2 mb-3">
                    <span class="px-2 py-0.5 bg-primary/10 border border-primary/30 rounded text-[10px] font-bold text-primary">{{ product.asset_type || product.tag }}</span>
                    <span v-if="product.file_format" class="px-2 py-0.5 bg-secondary/10 border border-secondary/30 rounded text-[10px] font-bold text-secondary">{{ product.file_format }}</span>
                  </div>
                  <h1 class="text-2xl md:text-3xl font-bold text-on-surface tracking-tight mb-2">{{ product.name }}</h1>
                  <p class="text-sm text-on-surface-variant line-clamp-2 max-w-xl">{{ product.description }}</p>
                </div>
                
                <div class="h-px w-full bg-gradient-to-r from-outline-variant/30 to-transparent my-1"></div>

                <!-- Trust Badges Row -->
                <div class="flex flex-wrap items-center gap-6 md:gap-10">
                  <!-- Badge 1 -->
                  <div class="flex items-center gap-3 group/badge cursor-default">
                    <div class="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/30 text-on-surface-variant group-hover/badge:border-primary/50 group-hover/badge:text-primary transition-all shadow-inner">
                      <ShieldCheck class="w-4 h-4" />
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-on-surface group-hover/badge:text-primary transition-colors">官方渠道</span>
                      <span class="text-[10px] text-on-surface-variant">渠道正规可查</span>
                    </div>
                  </div>
                  <!-- Badge 2 -->
                  <div class="flex items-center gap-3 group/badge cursor-default">
                    <div class="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/30 text-on-surface-variant group-hover/badge:border-primary/50 group-hover/badge:text-primary transition-all shadow-inner">
                      <Zap class="w-4 h-4" />
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-on-surface group-hover/badge:text-primary transition-colors">极速发货</span>
                      <span class="text-[10px] text-on-surface-variant">付款后尽快处理</span>
                    </div>
                  </div>
                  <!-- Badge 3 -->
                  <div class="flex items-center gap-3 group/badge cursor-default">
                    <div class="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/30 text-on-surface-variant group-hover/badge:border-primary/50 group-hover/badge:text-primary transition-all shadow-inner">
                      <Headset class="w-4 h-4" />
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-on-surface group-hover/badge:text-primary transition-colors">售后无忧</span>
                      <span class="text-[10px] text-on-surface-variant">24小时在线服务</span>
                    </div>
                  </div>
                </div>

                <!-- Text Tags -->
                <div class="flex flex-wrap gap-2 mt-2">
                  <span class="text-[10px] px-2.5 py-1 rounded border border-outline-variant/20 text-on-surface-variant bg-surface-container hover:border-primary/30 hover:text-on-surface transition-colors cursor-default">订单全程可查</span>
                  <span class="text-[10px] px-2.5 py-1 rounded border border-outline-variant/20 text-on-surface-variant bg-surface-container hover:border-primary/30 hover:text-on-surface transition-colors cursor-default">支付状态实时同步</span>
                  <span class="text-[10px] px-2.5 py-1 rounded border border-outline-variant/20 text-on-surface-variant bg-surface-container hover:border-primary/30 hover:text-on-surface transition-colors cursor-default">异常订单支持人工复核</span>
                </div>
              </div>
            </div>

            <!-- 1. Type Selection -->
            <div class="flex flex-col gap-4">
              <!-- Type Selection -->
              <div v-if="product.types && product.types.length > 0" class="flex flex-col gap-3">
                <div class="flex items-center gap-2 border-l-4 border-primary pl-3">
                  <h3 class="text-lg font-bold text-on-surface tracking-wide">类型</h3>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button v-for="(type, idx) in product.types" :key="idx"
                    @click="selectedType = idx"
                    class="px-4 py-2 rounded-full border transition-all duration-300 text-sm font-medium"
                    :class="selectedType === idx ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(0,229,255,0.2)]' : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/50'">
                    {{ type }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 2. Package Selection -->
            <div class="flex flex-col gap-4">
              <!-- Package Selection -->
              <div v-if="availablePackages.length > 0" class="flex flex-col gap-3">
                <div class="flex items-center gap-2 border-l-4 border-primary pl-3">
                  <h3 class="text-lg font-bold text-on-surface tracking-wide">套餐</h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div v-for="pkg in availablePackages" :key="pkg.id"
                  @click="selectedPackage = pkg"
                  class="glass-panel p-6 rounded-xl flex flex-col gap-4 cursor-pointer transition-all duration-300 relative border-2 overflow-hidden"
                  :class="selectedPackage?.id === pkg.id ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(0,229,255,0.25)] scale-[1.02]' : 'border-outline-variant/20 hover:border-primary/40'"
                >
                  <!-- Decorative Selected Corner -->
                  <div v-if="selectedPackage?.id === pkg.id" class="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 blur-xl pointer-events-none transition-all"></div>
                  <div v-if="selectedPackage?.id === pkg.id" class="absolute top-0 right-0 bg-primary rounded-bl-xl w-8 h-8 flex items-center justify-center shadow-md transition-all">
                    <Check class="w-5 h-5 text-surface-container-lowest" stroke-width="3" />
                  </div>

                  <div v-if="pkg.recommended" class="absolute top-0 left-0 bg-gradient-to-r from-primary to-[#00b0ff] text-surface-container-lowest text-[10px] font-bold px-3 py-1 rounded-br-xl rounded-tl-xl shadow-[0_2px_10px_rgba(0,229,255,0.4)] z-10">
                    推荐
                  </div>
                  <div class="text-center pb-4 border-b border-outline-variant/20">
                    <h4 class="text-base font-bold text-on-surface">{{ pkg.name }}</h4>
                    <div class="text-3xl font-bold text-primary mt-3 flex items-baseline justify-center gap-1">
                      <span class="text-lg">¥</span>{{ pkg.price }}
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
            </div>

            <!-- 3. Duration Selection -->
            <div class="flex flex-col gap-4">
              <!-- Duration Selection -->
              <div v-if="availableDurations.length > 0" class="flex flex-col gap-3">
                <div class="flex items-center gap-2 border-l-4 border-primary pl-3">
                  <h3 class="text-lg font-bold text-on-surface tracking-wide">时长</h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div v-for="dur in availableDurations" :key="dur.id"
                  @click="selectedDuration = dur"
                  class="glass-panel p-4 rounded-xl flex flex-col justify-center cursor-pointer transition-all duration-300 relative border-2 min-h-[80px] overflow-hidden"
                  :class="selectedDuration?.id === dur.id ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(0,229,255,0.25)] scale-[1.02]' : 'border-outline-variant/20 hover:border-primary/40'"
                >
                  <!-- Decorative Selected Corner -->
                  <div v-if="selectedDuration?.id === dur.id" class="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 blur-xl pointer-events-none transition-all"></div>
                  <div v-if="selectedDuration?.id === dur.id" class="absolute top-0 right-0 bg-primary rounded-bl-xl w-7 h-7 flex items-center justify-center shadow-md transition-all">
                    <Check class="w-4 h-4 text-surface-container-lowest" stroke-width="3" />
                  </div>

                  <div v-if="dur.tag" class="absolute top-0 left-0 bg-gradient-to-r from-secondary to-[#ff0055] text-surface-container-lowest text-[10px] font-bold px-3 py-1 rounded-br-xl rounded-tl-xl shadow-[0_2px_10px_rgba(255,42,109,0.4)] z-10">
                    {{ dur.tag }}
                  </div>
                  <div class="flex justify-between items-center w-full gap-2">
                    <span class="text-sm font-medium text-on-surface leading-tight">{{ dur.name }}</span>
                    <span class="text-base font-bold text-primary shrink-0">¥ {{ (selectedPackage?.price || 0) + (dur.price_modifier || 0) }}</span>
                  </div>
                </div>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="glass-panel p-8 rounded-2xl flex flex-col gap-6 mt-4">
              <h2 class="text-xl font-bold text-on-surface border-b border-outline-variant/30 pb-4 flex items-center gap-2">
                <FileText class="w-5 h-5 text-primary" /> 商品介绍
              </h2>
              <div class="text-on-surface-variant leading-relaxed text-sm rich-text-content" v-html="product.long_description || product.description">
              </div>
            </div>

            <!-- Notes -->
            <div class="glass-panel p-8 rounded-2xl flex flex-col gap-6 border border-error/20 bg-error/5 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-error/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
              <h2 class="text-xl font-bold text-error border-b border-error/20 pb-4 flex items-center gap-2 relative z-10">
                <AlertTriangle class="w-5 h-5" /> 注意事项
              </h2>
              <ul class="text-on-surface-variant space-y-3 leading-relaxed text-sm list-disc pl-5 relative z-10">
                <template v-if="product.notices && product.notices.length > 0">
                  <li v-for="(notice, idx) in product.notices" :key="idx" v-html="notice"></li>
                </template>
                <template v-else>
                  <li>此商品为数字加密虚拟商品，一经购买获取密钥后，<span class="text-error font-bold">概不退款</span>。</li>
                  <li>附带的商业授权允许您在无限制的最终商业项目中合法使用，但严禁将原始模型与代码文件直接转售或进行任何形式的重新打包分发。</li>
                  <li>如需部署至生产级主网环境，请务必确保您的宿主服务器具备足够资源支持其实时重构机制。</li>
                </template>
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
                  <span>总计</span>
                  <span>¥ {{ totalPrice.toFixed(2) }}</span>
                </div>
              </div>

              <!-- Final Price -->
              <div class="flex justify-between items-end pt-2">
                <span class="text-on-surface font-bold text-base mb-1">到手价</span>
                <span class="text-4xl font-bold text-primary animate-glow">¥ {{ totalPrice.toFixed(2) }}</span>
              </div>

              <!-- Actions -->
              <div class="flex flex-col gap-3 mt-4">
                <button @click="handleBuyNow" class="w-full py-4 bg-primary text-surface-container-lowest font-bold text-base rounded-xl hover:bg-primary-fixed transition-all duration-300 btn-glow flex items-center justify-center gap-2">
                  <Bolt class="w-5 h-5" /> 去结算
                </button>
                <button @click="handleAddToCart" class="w-full py-3 bg-surface-container border border-primary/30 text-primary font-bold text-sm rounded-xl hover:bg-primary/10 transition-all duration-300 flex items-center justify-center gap-2">
                  <ShoppingCart class="w-4 h-4" /> 加入购物车
                </button>
              </div>
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
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronRight, Bolt, FileText, AlertTriangle, ShoppingCart, Loader2, Check, Minus, Plus, MessageSquare, ChevronDown, ShieldCheck, Zap, Headset } from 'lucide-vue-next';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { store } from '../store';
import { productsApi } from '../api';

const route = useRoute();
const router = useRouter();
const product = ref<any>(null);
const loading = ref(true);

const selectedType = ref(0);
const selectedPackage = ref<any>(null);
const selectedDuration = ref<any>(null);

const quantity = ref(1);

const increaseQuantity = () => quantity.value++;
const decreaseQuantity = () => { if (quantity.value > 1) quantity.value--; };

// --- Hierarchical Filtering ---
const availablePackages = computed(() => {
  if (!product.value?.packages) return [];
  return product.value.packages.filter((p: any) => !p.type_idxs || p.type_idxs.includes(selectedType.value));
});

const availableDurations = computed(() => {
  if (!product.value?.durations) return [];
  return product.value.durations.filter((d: any) => !d.pkg_ids || d.pkg_ids.includes(selectedPackage.value?.id));
});

// Auto-select valid options when parent changes
watch(selectedType, () => {
  if (availablePackages.value.length > 0) {
    if (!availablePackages.value.find((p: any) => p.id === selectedPackage.value?.id)) {
      selectedPackage.value = availablePackages.value.find((p: any) => p.recommended) || availablePackages.value[0];
    }
  } else {
    selectedPackage.value = null;
  }
});

watch(selectedPackage, () => {
  if (availableDurations.value.length > 0) {
    if (!availableDurations.value.find((d: any) => d.id === selectedDuration.value?.id)) {
      selectedDuration.value = availableDurations.value[0];
    }
  } else {
    selectedDuration.value = null;
  }
});

// --- Computed Pricing ---
const totalPrice = computed(() => {
  if (!product.value) return 0;
  let base = product.value.price || 0;
  if (selectedPackage.value) base = selectedPackage.value.price;
  if (selectedDuration.value) base += selectedDuration.value.price_modifier;
  return base * quantity.value;
});

// --- API Calls ---
onMounted(async () => {
  try {
    const id = route.params.id;
    const res = await productsApi.getById(id as string);
    if (res.success) {
      product.value = res.data;
      if (availablePackages.value.length > 0) {
        selectedPackage.value = availablePackages.value.find((p: any) => p.recommended) || availablePackages.value[0];
      }
      if (availableDurations.value.length > 0) {
        selectedDuration.value = availableDurations.value[0];
      }
    }
  } catch (e) { console.error('Failed to load product:', e); }
  loading.value = false;
});

const handleAddToCart = async () => {
  if (!store.isLoggedIn) { router.push('/login'); return; }
  if (!product.value) return;
  await store.addToCart(product.value.id); // Would pass variant IDs in a real app
};

const handleBuyNow = () => {
  if (!store.isLoggedIn) { router.push('/login'); return; }
  if (!product.value) return;
  router.push({
    path: `/checkout/${product.value.id}`,
    query: {
      qty: quantity.value,
      pkg: selectedPackage.value?.id,
      dur: selectedDuration.value?.id,
      type_idx: selectedType.value
    }
  });
};
</script>

<style scoped>
.btn-glow {
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.2);
}
.btn-glow:hover {
  box-shadow: 0 0 25px rgba(0, 229, 255, 0.4);
}
.animate-glow {
  text-shadow: 0 0 20px rgba(0, 229, 255, 0.5);
  animation: pulse-glow 3s infinite alternate;
}
@keyframes pulse-glow {
  0% { text-shadow: 0 0 10px rgba(0, 229, 255, 0.3); }
  100% { text-shadow: 0 0 30px rgba(0, 229, 255, 0.8); }
}

/* Rich Text Content Styles */
.rich-text-content :deep(p) { margin-bottom: 1rem; line-height: 1.6; }
.rich-text-content :deep(p:last-child) { margin-bottom: 0; }
.rich-text-content :deep(img) { 
  max-width: 100%; 
  border-radius: 0.75rem; 
  margin-top: 1rem; 
  margin-bottom: 1rem; 
  border: 1px solid rgba(255, 255, 255, 0.1); 
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
.rich-text-content :deep(strong), .rich-text-content :deep(b) { color: var(--on-surface); font-weight: 700; }
.rich-text-content :deep(a) { color: #00E5FF; text-decoration: none; transition: color 0.2s; }
.rich-text-content :deep(a:hover) { color: #80f2ff; text-decoration: underline; }
.rich-text-content :deep(ul) { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
.rich-text-content :deep(ol) { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
.rich-text-content :deep(li) { margin-bottom: 0.25rem; }
.rich-text-content :deep(h1), .rich-text-content :deep(h2), .rich-text-content :deep(h3), .rich-text-content :deep(h4) {
  color: var(--on-surface);
  font-weight: bold;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
.rich-text-content :deep(br) { display: block; content: ""; margin-top: 0.5rem; }

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
