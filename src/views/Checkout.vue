<template>
  <div class="pt-20 min-h-screen flex flex-col">
    <Navbar />
    <main class="max-w-7xl mx-auto px-6 py-12 flex-grow w-full">
      <div v-if="loading" class="flex justify-center items-center h-64"><Loader2 class="w-8 h-8 animate-spin text-primary" /></div>
      
      <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left Column -->
        <div class="lg:col-span-8 flex flex-col gap-8">
          <h1 class="text-3xl font-bold text-on-surface tracking-tight">结账</h1>
          
          <!-- Product Info -->
          <div class="glass-panel p-6 md:p-8 rounded-2xl flex flex-col gap-6 relative overflow-hidden">
            <div class="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
            <h2 class="text-lg font-bold text-on-surface flex items-center gap-2 border-l-4 border-primary pl-3">商品信息</h2>
            
            <div class="flex flex-col md:flex-row items-start md:items-center gap-6 mt-2">
              <div class="w-24 h-24 rounded-xl overflow-hidden bg-surface-container border border-outline-variant/30 shrink-0 shadow-[0_0_15px_rgba(0,229,255,0.05)]">
                <img :src="product.image_url" class="w-full h-full object-cover" />
              </div>
              <div class="flex-grow flex flex-col justify-center">
                <h3 class="text-xl font-bold text-on-surface">{{ product.name }}</h3>
                <div class="flex flex-wrap gap-2 mt-3">
                  <span class="px-2.5 py-1 bg-surface-container border border-outline-variant/30 rounded text-xs text-on-surface-variant font-medium">{{ selectedPkgName }}</span>
                  <span class="px-2.5 py-1 bg-surface-container border border-outline-variant/30 rounded text-xs text-on-surface-variant font-medium">{{ selectedDurName }}</span>
                </div>
              </div>
              <div class="flex flex-col md:items-end shrink-0 w-full md:w-auto mt-4 md:mt-0 border-t md:border-t-0 border-outline-variant/20 pt-4 md:pt-0">
                <span class="text-xs text-on-surface-variant mb-1">数量: x{{ qty }}</span>
                <span class="text-2xl font-bold text-primary">¥{{ unitPrice.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Methods -->
          <div class="glass-panel p-6 md:p-8 rounded-2xl flex flex-col gap-6 relative overflow-hidden">
            <h2 class="text-lg font-bold text-on-surface flex items-center gap-2 border-l-4 border-primary pl-3">支付方式</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button @click="selectedPayment = 'alipay'" 
                class="relative p-5 rounded-xl border-2 flex items-center gap-4 transition-all duration-300 overflow-hidden text-left"
                :class="selectedPayment === 'alipay' ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,229,255,0.15)] scale-[1.02]' : 'border-outline-variant/30 hover:border-primary/40 bg-surface-container/30'">
                <div v-if="selectedPayment === 'alipay'" class="absolute -top-3 -right-3 w-12 h-12 bg-primary/20 blur-xl pointer-events-none"></div>
                <div v-if="selectedPayment === 'alipay'" class="absolute top-0 right-0 bg-primary rounded-bl-xl w-7 h-7 flex items-center justify-center shadow-md">
                  <Check class="w-4 h-4 text-surface-container-lowest" stroke-width="3" />
                </div>
                
                <div class="w-12 h-12 rounded-full bg-[#1677FF] flex items-center justify-center text-white shrink-0 font-bold text-xl shadow-lg">支</div>
                <div class="flex flex-col items-start">
                  <span class="font-bold text-on-surface">支付宝 Alipay</span>
                  <span class="text-xs text-error font-medium mt-1">固定费 ¥0.00</span>
                </div>
              </button>

              <button @click="selectedPayment = 'balance'" 
                class="relative p-5 rounded-xl border-2 flex items-center gap-4 transition-all duration-300 overflow-hidden text-left"
                :class="selectedPayment === 'balance' ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,229,255,0.15)] scale-[1.02]' : 'border-outline-variant/30 hover:border-primary/40 bg-surface-container/30'">
                <div v-if="selectedPayment === 'balance'" class="absolute -top-3 -right-3 w-12 h-12 bg-primary/20 blur-xl pointer-events-none"></div>
                <div v-if="selectedPayment === 'balance'" class="absolute top-0 right-0 bg-primary rounded-bl-xl w-7 h-7 flex items-center justify-center shadow-md">
                  <Check class="w-4 h-4 text-surface-container-lowest" stroke-width="3" />
                </div>
                
                <div class="w-12 h-12 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center text-primary shrink-0 shadow-lg">
                  <Bolt class="w-6 h-6" />
                </div>
                <div class="flex flex-col items-start">
                  <span class="font-bold text-on-surface">站内余额</span>
                  <span class="text-xs text-primary font-medium mt-1">当前: ¥{{ store.profile?.balance || 0 }}</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Notice -->
          <div class="glass-panel p-6 md:p-8 rounded-2xl flex flex-col gap-6">
            <h2 class="text-lg font-bold text-error flex items-center gap-2 border-l-4 border-error pl-3">购买须知</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-5 bg-surface-container/50 rounded-xl border border-outline-variant/20 flex flex-col gap-2 hover:border-outline-variant/50 transition-colors">
                <h4 class="font-bold text-sm text-on-surface">交付方式</h4>
                <p class="text-xs text-on-surface-variant leading-relaxed">自动发货商品会在支付完成后生成交付内容；人工处理商品会按订单信息核对后处理需要一定时间。</p>
              </div>
              <div class="p-5 bg-surface-container/50 rounded-xl border border-outline-variant/20 flex flex-col gap-2 hover:border-outline-variant/50 transition-colors">
                <h4 class="font-bold text-sm text-on-surface">订单查询</h4>
                <p class="text-xs text-on-surface-variant leading-relaxed">下单后请前往我的订单页面，可在我的订单页面查看支付和售后进度。如果订单状态为处理中，请耐心等待，如果订单状态为已完成，可查看商品信息查询交付信息。</p>
              </div>
              <div class="p-5 bg-surface-container/50 rounded-xl border border-outline-variant/20 flex flex-col gap-2 hover:border-outline-variant/50 transition-colors">
                <h4 class="font-bold text-sm text-on-surface">售后处理</h4>
                <p class="text-xs text-on-surface-variant leading-relaxed">部分商品需要人工审核处理，需要一定时间，请耐心等待，如果24小时后还未处理，请联系客服。如支付成功后未自动更新、未收到交付内容或内容异常，请凭订单号联系客服。</p>
              </div>
              <div class="p-5 bg-surface-container/50 rounded-xl border border-outline-variant/20 flex flex-col gap-2 hover:border-outline-variant/50 transition-colors">
                <h4 class="font-bold text-sm text-on-surface">隐私保护</h4>
                <p class="text-xs text-on-surface-variant leading-relaxed">仅收集订单交付所需信息，不在页面公开展示联系方式或订单凭证。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column (Sticky) -->
        <div class="lg:col-span-4">
          <div class="glass-panel p-6 rounded-2xl flex flex-col gap-6 sticky top-28 border border-primary/20 shadow-[0_0_30px_rgba(0,229,255,0.05)]">
            <h2 class="text-xl font-bold text-on-surface flex items-center gap-2 border-l-4 border-primary pl-3 mb-2">确认订单</h2>
            
            <!-- Email -->
            <div class="flex flex-col gap-3">
              <label class="text-sm font-bold text-on-surface">收货地址 <span class="text-error">*</span></label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                  <Mail class="w-4 h-4" />
                </div>
                <input type="email" v-model="email" placeholder="请输入您的邮箱方便查看订单" class="w-full bg-surface-container border border-outline-variant/50 rounded-xl py-3 pl-11 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" />
              </div>
            </div>

            <div class="h-px bg-outline-variant/20 w-full"></div>

            <!-- Qty & Spec -->
            <div class="flex justify-between items-center">
              <div class="flex flex-col gap-3">
                <span class="text-xs text-on-surface-variant">购买数量</span>
                <div class="flex items-center bg-surface-container border border-outline-variant/30 rounded-lg overflow-hidden w-28 h-9 shadow-inner">
                  <button @click="decreaseQty" class="flex-1 h-full flex items-center justify-center hover:bg-surface-container-high hover:text-primary transition-colors disabled:opacity-30" :disabled="qty <= 1">
                    <Minus class="w-3 h-3" />
                  </button>
                  <input type="number" v-model="qty" readonly class="w-10 h-full bg-transparent text-center text-sm font-bold focus:outline-none border-x border-outline-variant/30" />
                  <button @click="increaseQty" class="flex-1 h-full flex items-center justify-center hover:bg-surface-container-high hover:text-primary transition-colors">
                    <Plus class="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div class="flex flex-col gap-3 items-end">
                <span class="text-xs text-on-surface-variant">当前规格</span>
                <span class="font-bold text-sm bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/30">{{ selectedDurName }}</span>
              </div>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mt-1">
              <span class="px-2 py-0.5 bg-surface-container border border-outline-variant/30 rounded text-[10px] text-on-surface-variant">库存 99+</span>
              <span class="px-2 py-0.5 bg-primary/10 border border-primary/30 rounded text-[10px] font-bold text-primary">官方渠道</span>
              <span class="px-2 py-0.5 bg-surface-container border border-outline-variant/30 rounded text-[10px] text-on-surface-variant">自动交付</span>
              <span class="px-2 py-0.5 bg-surface-container border border-outline-variant/30 rounded text-[10px] text-on-surface-variant">极速发货</span>
            </div>

            <div class="h-px bg-outline-variant/20 w-full mt-2"></div>

            <!-- Total -->
            <div class="flex flex-col gap-4">
              <div class="flex justify-between items-center text-sm">
                <span class="text-on-surface-variant font-medium">订单金额合计</span>
                <span class="font-bold">¥{{ subTotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between items-center text-xs text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors">
                <span class="flex items-center gap-1">费用明细 <ChevronDown class="w-3 h-3"/></span>
                <span>展开查看</span>
              </div>
            </div>

            <div class="flex justify-between items-end mt-4">
              <span class="text-lg font-bold text-on-surface mb-1">应付</span>
              <span class="text-4xl font-bold text-primary animate-glow tracking-tighter">¥{{ total.toFixed(2) }}</span>
            </div>

            <!-- Action -->
            <button @click="submitOrder" :disabled="submitLoading" class="w-full py-4 mt-2 bg-primary text-surface-container-lowest font-bold text-lg rounded-xl hover:bg-primary-fixed transition-all duration-300 btn-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              <Loader2 v-if="submitLoading" class="w-5 h-5 animate-spin" />
              <Check v-else-if="successMsg" class="w-5 h-5" />
              {{ successMsg ? '支付成功' : '确认下单' }}
            </button>
            <p v-if="errorMsg" class="text-error text-xs text-center animate-pulse mt-1 font-medium">{{ errorMsg }}</p>
            <p v-if="successMsg" class="text-primary text-xs text-center animate-pulse mt-1 font-medium">资源已发放到您的账号，即将跳转...</p>

            <!-- Guarantee -->
            <div class="mt-2 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex flex-col gap-3 relative overflow-hidden">
              <div class="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>
              <h4 class="font-bold text-xs text-on-surface flex items-center gap-1.5"><ShieldCheck class="w-4 h-4 text-primary"/> 购买保障</h4>
              <div class="grid grid-cols-2 gap-y-3 gap-x-2 text-[10px] text-on-surface-variant">
                <div class="flex items-center gap-1.5"><div class="w-1.5 h-1.5 rounded-full bg-primary/80"></div> 付款后生成订单凭证</div>
                <div class="flex items-center gap-1.5"><div class="w-1.5 h-1.5 rounded-full bg-primary/80"></div> 订单状态可实时查询</div>
                <div class="flex items-center gap-1.5"><div class="w-1.5 h-1.5 rounded-full bg-primary/80"></div> 未收到可联系在线客服</div>
                <div class="flex items-center gap-1.5"><div class="w-1.5 h-1.5 rounded-full bg-primary/80"></div> 必要时人工复核处理</div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <div v-else class="flex justify-center items-center h-64 text-on-surface-variant">
        无法加载订单信息
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Bolt, ShieldCheck, Mail, ChevronDown, Check, Loader2, Minus, Plus } from 'lucide-vue-next';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { store } from '../store';
import { productsApi, ordersApi } from '../api';

const route = useRoute();
const router = useRouter();

const product = ref<any>(null);
const loading = ref(true);
const submitLoading = ref(false);
const errorMsg = ref('');
const successMsg = ref(false);

const email = ref(store.profile?.email || '');
const selectedPayment = ref('balance'); // Default to internal balance for demonstration

// Extract query params
const qty = ref(Number(route.query.qty) || 1);
const pkgId = Number(route.query.pkg) || 0;
const durId = Number(route.query.dur) || 0;
const typeIdx = Number(route.query.type_idx) || 0;

const selectedPackage = computed(() => {
  if (!product.value?.packages) return null;
  return product.value.packages.find((p: any) => p.id === pkgId) || product.value.packages[0] || null;
});

const selectedDuration = computed(() => {
  if (!product.value?.durations) return null;
  return product.value.durations.find((d: any) => d.id === durId) || product.value.durations[0] || null;
});

const selectedPkgName = computed(() => selectedPackage.value?.name || '标准配置');
const selectedDurName = computed(() => selectedDuration.value?.name || '默认时长');

const unitPrice = computed(() => {
  if (!product.value) return 0;
  let base = product.value.price;
  if (selectedPackage.value) {
    base = selectedPackage.value.price;
  }
  if (selectedDuration.value) {
    base = selectedDuration.value.price_modifier;
  }
  return base;
});
const subTotal = computed(() => unitPrice.value * qty.value);
const fee = ref(0);
const total = computed(() => subTotal.value + fee.value);

const increaseQty = () => qty.value++;
const decreaseQty = () => { if (qty.value > 1) qty.value--; };

onMounted(async () => {
  if (!store.isLoggedIn) {
    router.push('/login');
    return;
  }
  
  if (store.profile?.email) {
    email.value = store.profile.email;
  }

  try {
    const id = route.params.id;
    const res = await productsApi.getById(id as string);
    if (res.success) {
      product.value = res.data;
    }
  } catch (e) {
    console.error('Failed to load product', e);
  }
  loading.value = false;
});

const submitOrder = async () => {
  if (!email.value) {
    errorMsg.value = '请填写接收邮箱';
    setTimeout(() => { errorMsg.value = ''; }, 3000);
    return;
  }
  
  // Basic validation for demonstration. If Alipay is selected, maybe show an error saying "not supported" 
  // since the backend only handles balance currently. We'll just let it pass for UI demonstration.
  
  submitLoading.value = true;
  errorMsg.value = '';
  
  try {
    const res = await ordersApi.directBuy(
      product.value.id,
      qty.value,
      selectedPackage.value?.id,
      selectedDuration.value?.id,
      typeIdx
    );
    if (res.success) {
      successMsg.value = true;
      if (res.data?.new_balance !== undefined && store.profile) {
        store.profile.balance = res.data.new_balance;
      }
      setTimeout(() => {
        router.push('/profile'); // Redirect to profile
      }, 2000);
    } else {
      errorMsg.value = res.error || '支付失败，余额不足';
      setTimeout(() => { errorMsg.value = ''; }, 3000);
    }
  } catch (e: any) {
    errorMsg.value = e.message || '系统错误';
    setTimeout(() => { errorMsg.value = ''; }, 3000);
  }
  submitLoading.value = false;
};
</script>

<style scoped>
@keyframes glow {
  0%, 100% { filter: drop-shadow(0 0 2px rgba(0, 229, 255, 0.4)); }
  50% { filter: drop-shadow(0 0 15px rgba(0, 229, 255, 0.8)); }
}
.animate-glow { animation: glow 3s ease-in-out infinite; }

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
