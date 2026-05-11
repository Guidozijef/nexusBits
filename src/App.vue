<template>
  <div class="min-h-screen bg-surface-container-lowest text-on-surface cyber-grid relative overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
    <!-- Ambient Glow Background -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] mix-blend-screen"></div>
      <div class="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] mix-blend-screen"></div>
    </div>

    <router-view v-slot="{ Component }">
      <transition 
        name="fade" 
        mode="out-in"
      >
        <component :is="Component" />
      </transition>
    </router-view>

    <Cart />
  </div>
</template>

<script setup lang="ts">
import Cart from './components/Cart.vue';
</script>

<style>
.cyber-grid {
  background-image: 
    linear-gradient(to right, rgba(0, 229, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 229, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
}

button, a {
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Glassmorphism Classes */
.glass-panel {
  background: rgba(17, 19, 23, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-card {
  background: rgba(17, 19, 23, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid transparent;
  border-image: linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.05)) 1;
}

.btn-glow:hover {
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.6);
}

.input-glow:focus {
  box-shadow: 0 1px 0 0 #00e5ff, 0 4px 8px -2px rgba(0, 229, 255, 0.4);
  border-bottom-color: #00e5ff;
}

.text-glow-primary {
  text-shadow: 0 0 10px rgba(0, 218, 243, 0.5);
}
</style>
