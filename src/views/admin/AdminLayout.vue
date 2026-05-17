<template>
  <div class="min-h-screen bg-gray-50 flex font-sans text-gray-900 admin-scope">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm hidden md:flex shrink-0">
      <div class="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 class="text-xl font-bold text-indigo-600 tracking-tight">NexusBits Admin</h1>
      </div>
      <nav class="flex-1 py-4 flex flex-col gap-1 px-3">
        <router-link 
          to="/admin/dashboard" 
          class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          :class="$route.path === '/admin/dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
        >
          <LayoutDashboard class="w-5 h-5" /> 控制台
        </router-link>
        <router-link 
          to="/admin/users" 
          class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          :class="$route.path.includes('/admin/users') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
        >
          <Users class="w-5 h-5" /> 用户管理
        </router-link>
        <router-link 
          to="/admin/categories" 
          class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          :class="$route.path.includes('/admin/categories') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
        >
          <Tag class="w-5 h-5" /> 分类管理
        </router-link>
        <router-link 
          to="/admin/products" 
          class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          :class="$route.path.includes('/admin/products') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
        >
          <Package class="w-5 h-5" /> 商品管理
        </router-link>
        <router-link 
          to="/admin/orders" 
          class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          :class="$route.path.includes('/admin/orders') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
        >
          <FileText class="w-5 h-5" /> 订单管理
        </router-link>
      </nav>
      <div class="p-4 border-t border-gray-200">
        <router-link to="/" class="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
          <ArrowLeft class="w-4 h-4" /> 返回前台
        </router-link>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm shrink-0">
        <div class="flex items-center md:hidden">
          <h1 class="text-xl font-bold text-indigo-600">NB Admin</h1>
        </div>
        <div class="hidden md:block">
          <!-- Breadcrumb placeholder or Title -->
          <h2 class="text-lg font-medium text-gray-800">{{ pageTitle }}</h2>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
              {{ store.profile?.display_name?.charAt(0).toUpperCase() || 'A' }}
            </div>
            <span class="text-sm font-medium text-gray-700">{{ store.profile?.display_name || 'Admin' }}</span>
          </div>
        </div>
      </header>

      <!-- Scrollable Content Area -->
      <div class="flex-1 overflow-auto p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { LayoutDashboard, Users, Tag, Package, ArrowLeft, FileText } from 'lucide-vue-next';
import { store } from '../../store';

const route = useRoute();

const pageTitle = computed(() => {
  if (route.path.includes('/users')) return '用户管理';
  if (route.path.includes('/categories')) return '分类管理';
  if (route.path.includes('/products/new')) return '新建商品';
  if (route.path.includes('/products') && route.path.includes('/edit')) return '编辑商品';
  if (route.path.includes('/products')) return '商品管理';
  if (route.path.includes('/orders')) return '订单管理';
  return '控制台';
});
</script>

<style>
/* 
  Enforce white theme styles for admin scope to override the global dark theme.
  We use the .admin-scope class to prevent styles leaking to the frontend.
*/
.admin-scope {
  color-scheme: light;
  --on-surface: #111827;
  --on-surface-variant: #4b5563;
  --surface: #ffffff;
  --surface-container: #f3f4f6;
  --primary: #4f46e5; /* Indigo-600 */
}
.admin-scope input, .admin-scope select, .admin-scope textarea {
  color: #111827 !important;
  background-color: #ffffff !important;
}
</style>
