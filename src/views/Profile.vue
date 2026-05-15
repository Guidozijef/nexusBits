<template>
  <div class="pt-20 relative">
    <Navbar />
    
    <main class="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8 relative z-10">
      <!-- Left Sidebar: User Profile -->
      <aside class="w-full lg:w-1/4">
        <div v-if="profileLoading" class="glass-panel rounded-2xl p-8 flex flex-col items-center text-center space-y-8 animate-pulse">
          <div class="w-32 h-32 rounded-full bg-surface-container-highest"></div>
          <div class="h-6 bg-surface-container-highest rounded w-1/2"></div>
          <div class="h-4 bg-surface-container-highest rounded w-1/3"></div>
        </div>
        <div v-else class="glass-panel rounded-2xl p-8 flex flex-col items-center text-center space-y-8 animate-fade-in shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <!-- Avatar -->
          <div class="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/30 shadow-[0_0_20px_rgba(0,229,255,0.2)] relative group cursor-pointer">
            <img 
              :src="store.profile?.avatar_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'" 
              alt="Avatar"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-primary mb-1 text-glow-primary">{{ store.profile?.display_name || '未登录' }}</h2>
            <p class="text-[10px] text-on-surface-variant uppercase tracking-[0.3em] font-mono">{{ store.profile?.level || '精英' }}等级</p>
          </div>

          <div class="w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent"></div>

          <div class="w-full space-y-4">
            <div class="flex justify-between text-sm">
              <span class="text-on-surface-variant">钱包余额</span>
              <span class="text-primary font-bold">{{ store.balance.toFixed(2) }} NB</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-on-surface-variant">已拥有商品</span>
              <span class="text-on-surface font-bold">{{ ownedAssetsCount }}</span>
            </div>
          </div>

          <button @click="isRechargeOpen = true" class="w-full py-3 bg-primary text-surface font-bold text-sm rounded hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all duration-300 uppercase tracking-widest">
            充值余额
          </button>
        </div>

        <!-- Sidebar Nav -->
        <nav class="mt-8 flex flex-col gap-2">
          <button 
            v-for="item in menuItems" 
            :key="item.name"
            @click="activeTab = item.name"
            class="flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 text-left border border-transparent"
            :class="activeTab === item.name ? 'glass-panel text-primary border-primary/20 shadow-[0_0_15px_rgba(0,229,255,0.1)]' : 'text-on-surface-variant hover:bg-surface-container/30 hover:text-on-surface'"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span class="font-bold text-sm">{{ item.name }}</span>
          </button>
        </nav>
      </aside>

      <!-- Right Content -->
      <section class="w-full lg:w-3/4 flex flex-col gap-8">
        
        <!-- My Assets Tab -->
        <div v-if="activeTab === '我的商品'">
          <div class="border-b border-outline-variant/20 pb-6 mb-4">
            <h1 class="text-3xl font-bold text-on-surface tracking-tight">我的商品</h1>
          </div>

          <div v-if="assetsLoading" class="flex justify-center py-12">
            <Loader2 class="w-8 h-8 animate-spin text-primary" />
          </div>

          <div v-else-if="assets.length === 0" class="text-center text-on-surface-variant py-12">
            <p>您目前还没有拥有任何虚拟商品。</p>
            <router-link to="/all-assets" class="text-primary hover:underline mt-4 inline-block font-bold">前往市场选购</router-link>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              v-for="asset in assets" 
              :key="asset.id"
              class="glass-panel rounded-xl overflow-hidden p-6 flex gap-4 group hover:border-primary/30 transition-all duration-500"
            >
              <img :src="asset.product?.image_url" class="w-20 h-20 rounded object-cover border border-outline-variant/30" />
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-bold text-on-surface truncate group-hover:text-primary transition-colors">{{ asset.product?.name }}</h3>
                <p class="text-xs text-primary font-mono mt-1">许可密钥: {{ asset.license_key || '已授权' }}</p>
                <div class="flex gap-2 mt-4">
                  <button class="px-3 py-1 bg-primary text-surface rounded text-xs font-bold hover:shadow-[0_0_10px_rgba(0,229,255,0.4)] transition-all">
                    获取密钥
                  </button>
                  <button class="px-3 py-1 border border-outline-variant/30 text-on-surface hover:text-primary hover:border-primary/50 rounded text-xs font-bold transition-all">
                    下载源文件
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Orders Tab -->
        <div v-else-if="activeTab === '我的订单'">
          <div class="flex justify-between items-end border-b border-outline-variant/20 pb-6 mb-4">
            <h1 class="text-3xl font-bold text-on-surface tracking-tight">我的订单</h1>
          </div>

          <div v-if="ordersLoading" class="flex justify-center py-12">
            <Loader2 class="w-8 h-8 animate-spin text-primary" />
          </div>

          <div v-else-if="orders.length === 0" class="text-center text-on-surface-variant py-12">
            <p>暂无任何订单记录。</p>
          </div>

          <div v-else class="flex flex-col gap-4">
            <div 
              v-for="order in orders" 
              :key="order.id"
              class="glass-panel rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group hover:border-primary/30 transition-all duration-500"
              :class="{ 'opacity-60': order.status === '已过期' }"
            >
              <div class="flex flex-col gap-3">
                <div class="flex items-center gap-3">
                  <span class="text-[10px] font-mono text-outline">{{ order.order_no }}</span>
                  <span 
                    class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border"
                    :class="order.status === '已完成' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-surface-container-highest text-outline border-outline/30'"
                  >
                    {{ order.status }}
                  </span>
                </div>
                <h3 class="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                  {{ order.items && order.items.length > 0 ? order.items[0].product_name : '虚拟商品' }}
                  <span v-if="order.items && order.items.length > 1" class="text-sm text-on-surface-variant"> 等 {{ order.items.length }} 件商品</span>
                </h3>
                <p class="text-xs text-on-surface-variant font-mono">购买日期: {{ formatDate(order.created_at) }}</p>
              </div>

              <div class="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-8 md:gap-3">
                <span class="text-2xl font-bold" :class="order.status === '已完成' ? 'text-primary' : 'text-outline'">{{ order.total_amount }} NB</span>
                <div class="flex gap-2">
                  <button 
                    v-if="order.status === '已完成'"
                    class="px-4 py-1.5 border border-primary text-primary rounded hover:bg-primary/10 transition-all text-xs font-bold flex items-center gap-2"
                  >
                    <Key class="w-3.5 h-3.5" /> 获取密钥
                  </button>
                  <button 
                    v-if="order.status === '已完成'"
                    class="p-1.5 bg-surface-container-high text-on-surface hover:text-primary rounded transition-all"
                  >
                    <Download class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-else-if="activeTab === '设置'" class="animate-fade-in">
          <div class="border-b border-outline-variant/20 pb-6 mb-8">
            <h1 class="text-3xl font-bold text-on-surface tracking-tight">账户设置</h1>
          </div>
          <form @submit.prevent="saveSettings" class="glass-panel p-8 rounded-xl flex flex-col gap-6 max-w-2xl">
            <div>
              <label class="text-xs text-on-surface-variant uppercase mb-2 block">显示名称</label>
              <input v-model="settingsForm.displayName" type="text" class="w-full bg-surface-container/50 border border-outline-variant/30 rounded px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label class="text-xs text-on-surface-variant uppercase mb-2 block">安全邮箱</label>
              <input type="email" :value="store.session?.user?.email" disabled class="w-full bg-surface-container/30 border border-outline-variant/30 rounded px-4 py-2 text-on-surface-variant opacity-70 cursor-not-allowed" />
            </div>
            <div v-if="saveSuccess" class="text-primary text-sm">账户设置保存成功！</div>
            <div v-if="saveError" class="text-error text-sm">{{ saveError }}</div>
            <div class="pt-4 border-t border-outline-variant/20 flex gap-4">
              <button type="submit" :disabled="saveLoading" class="bg-primary text-surface px-6 py-2 rounded font-bold text-sm hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50">
                {{ saveLoading ? '保存中...' : '保存更改' }}
              </button>
              <button type="button" @click="handleLogout" class="border border-error/50 text-error hover:bg-error/10 px-6 py-2 rounded text-sm transition-all ml-auto">
                退出登录
              </button>
            </div>
          </form>
        </div>

      </section>
    </main>

    <!-- Recharge Modal -->
    <div v-if="isRechargeOpen" class="fixed inset-0 z-[200] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-md cursor-pointer" @click="isRechargeOpen = false"></div>
      <div class="relative glass-panel w-full max-w-md p-8 rounded-2xl border border-primary/30 shadow-[0_0_50px_rgba(0,229,255,0.15)] animate-fade-in">
        <button @click="isRechargeOpen = false" class="absolute top-4 right-4 text-on-surface-variant hover:text-primary"><X class="w-6 h-6"/></button>
        <h2 class="text-2xl font-bold text-primary mb-2">充值钱包余额</h2>
        <p class="text-sm text-on-surface-variant mb-6">选择充值金额，即时到账。</p>
        
        <div class="grid grid-cols-3 gap-3 mb-6">
          <button 
            v-for="amt in [100, 500, 1000, 2000, 5000, 10000]" 
            :key="amt"
            @click="selectedAmount = amt"
            class="py-3 rounded border transition-all font-mono text-sm"
            :class="selectedAmount === amt ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(0,229,255,0.3)]' : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-primary/50'"
          >
            {{ amt }}
          </button>
        </div>

        <button @click="confirmRecharge" :disabled="rechargeLoading" class="w-full py-3 bg-primary text-surface font-bold rounded btn-glow transition-all flex items-center justify-center gap-2">
          <Loader2 v-if="rechargeLoading" class="w-5 h-5 animate-spin" />
          确认充值 {{ selectedAmount }} NB
        </button>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { 
  FolderLock,
  ListTodo, 
  Settings, 
  Key, 
  Download, 
  X,
  Loader2
} from 'lucide-vue-next';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { store } from '../store';
import { userApi, ordersApi } from '../api';

const router = useRouter();
const activeTab = ref('我的订单');
const isRechargeOpen = ref(false);
const selectedAmount = ref(1000);

const profileLoading = ref(false);
const ordersLoading = ref(false);
const assetsLoading = ref(false);
const rechargeLoading = ref(false);

const orders = ref<any[]>([]);
const assets = ref<any[]>([]);
const ownedAssetsCount = ref(0);

const saveLoading = ref(false);
const saveSuccess = ref(false);
const saveError = ref('');

const settingsForm = reactive({
  displayName: ''
});

const menuItems = [
  // { name: '我的商品', icon: FolderLock },
  { name: '我的订单', icon: ListTodo },
  { name: '设置', icon: Settings },
];

const loadProfileData = async () => {
  profileLoading.value = true;
  await store.fetchProfile();
  if (store.profile) {
    settingsForm.displayName = store.profile.display_name;
  }
  profileLoading.value = false;
};

const loadOrders = async () => {
  ordersLoading.value = true;
  try {
    const res = await ordersApi.list();
    if (res.success) {
      orders.value = res.data;
    }
  } catch (e) {
    console.error('Failed to load orders:', e);
  }
  ordersLoading.value = false;
};

const loadAssets = async () => {
  assetsLoading.value = true;
  try {
    const res = await userApi.getAssets();
    if (res.success) {
      assets.value = res.data;
      ownedAssetsCount.value = res.data.length;
    }
  } catch (e) {
    console.error('Failed to load assets:', e);
  }
  assetsLoading.value = false;
};

const confirmRecharge = async () => {
  rechargeLoading.value = true;
  try {
    const res = await store.recharge(selectedAmount.value);
    if (res.success) {
      isRechargeOpen.value = false;
    }
  } catch (e) {
    console.error('Recharge failed:', e);
  }
  rechargeLoading.value = false;
};

const saveSettings = async () => {
  saveLoading.value = true;
  saveSuccess.value = false;
  saveError.value = '';
  try {
    const res = await store.updateProfile({ display_name: settingsForm.displayName });
    if (res.success) {
      saveSuccess.value = true;
    } else {
      saveError.value = res.error || '保存失败';
    }
  } catch (e: any) {
    saveError.value = e.message || '保存错误';
  }
  saveLoading.value = false;
};

const handleLogout = async () => {
  await store.logout();
  router.push('/login');
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
};

watch(activeTab, (newTab) => {
  if (newTab === '我的订单') {
    loadOrders();
  } else if (newTab === '我的商品') {
    loadAssets();
  }
});

onMounted(async () => {
  if (!store.isLoggedIn) {
    router.push('/login');
    return;
  }
  await Promise.all([
    loadProfileData(),
    loadAssets()
  ]);
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}
</style>
