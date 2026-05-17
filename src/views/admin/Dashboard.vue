<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">欢迎来到 NexusBits 后台管理</h2>
      <p class="text-gray-600">
        您可以在左侧菜单中管理所有的用户和商品信息。
        后台界面独立于前台，为了最高效的业务管理而设计。
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow p-6 border border-gray-200 flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
          <Users class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm text-gray-500 font-medium">用户管理</p>
          <router-link to="/admin/users" class="text-indigo-600 hover:text-indigo-800 text-sm font-semibold">查看详情 &rarr;</router-link>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6 border border-gray-200 flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
          <Package class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm text-gray-500 font-medium">商品管理</p>
          <router-link to="/admin/products" class="text-indigo-600 hover:text-indigo-800 text-sm font-semibold">查看详情 &rarr;</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Users, Package } from 'lucide-vue-next';
</script>
