<template>
  <div class="pt-20 relative">
    <Navbar />
    
    <main class="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8 relative z-10">
      <!-- Left Sidebar: User Profile -->
      <aside class="w-full lg:w-1/4">
        <div class="glass-panel rounded-2xl p-8 flex flex-col items-center text-center space-y-8 animate-fade-in shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <!-- Avatar -->
          <div class="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/30 shadow-[0_0_20px_rgba(0,229,255,0.2)] relative group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80" 
              alt="Cipher_99"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-primary mb-1 text-glow-primary">Cipher_99</h2>
            <p class="text-[10px] text-on-surface-variant uppercase tracking-[0.3em] font-mono">精英等级</p>
          </div>

          <div class="w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent"></div>

          <div class="w-full space-y-4">
            <div class="flex justify-between text-sm">
              <span class="text-on-surface-variant">钱包余额</span>
              <span class="text-primary font-bold">{{ store.balance.toFixed(2) }} NX</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-on-surface-variant">已拥有资产</span>
              <span class="text-on-surface font-bold">14</span>
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
        
        <!-- Orders Tab -->
        <div v-if="activeTab === '我的订单'">
          <div class="flex justify-between items-end border-b border-outline-variant/20 pb-6 mb-4">
            <h1 class="text-3xl font-bold text-on-surface tracking-tight">我的订单</h1>
            <div class="flex gap-4">
              <button class="p-2 text-on-surface-variant hover:text-primary transition-colors">
                <Filter class="w-5 h-5" />
              </button>
              <button class="p-2 text-on-surface-variant hover:text-primary transition-colors">
                <ArrowDownNarrowWide class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-4">
            <div 
              v-for="order in orders" 
              :key="order.id"
              class="glass-panel rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group hover:border-primary/30 transition-all duration-500"
              :class="{ 'opacity-60': order.status === '已过期' }"
            >
              <div class="flex flex-col gap-3">
                <div class="flex items-center gap-3">
                  <span class="text-[10px] font-mono text-outline">{{ order.id }}</span>
                  <span 
                    class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border"
                    :class="order.status === '已完成' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-surface-container-highest text-outline border-outline/30'"
                  >
                    {{ order.status }}
                  </span>
                </div>
                <h3 class="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">{{ order.name }}</h3>
                <p class="text-xs text-on-surface-variant font-mono">购买日期: {{ order.date }}</p>
              </div>

              <div class="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-8 md:gap-3">
                <span class="text-2xl font-bold" :class="order.status === '已完成' ? 'text-primary' : 'text-outline'">{{ order.price }} NX</span>
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
                  <button 
                    v-if="order.status === '已过期'"
                    class="px-4 py-1.5 bg-surface-container text-outline rounded cursor-not-allowed text-xs font-bold flex items-center gap-2"
                  >
                    <History class="w-3.5 h-3.5" /> 收据
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-center mt-12 gap-3">
            <button class="w-10 h-10 rounded border border-outline-variant/30 flex items-center justify-center text-outline hover:text-primary hover:border-primary/50 transition-all">
              <ChevronLeft class="w-5 h-5" />
            </button>
            <button class="w-10 h-10 rounded bg-primary/20 border border-primary/50 text-primary flex items-center justify-center font-bold">1</button>
            <button class="w-10 h-10 rounded border border-outline-variant/30 flex items-center justify-center text-outline hover:text-primary hover:border-primary/50 transition-all">2</button>
            <button class="w-10 h-10 rounded border border-outline-variant/30 flex items-center justify-center text-outline hover:text-primary hover:border-primary/50 transition-all">
              <ChevronRight class="w-5 h-5" />
            </button>
          </div>
        </div>


        <!-- Settings Tab -->
        <div v-else-if="activeTab === '设置'" class="animate-fade-in">
          <div class="border-b border-outline-variant/20 pb-6 mb-8">
            <h1 class="text-3xl font-bold text-on-surface tracking-tight">账户设置</h1>
          </div>
          <div class="glass-panel p-8 rounded-xl flex flex-col gap-6 max-w-2xl">
            <div>
              <label class="text-xs text-on-surface-variant uppercase mb-2 block">显示名称</label>
              <input type="text" value="Cipher_99" class="w-full bg-surface-container/50 border border-outline-variant/30 rounded px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label class="text-xs text-on-surface-variant uppercase mb-2 block">安全邮箱</label>
              <input type="email" value="cipher@nexus.net" disabled class="w-full bg-surface-container/30 border border-outline-variant/30 rounded px-4 py-2 text-on-surface-variant opacity-70 cursor-not-allowed" />
            </div>
            <div class="pt-4 border-t border-outline-variant/20 flex gap-4">
              <button class="bg-primary text-surface px-6 py-2 rounded font-bold text-sm hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all">保存更改</button>
              <button class="border border-outline-variant/30 text-on-surface-variant px-6 py-2 rounded text-sm hover:border-primary hover:text-primary transition-all">重置密钥</button>
            </div>
          </div>
        </div>

      </section>
    </main>

    <!-- Recharge Modal -->
    <div v-if="isRechargeOpen" class="fixed inset-0 z-[200] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-md cursor-pointer" @click="isRechargeOpen = false"></div>
      <div class="relative glass-panel w-full max-w-md p-8 rounded-2xl border border-primary/30 shadow-[0_0_50px_rgba(0,229,255,0.15)] animate-fade-in">
        <button @click="isRechargeOpen = false" class="absolute top-4 right-4 text-on-surface-variant hover:text-primary"><X class="w-6 h-6"/></button>
        <h2 class="text-2xl font-bold text-primary mb-2">充值矩阵余额</h2>
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

        <button @click="confirmRecharge" class="w-full py-3 bg-primary text-surface font-bold rounded btn-glow transition-all">
          确认充值 {{ selectedAmount }} NX
        </button>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  ListTodo, 
  Settings, 
  Filter, 
  ArrowDownNarrowWide, 
  Key, 
  Download, 
  History, 
  ChevronLeft, 
  ChevronRight,
  X
} from 'lucide-vue-next';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { store } from '../store';

const activeTab = ref('我的订单');
const isRechargeOpen = ref(false);
const selectedAmount = ref(1000);

const confirmRecharge = () => {
  store.balance += selectedAmount.value;
  isRechargeOpen.value = false;
};

const menuItems = [
  { name: '我的订单', icon: ListTodo },
  { name: '设置', icon: Settings },
];

const orders = [
  {
    id: '#NXB-77291A',
    name: 'Neural Interface Node v2.1',
    date: 'Oct 24, 2023',
    price: '1,200',
    status: '已完成'
  },
  {
    id: '#NXB-66104B',
    name: 'Quantum Encryption Key (30 Days)',
    date: 'Oct 15, 2023',
    price: '450',
    status: '已完成'
  },
  {
    id: '#NXB-55092C',
    name: 'Standard Proxy Core',
    date: 'Sep 02, 2023',
    price: '150',
    status: '已过期'
  }
];
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
