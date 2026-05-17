<template>
  <div class="fixed bottom-6 right-6 z-40 select-none">
    <!-- Floating Trigger Button -->
    <button 
      @click="isOpen = !isOpen"
      class="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-tr from-secondary-container to-primary-container border border-primary/30 text-surface shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.7)] hover:scale-110 transition-all duration-300 group cursor-pointer"
      aria-label="联系客服"
    >
      <transition name="rotate-fade" mode="out-in">
        <X v-if="isOpen" class="w-6 h-6 text-on-primary transition-transform duration-300" />
        <Headphones v-else class="w-6 h-6 text-on-primary transition-transform duration-300 group-hover:rotate-12" />
      </transition>
    </button>

    <!-- Support Dialog Card -->
    <transition name="slide-fade">
      <div 
        v-if="isOpen" 
        class="absolute bottom-18 right-0 w-80 rounded-2xl glass-panel-custom border border-outline-variant/40 shadow-2xl p-5 overflow-hidden flex flex-col gap-4"
      >
        <!-- Card Backdrop Glow -->
        <div class="absolute inset-0 pointer-events-none -z-10">
          <div class="absolute -top-10 -right-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
          <div class="absolute -bottom-10 -left-10 w-24 h-24 bg-secondary/20 rounded-full blur-2xl"></div>
        </div>

        <!-- Header -->
        <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30">
          <div class="flex items-center gap-2">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-primary-container"></span>
            </span>
            <h3 class="font-display font-bold text-lg text-primary text-glow-primary">联系客服</h3>
          </div>
          <span class="text-xs text-on-surface-variant/70">在线解答您的疑问</span>
        </div>

        <!-- Support Info List -->
        <div class="flex flex-col gap-3.5">
          <!-- QQ Account Info -->
          <div class="p-3 bg-surface-container/50 border border-outline-variant/20 rounded-xl flex items-center justify-between hover:bg-surface-container/80 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
                <MessageSquare class="w-5 h-5" />
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider">QQ号码</span>
                <span class="text-sm font-bold font-mono text-on-surface">{{ qqNumber }}</span>
              </div>
            </div>
            <button 
              @click="copyText(qqNumber, 'qq')" 
              class="p-1.5 rounded-lg hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-all relative flex items-center justify-center cursor-pointer"
              title="复制QQ号"
            >
              <transition name="pop-scale" mode="out-in">
                <Check v-if="copiedType === 'qq'" class="w-4 h-4 text-primary" />
                <Copy v-else class="w-4 h-4" />
              </transition>
              <!-- Tooltip -->
              <span v-if="copiedType === 'qq'" class="absolute -top-7 px-2 py-0.5 text-[10px] bg-primary text-surface rounded shadow-md whitespace-nowrap animate-bounce">已复制</span>
            </button>
          </div>

          <!-- QQ Email Info -->
          <div class="p-3 bg-surface-container/50 border border-outline-variant/20 rounded-xl flex items-center justify-between hover:bg-surface-container/80 transition-colors">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-9 h-9 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
                <Mail class="w-5 h-5" />
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider">QQ邮箱</span>
                <a 
                  :href="`mailto:${qqEmail}`"
                  class="text-sm font-bold font-mono text-on-surface truncate hover:text-primary transition-colors pr-2"
                  title="点击发送邮件"
                >
                  {{ qqEmail }}
                </a>
              </div>
            </div>
            <button 
              @click="copyText(qqEmail, 'email')" 
              class="p-1.5 rounded-lg hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-all relative flex items-center justify-center cursor-pointer"
              title="复制邮箱"
            >
              <transition name="pop-scale" mode="out-in">
                <Check v-if="copiedType === 'email'" class="w-4 h-4 text-primary" />
                <Copy v-else class="w-4 h-4" />
              </transition>
              <!-- Tooltip -->
              <span v-if="copiedType === 'email'" class="absolute -top-7 px-2 py-0.5 text-[10px] bg-primary text-surface rounded shadow-md whitespace-nowrap animate-bounce">已复制</span>
            </button>
          </div>

          <!-- WeChat Account Info -->
          <div class="p-3 bg-surface-container/50 border border-outline-variant/20 rounded-xl flex items-center justify-between hover:bg-surface-container/80 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-secondary-container/10 flex items-center justify-center text-secondary">
                <!-- Lucide doesn't have WeChat icon, using MessageCircle which looks great for chat -->
                <MessageCircle class="w-5 h-5" />
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider">微信账号</span>
                <span class="text-sm font-bold font-mono text-on-surface">{{ wechatAccount }}</span>
              </div>
            </div>
            <button 
              @click="copyText(wechatAccount, 'wechat')" 
              class="p-1.5 rounded-lg hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-all relative flex items-center justify-center cursor-pointer"
              title="复制微信号"
            >
              <transition name="pop-scale" mode="out-in">
                <Check v-if="copiedType === 'wechat'" class="w-4 h-4 text-primary" />
                <Copy v-else class="w-4 h-4" />
              </transition>
              <!-- Tooltip -->
              <span v-if="copiedType === 'wechat'" class="absolute -top-7 px-2 py-0.5 text-[10px] bg-primary text-surface rounded shadow-md whitespace-nowrap animate-bounce">已复制</span>
            </button>
          </div>
        </div>

        <!-- Footer Note -->
        <div class="text-[10px] text-on-surface-variant/50 text-center pt-1 mt-1 border-t border-outline-variant/20 font-sans">
          服务时间：周一至周日 9:00 - 22:00
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Headphones, X, Mail, MessageSquare, MessageCircle, Copy, Check } from 'lucide-vue-next';

const isOpen = ref(false);
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
.glass-panel-custom {
  background: rgba(17, 20, 26, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 
    0 10px 30px -10px rgba(0, 0, 0, 0.7),
    inset 0 1px 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 0 10px 0 rgba(0, 229, 255, 0.05);
}

/* Animations */
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.7, 0, 0.84, 0);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(12px) scale(0.95);
  opacity: 0;
}

.rotate-fade-enter-active,
.rotate-fade-leave-active {
  transition: all 0.2s ease;
}
.rotate-fade-enter-from,
.rotate-fade-leave-to {
  transform: rotate(45deg);
  opacity: 0;
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
