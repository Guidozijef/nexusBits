<template>
  <div class="space-y-6 admin-scope">
    <div class="flex justify-between items-center">
      <h3 class="text-xl font-bold text-gray-900">订单与交付管理</h3>
    </div>

    <!-- Filters Bar -->
    <div class="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
      <form @submit.prevent="handleSearch" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">订单编号</label>
          <input 
            v-model="filters.orderNo" 
            type="text" 
            placeholder="例如: NXB-..." 
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3 border"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">买家 (邮箱/昵称)</label>
          <input 
            v-model="filters.search" 
            type="text" 
            placeholder="搜索邮箱或昵称" 
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3 border"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">订单状态</label>
          <select 
            v-model="filters.status" 
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3 border bg-white"
          >
            <option value="">全部状态</option>
            <option value="处理中">处理中</option>
            <option value="已完成">已完成</option>
            <option value="待支付">待支付</option>
            <option value="已过期">已过期</option>
            <option value="已取消">已取消</option>
          </select>
        </div>
        <div class="flex gap-2">
          <button 
            type="submit" 
            class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-sm shadow-sm transition-colors focus:outline-none flex items-center justify-center gap-1.5"
          >
            <Search class="w-4 h-4" /> 搜索订单
          </button>
          <button 
            type="button" 
            @click="resetFilters" 
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md text-sm transition-colors focus:outline-none"
          >
            重置
          </button>
        </div>
      </form>
    </div>

    <!-- Orders Table -->
    <div class="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">订单编号</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">买家信息</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">所购商品</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">总金额</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">创建时间</th>
              <th class="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-12 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                <Loader2 class="w-5 h-5 animate-spin text-indigo-600" /> 加载中，请稍候...
              </td>
            </tr>
            <tr v-else-if="orders.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-sm text-gray-500">
                未查询到任何订单记录
              </td>
            </tr>
            <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 transition-colors">
              <!-- Order No -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 font-bold">
                {{ order.order_no }}
              </td>
              
              <!-- Buyer Profile -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {{ order.profile?.display_name?.charAt(0).toUpperCase() || 'U' }}
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-semibold text-gray-900">{{ order.profile?.display_name || '未知用户' }}</div>
                    <div class="text-xs text-gray-500 font-mono">{{ order.profile?.email }}</div>
                  </div>
                </div>
              </td>
              
              <!-- Products Inside Order -->
              <td class="px-6 py-4 text-sm text-gray-500">
                <ul class="list-disc list-inside space-y-1.5">
                  <li v-for="item in order.items" :key="item.id" class="truncate max-w-xs font-medium text-gray-700">
                    {{ item.product_name }}
                    <span v-if="item.package_name" class="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono font-normal">
                      {{ item.package_name }}
                    </span>
                    <span v-if="item.quantity > 1" class="text-xs text-indigo-600 font-bold font-mono">
                      x{{ item.quantity }}
                    </span>
                  </li>
                </ul>
              </td>
              
              <!-- Amount -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-indigo-700">
                {{ order.total_amount }} NB
              </td>
              
              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-amber-100 text-amber-800': order.status === '处理中',
                    'bg-green-100 text-green-800': order.status === '已完成',
                    'bg-blue-100 text-blue-800': order.status === '待支付',
                    'bg-gray-100 text-gray-800': order.status === '已过期' || order.status === '已取消'
                  }"
                >
                  {{ order.status }}
                </span>
              </td>
              
              <!-- Created At -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                {{ formatDate(order.created_at) }}
              </td>
              
              <!-- Action -->
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button 
                  @click="openEditModal(order)"
                  class="text-indigo-600 hover:text-indigo-900 border border-indigo-200 hover:border-indigo-400 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 mx-auto"
                >
                  <FileEdit class="w-3.5 h-3.5" /> 修改交付备注
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div v-if="totalPages > 1" class="bg-white px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <div class="text-sm text-gray-700">
          第 <span class="font-bold font-mono">{{ page }}</span> / <span class="font-bold font-mono">{{ totalPages }}</span> 页，共 <span class="font-bold font-mono">{{ total }}</span> 笔订单
        </div>
        <div class="flex gap-2">
          <button 
            @click="prevPage" 
            :disabled="page === 1"
            class="px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            上一页
          </button>
          <button 
            @click="nextPage" 
            :disabled="page === totalPages"
            class="px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            下一页
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Remark Modal -->
    <div 
      v-if="isModalOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-gray-200 flex flex-col max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h4 class="text-base font-bold text-gray-900">修改交付备注信息</h4>
            <p class="text-xs text-gray-500 mt-1 font-mono">订单: {{ selectedOrder?.order_no }} | 买家: {{ selectedOrder?.profile?.display_name }}</p>
          </div>
          <button @click="closeModal(false)" class="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto space-y-6">
          <div 
            v-for="item in selectedOrder?.items" 
            :key="item.id"
            class="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col gap-3"
          >
            <div class="flex justify-between items-center">
              <span class="text-sm font-bold text-gray-800">{{ item.product_name }}</span>
              <span v-if="item.package_name" class="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-semibold">
                {{ item.package_name }}
              </span>
            </div>

            <!-- Product Admin Note Template / Reference -->
            <div v-if="item.product_admin_note" class="bg-amber-50/50 border border-amber-200/50 rounded-lg p-3 text-xs text-amber-900 space-y-1">
              <span class="font-bold flex items-center gap-1">
                <Info class="w-3.5 h-3.5 text-amber-600 animate-pulse" /> 商品管理员备注（可双击或直接复制参考）：
              </span>
              <p class="whitespace-pre-wrap font-mono text-gray-600 bg-white p-2 border border-amber-100 rounded mt-1 select-all pointer-events-auto">{{ item.product_admin_note }}</p>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">备注 / 授权凭证交付内容</label>
              <textarea 
                v-model="remarksForm[item.product_id]"
                rows="3"
                placeholder="例如: [百度网盘链接 / 提取码] 或定制系统专属授权信息... 默认留空"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs py-2 px-3 border font-mono resize-none"
              ></textarea>
            </div>

            <div class="flex justify-end items-center gap-3">
              <span v-if="successForm[item.product_id]" class="text-xs text-green-600 font-bold flex items-center gap-1">
                <Check class="w-3.5 h-3.5" /> 备注已成功保存
              </span>
              <span v-if="errorForm[item.product_id]" class="text-xs text-red-600 font-semibold">
                {{ errorForm[item.product_id] }}
              </span>
              
              <button 
                @click="saveRemark(item.product_id)"
                :disabled="savingForm[item.product_id]"
                class="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1 shadow-sm focus:outline-none"
              >
                <Loader2 v-if="savingForm[item.product_id]" class="w-3.5 h-3.5 animate-spin" />
                <Save v-else class="w-3.5 h-3.5" />
                {{ savingForm[item.product_id] ? '正在保存...' : '更新此商品备注' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end bg-gray-50">
          <button 
            @click="closeModal(true)" 
            class="bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-md text-sm border border-gray-300 shadow-sm transition-all focus:outline-none"
          >
            完成并关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Search, Loader2, FileEdit, X, Save, Check, Info } from 'lucide-vue-next';
import { adminApi } from '../../api';

// --- State Variables ---
const orders = ref<any[]>([]);
const loading = ref(true);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const totalPages = ref(1);

const filters = reactive({
  orderNo: '',
  search: '',
  status: ''
});

// --- Modal State ---
const isModalOpen = ref(false);
const selectedOrder = ref<any>(null);
const remarksForm = reactive<Record<number, string>>({});
const savingForm = reactive<Record<number, boolean>>({});
const successForm = reactive<Record<number, boolean>>({});
const errorForm = reactive<Record<number, string>>({});

// --- Fetch Handler ---
const loadOrders = async () => {
  loading.value = true;
  try {
    const res = await adminApi.getOrders({
      order_no: filters.orderNo || undefined,
      search: filters.search || undefined,
      status: filters.status || undefined,
      page: page.value,
      limit: limit.value
    });
    if (res.success) {
      orders.value = res.data || [];
      total.value = res.total || 0;
      totalPages.value = Math.ceil(total.value / limit.value) || 1;
    }
  } catch (error) {
    console.error('Failed to load orders', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  page.value = 1;
  loadOrders();
};

const resetFilters = () => {
  filters.orderNo = '';
  filters.search = '';
  filters.status = '';
  page.value = 1;
  loadOrders();
};

// --- Pagination Actions ---
const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    loadOrders();
  }
};

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++;
    loadOrders();
  }
};

// --- Remark Actions ---
const openEditModal = (order: any) => {
  selectedOrder.value = order;
  
  // Initialize remarks form with the values embedded from API
  order.items.forEach((item: any) => {
    remarksForm[item.product_id] = item.remark || '';
    savingForm[item.product_id] = false;
    successForm[item.product_id] = false;
    errorForm[item.product_id] = '';
  });
  
  isModalOpen.value = true;
};

const closeModal = (shouldReload = false) => {
  isModalOpen.value = false;
  selectedOrder.value = null;
  if (shouldReload) {
    loadOrders();
  }
};

const saveRemark = async (productId: number) => {
  if (!selectedOrder.value) return;
  
  savingForm[productId] = true;
  successForm[productId] = false;
  errorForm[productId] = '';
  
  try {
    const res = await adminApi.updateAssetRemark(
      selectedOrder.value.id,
      productId,
      remarksForm[productId]
    );
    if (res.success) {
      successForm[productId] = true;
      
      // Update local state directly so the table and modal stay perfectly in sync
      const item = selectedOrder.value.items.find((i: any) => i.product_id === productId);
      if (item) {
        item.remark = remarksForm[productId];
      }
      
      // Auto-clear success message after 3 seconds
      setTimeout(() => {
        successForm[productId] = false;
      }, 3000);
    }
  } catch (e: any) {
    console.error('Failed to update remark', e);
    errorForm[productId] = e.message || '更新备注失败，请重试';
  } finally {
    savingForm[productId] = false;
  }
};

// --- Date Formatter ---
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  } catch {
    return dateStr;
  }
};

onMounted(() => {
  loadOrders();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
