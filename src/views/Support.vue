<template>
  <div class="relative min-h-screen flex flex-col justify-between">
    <Navbar />

    <!-- Ambient Glow Background -->
    <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[130px]"></div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10 w-full flex-grow flex items-center">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        
        <!-- Left Side: Copy and Details -->
        <div class="lg:col-span-7 flex flex-col gap-6 animate-slide-right">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-4">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              官方客服中心
            </div>
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-on-surface leading-tight tracking-tight">
              需要技术支持或<br />
              <span class="text-primary-container drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">专属定制服务？</span>
            </h1>
          </div>

          <p class="text-on-surface-variant leading-relaxed max-w-xl text-sm sm:text-base">
            如果您在 **NexusBits** 平台使用过程中遇到任何关于虚拟商品的支付、订单状态、授权许可密钥获取，或者是针对大客户的数字资产高级定制开发需求，请随时与我们联系。我们的专业客服团队致力于为您提供全天候的技术守护。
          </p>

          <!-- Contact items grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 max-w-xl">
            <!-- QQ Number Card -->
            <div class="glass-panel p-4 rounded-xl flex items-center justify-between group hover:border-primary/30 transition-all duration-300">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                  <MessageSquare class="w-5 h-5" />
                </div>
                <div class="flex flex-col">
                  <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-mono">QQ客服</span>
                  <span class="text-sm font-bold text-on-surface font-mono">{{ qqNumber }}</span>
                </div>
              </div>
              <button 
                @click="copyText(qqNumber, 'qq')" 
                class="p-2 rounded-lg hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-all relative flex items-center justify-center cursor-pointer"
                title="复制QQ号"
              >
                <transition name="pop-scale" mode="out-in">
                  <Check v-if="copiedType === 'qq'" class="w-4 h-4 text-primary" />
                  <Copy v-else class="w-4 h-4" />
                </transition>
                <span v-if="copiedType === 'qq'" class="absolute -top-8 px-2 py-0.5 text-[10px] bg-primary text-surface rounded shadow-md whitespace-nowrap animate-bounce">已复制</span>
              </button>
            </div>

            <!-- WeChat Card -->
            <div class="glass-panel p-4 rounded-xl flex items-center justify-between group hover:border-primary/30 transition-all duration-300">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-secondary-container/10 flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
                  <MessageCircle class="w-5 h-5" />
                </div>
                <div class="flex flex-col">
                  <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-mono">微信账号</span>
                  <span class="text-sm font-bold text-on-surface font-mono">{{ wechatAccount }}</span>
                </div>
              </div>
              <button 
                @click="copyText(wechatAccount, 'wechat')" 
                class="p-2 rounded-lg hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-all relative flex items-center justify-center cursor-pointer"
                title="复制微信号"
              >
                <transition name="pop-scale" mode="out-in">
                  <Check v-if="copiedType === 'wechat'" class="w-4 h-4 text-primary" />
                  <Copy v-else class="w-4 h-4" />
                </transition>
                <span v-if="copiedType === 'wechat'" class="absolute -top-8 px-2 py-0.5 text-[10px] bg-primary text-surface rounded shadow-md whitespace-nowrap animate-bounce">已复制</span>
              </button>
            </div>

            <!-- Email Card - spans full width on sm -->
            <div class="sm:col-span-2 glass-panel p-4 rounded-xl flex items-center justify-between group hover:border-primary/30 transition-all duration-300">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform flex-shrink-0">
                  <Mail class="w-5 h-5" />
                </div>
                <div class="flex flex-col min-w-0">
                  <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-mono">QQ邮箱联系</span>
                  <a 
                    :href="`mailto:${qqEmail}`"
                    class="text-sm font-bold text-on-surface font-mono truncate hover:text-primary transition-colors pr-2"
                    title="点击发起发送邮件"
                  >
                    {{ qqEmail }}
                  </a>
                </div>
              </div>
              <button 
                @click="copyText(qqEmail, 'email')" 
                class="p-2 rounded-lg hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-all relative flex items-center justify-center cursor-pointer flex-shrink-0"
                title="复制QQ邮箱"
              >
                <transition name="pop-scale" mode="out-in">
                  <Check v-if="copiedType === 'email'" class="w-4 h-4 text-primary" />
                  <Copy v-else class="w-4 h-4" />
                </transition>
                <span v-if="copiedType === 'email'" class="absolute -top-8 px-2 py-0.5 text-[10px] bg-primary text-surface rounded shadow-md whitespace-nowrap animate-bounce">已复制</span>
              </button>
            </div>
          </div>

          <!-- Bottom indicators -->
          <div class="flex gap-8 mt-4 text-xs text-on-surface-variant/70 border-t border-outline-variant/20 pt-6 max-w-xl">
            <div class="flex items-center gap-2">
              <Clock class="w-4 h-4 text-primary" />
              <span>工作时间：周一至周日 9:00 - 22:00</span>
            </div>
            <div class="flex items-center gap-2">
              <ShieldCheck class="w-4 h-4 text-primary" />
              <span>服务承诺：极速响应，隐私保密</span>
            </div>
          </div>
        </div>

        <!-- Right Side: WeChat QR Code Scan Hologram -->
        <div class="lg:col-span-5 flex justify-center lg:justify-end animate-slide-left">
          <div class="relative p-6 glass-panel rounded-2xl border border-primary/20 shadow-[0_0_50px_rgba(0,229,255,0.08)] group hover:shadow-[0_0_50px_rgba(0,229,255,0.2)] transition-all duration-700 flex flex-col items-center gap-6 max-w-sm w-full">
            
            <!-- Hologram Corner Accents -->
            <div class="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/40 rounded-tl"></div>
            <div class="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/40 rounded-tr"></div>
            <div class="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/40 rounded-bl"></div>
            <div class="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/40 rounded-br"></div>

            <!-- Scan Frame Outer -->
            <div class="relative w-64 h-64 bg-surface-container-low/50 border border-outline-variant/30 rounded-xl overflow-hidden p-3 flex items-center justify-center group-hover:border-primary/40 transition-colors duration-500 shadow-inner">
              
              <!-- Scanning Line (Cyber Effect) -->
              <div class="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_12px_#00e5ff] pointer-events-none scan-line z-20"></div>

              <!-- Hologram Grid Overlay -->
              <div class="absolute inset-0 bg-cyber-overlay opacity-[0.03] pointer-events-none rounded-xl z-10"></div>

              <!-- QR Code Image -->
              <img 
                src="/wechat_qrcode.png" 
                alt="WeChat QR Code" 
                class="w-full h-full object-contain rounded-lg opacity-90 group-hover:opacity-100 transition-opacity duration-500 relative z-0"
              />
            </div>

            <!-- Description -->
            <div class="text-center">
              <h3 class="font-bold text-on-surface text-lg mb-1.5 flex items-center justify-center gap-2">
                <QrCode class="w-5 h-5 text-primary" />
                微信扫描二维码
              </h3>
              <p class="text-xs text-on-surface-variant max-w-[240px] mx-auto leading-relaxed">
                使用微信扫描上方二维码，即刻添加专属技术客服，为您解答一切使用难题。
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  MessageSquare, 
  MessageCircle, 
  Mail, 
  Copy, 
  Check, 
  Clock, 
  ShieldCheck, 
  QrCode 
} from 'lucide-vue-next';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';

const qqNumber = ref('913497146');
const qqEmail = ref('913497146@qq.com');
const wechatAccount = ref('zijef1');

const copiedType = ref<'qq' | 'email' | 'wechat' | null>(null);

const copyText = async (text: string, type: 'qq' | 'email' | 'wechat') => {
  try {
    await navigator.clipboard.writeText(text);
    copiedType.value = type;
    setTimeout(() => {
      if (copiedType.value === type) {
        copiedType.value = null;
      }
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};
</script>

<style scoped>
/* Scanned overlay grids */
.bg-cyber-overlay {
  background-image: 
    linear-gradient(to right, #00e5ff 1px, transparent 1px),
    linear-gradient(to bottom, #00e5ff 1px, transparent 1px);
  background-size: 8px 8px;
}

/* Animations */
@keyframes scan {
  0%, 100% {
    top: 5%;
    opacity: 0.1;
  }
  15%, 85% {
    opacity: 1;
  }
  50% {
    top: 93%;
    opacity: 1;
  }
}
.scan-line {
  animation: scan 4s ease-in-out infinite;
}

@keyframes slideRight {
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes slideLeft {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-slide-right {
  animation: slideRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-slide-left {
  animation: slideLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.pop-scale-enter-active,
.pop-scale-leave-active {
  transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-scale-enter-from,
.pop-scale-leave-to {
  transform: scale(0.7);
  opacity: 0;
}
</style>
