<template>
  <div class="w-full min-h-screen flex items-center justify-center relative p-4">
    <div class="glass-card w-full max-w-[480px] p-8 flex flex-col gap-6 animate-fade-in relative z-10">
      <!-- Header Section -->
      <div class="text-center">
        <h1 class="font-display-lg text-4xl text-primary tracking-tighter mb-2 animate-glow">NexusBits</h1>
        <h2 class="text-2xl font-bold text-on-surface mb-2">{{ isRegisterMode ? '创建您的数字矩阵' : '登录您的数字矩阵' }}</h2>
        <p class="text-on-surface-variant">探索无限虚拟资产</p>
      </div>

      <!-- Login / Register Form -->
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
        <!-- Display Name (Register Only) -->
        <div v-if="isRegisterMode" class="flex flex-col gap-2">
          <label class="text-sm font-medium text-on-surface/60" for="displayName">显示名称</label>
          <div class="relative">
            <User class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            <input 
              id="displayName"
              v-model="form.displayName"
              type="text" 
              placeholder="输入您的昵称"
              class="w-full bg-surface-container/80 border border-outline-variant/50 rounded py-3 pl-10 pr-4 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-transparent input-glow transition-all duration-300"
            />
          </div>
        </div>

        <!-- Email Input -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-on-surface/60" for="account">邮箱</label>
          <div class="relative">
            <Mail class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            <input 
              id="account"
              v-model="form.email"
              type="email" 
              placeholder="输入您的邮箱"
              class="w-full bg-surface-container/80 border border-outline-variant/50 rounded py-3 pl-10 pr-4 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-transparent input-glow transition-all duration-300"
            />
          </div>
        </div>

        <!-- Password Input -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-on-surface/60" for="password">访问密钥</label>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            <input 
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'" 
              placeholder="••••••••"
              class="w-full bg-surface-container/80 border border-outline-variant/50 rounded py-3 pl-10 pr-10 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-transparent input-glow transition-all duration-300"
            />
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
            >
              <Eye v-if="!showPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Options Row (Login only) -->
        <div v-if="!isRegisterMode" class="flex justify-between items-center">
          <label class="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" class="rounded border-outline-variant text-primary focus:ring-primary bg-surface-container" />
            <span class="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">保持连接</span>
          </label>
          <a href="#" class="text-sm text-primary hover:text-primary-fixed transition-colors underline decoration-transparent hover:decoration-primary underline-offset-4">重置密钥</a>
        </div>

        <!-- Error Message -->
        <p v-if="errorMsg" class="text-error text-sm text-center animate-pulse">{{ errorMsg }}</p>

        <!-- Action Button -->
        <button 
          type="submit"
          :disabled="loading"
          class="w-full bg-primary text-surface-container-lowest font-bold py-4 rounded btn-glow transition-all duration-300 mt-2 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
          {{ isRegisterMode ? '注册矩阵' : '进入矩阵' }}
        </button>
      </form>

      <!-- Divider -->
      <div class="flex items-center gap-4 my-2">
        <div class="h-[1px] flex-1 bg-outline-variant/30"></div>
        <span class="text-xs text-on-surface-variant/50 uppercase tracking-widest">OR</span>
        <div class="h-[1px] flex-1 bg-outline-variant/30"></div>
      </div>

      <!-- Social Login -->
      <div class="flex gap-4">
        <button class="flex-1 flex items-center justify-center gap-2 py-3 bg-surface-container/50 border border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container rounded transition-all duration-300 group">
          <Github class="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
          <span class="text-sm font-medium text-on-surface-variant group-hover:text-on-surface">Github</span>
        </button>
        <button class="flex-1 flex items-center justify-center gap-2 py-3 bg-surface-container/50 border border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container rounded transition-all duration-300 group">
          <Chrome class="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
          <span class="text-sm font-medium text-on-surface-variant group-hover:text-on-surface">Google</span>
        </button>
      </div>

      <!-- Toggle Register / Login -->
      <div class="text-center">
        <p class="text-sm text-on-surface-variant">
          {{ isRegisterMode ? '已有账号？' : '还没有账号？' }}
          <a href="#" @click.prevent="toggleMode" class="text-primary hover:text-primary-fixed font-semibold transition-colors ml-1">
            {{ isRegisterMode ? '立即登录' : '立即注册' }}
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { User, Mail, Lock, Eye, EyeOff, Github, Chrome, Loader2 } from 'lucide-vue-next';
import { store } from '../store';

const router = useRouter();
const showPassword = ref(false);
const isRegisterMode = ref(false);
const loading = ref(false);
const errorMsg = ref('');

const form = reactive({
  email: '',
  password: '',
  displayName: ''
});

const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value;
  errorMsg.value = '';
};

const handleSubmit = async () => {
  errorMsg.value = '';

  if (!form.email || !form.password) {
    errorMsg.value = '请填写邮箱和密码';
    return;
  }

  if (form.password.length < 6) {
    errorMsg.value = '密码长度至少6位';
    return;
  }

  loading.value = true;
  try {
    if (isRegisterMode.value) {
      const res = await store.register(form.email, form.password, form.displayName || undefined);
      if (res.success) {
        if (store.isLoggedIn) {
          router.push('/market');
        } else {
          alert(res.message || '注册成功！请前往您的邮箱点击验证链接，验证完成后即可登录。');
          isRegisterMode.value = false;
        }
      } else {
        errorMsg.value = res.error || '注册失败';
      }
    } else {
      const res = await store.login(form.email, form.password);
      if (res.success) {
        router.push('/market');
      } else {
        errorMsg.value = res.error || '登录失败';
      }
    }
  } catch (e: any) {
    errorMsg.value = e.message || '网络错误，请稍后重试';
  }
  loading.value = false;
};
</script>

<style scoped>
@keyframes glow {
  0%, 100% { filter: drop-shadow(0 0 5px rgba(0, 229, 255, 0.4)); }
  50% { filter: drop-shadow(0 0 15px rgba(0, 229, 255, 0.8)); }
}

.animate-glow {
  animation: glow 3s ease-in-out infinite;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}
</style>
