<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-xl font-bold text-gray-900">商品管理</h3>
      <router-link 
        to="/admin/products/new" 
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
      >
        <Plus class="w-4 h-4" /> 新增商品
      </router-link>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-end">
      <div class="flex-1 min-w-[200px]">
        <label class="block text-xs font-medium text-gray-500 mb-1">搜索名称</label>
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="filters.name" 
            type="text" 
            placeholder="输入商品名称..." 
            class="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
            @keyup.enter="handleSearch"
          />
        </div>
      </div>
      <div class="w-40">
        <label class="block text-xs font-medium text-gray-500 mb-1">分类</label>
        <select v-model="filters.category_id" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
          <option value="">全部分类</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>
      <div class="w-40">
        <label class="block text-xs font-medium text-gray-500 mb-1">状态</label>
        <select v-model="filters.status" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
          <option value="">全部状态</option>
          <option value="active">已上架</option>
          <option value="draft">草稿</option>
          <option value="archived">已下架</option>
        </select>
      </div>
      <button @click="handleSearch" class="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm">
        查询
      </button>
      <button @click="resetFilters" class="bg-white text-gray-700 px-5 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
        重置
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">商品信息</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">分类</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">成本价格</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">基础价格</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">首页推荐</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">时间</th>
              <th class="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr v-if="loading">
              <td colspan="8" class="px-6 py-10 text-center text-sm text-gray-400">
                <Loader2 class="w-6 h-6 animate-spin mx-auto mb-2" />
                正在努力加载中...
              </td>
            </tr>
            <tr v-else-if="products.length === 0">
              <td colspan="8" class="px-6 py-10 text-center text-sm text-gray-400">未找到符合条件的商品</td>
            </tr>
            <tr v-for="product in paginatedProducts" :key="product.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                    <img v-if="product.image_url" :src="product.image_url" alt="" class="h-12 w-12 object-cover" />
                    <Package v-else class="h-6 w-6 m-3 text-gray-300" />
                  </div>
                  <div class="ml-4 max-w-[240px]">
                    <div class="text-sm font-bold text-gray-900 truncate" :title="product.name">{{ product.name }}</div>
                    <div class="text-xs text-indigo-600 mt-0.5">{{ product.tag || '无标签' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">{{ product.category?.name || '未分类' }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-gray-900">{{ product.cost }} <span class="text-xs font-normal text-gray-400">{{ product.currency }}</span></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-gray-900">{{ product.price }} <span class="text-xs font-normal text-gray-400">{{ product.currency }}</span></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2.5 py-1 inline-flex text-[11px] font-bold rounded-full border"
                  :class="product.is_featured 
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                    : 'bg-gray-50 text-gray-400 border-gray-100'">
                  {{ product.is_featured ? '是' : '否' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2.5 py-1 inline-flex text-[11px] font-bold rounded-full border"
                  :class="{
                    'bg-green-50 text-green-700 border-green-200': product.status === 'active',
                    'bg-amber-50 text-amber-700 border-amber-200': product.status === 'draft',
                    'bg-gray-50 text-gray-600 border-gray-200': product.status === 'archived'
                  }">
                  {{ getStatusText(product.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                {{ formatDate(product.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end gap-2 items-center">
                  <a :href="`/details/${product.id}`" target="_blank" class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-2 py-1 rounded transition-colors flex items-center gap-1" title="查看前台详情">
                    <ExternalLink class="w-3.5 h-3.5" /> 查看
                  </a>
                  <router-link :to="`/admin/products/${product.id}/edit`" class="text-amber-600 hover:text-amber-900 bg-amber-50 px-2 py-1 rounded transition-colors flex items-center gap-1" title="编辑">
                    <Edit3 class="w-3.5 h-3.5" /> 编辑
                  </router-link>
                  <button @click="toggleStatus(product)" 
                    class="px-2 py-1 rounded transition-colors flex items-center gap-1"
                    :class="product.status === 'active' ? 'text-gray-600 hover:text-gray-900 bg-gray-100' : 'text-green-600 hover:text-green-900 bg-green-50'"
                    :title="product.status === 'active' ? '下架' : '上架'">
                    <Power class="w-3.5 h-3.5" /> {{ product.status === 'active' ? '下架' : '上架' }}
                  </button>
                  <button @click="confirmDelete(product)" class="text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded transition-colors flex items-center gap-1" title="删除">
                    <Trash2 class="w-3.5 h-3.5" /> 删除
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div v-if="products.length > 0" class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
        <div class="text-sm text-gray-500">
          显示第 <span class="font-bold text-gray-900">{{ startIndex + 1 }}</span> 到 
          <span class="font-bold text-gray-900">{{ Math.min(endIndex, products.length) }}</span> 条，
          共 <span class="font-bold text-gray-900">{{ products.length }}</span> 条商品
        </div>
        <div class="flex items-center gap-1 flex-wrap">
          <!-- Previous Page Button -->
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-colors focus:outline-none cursor-pointer"
            title="上一页"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          
          <!-- Page Number Buttons -->
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="goToPage(page)"
            class="px-3 py-1.5 border rounded-lg text-sm font-semibold transition-all focus:outline-none cursor-pointer"
            :class="currentPage === page 
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
              : 'border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
          >
            {{ page }}
          </button>
          
          <!-- Next Page Button -->
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-colors focus:outline-none cursor-pointer"
            title="下一页"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { 
  Plus, 
  Package, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Power, 
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next';
import { adminApi, categoriesApi } from '../../api';

const products = ref<any[]>([]);
const categories = ref<any[]>([]);
const loading = ref(true);

// --- Pagination State ---
const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => startIndex.value + itemsPerPage);

const paginatedProducts = computed(() => {
  return products.value.slice(startIndex.value, endIndex.value);
});

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const goToPage = (page: number) => {
  currentPage.value = page;
};

const filters = reactive({
  name: '',
  category_id: '',
  status: ''
});

const fetchCategories = async () => {
  try {
    const res = await categoriesApi.list();
    if (res.success) categories.value = res.data;
  } catch (e) {}
};

const fetchProducts = async () => {
  loading.value = true;
  try {
    const params = { ...filters };
    // Remove empty strings
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params] === '') delete params[key as keyof typeof params];
    });
    
    const res = await adminApi.getProducts(params);
    if (res.success) {
      products.value = res.data || [];
      currentPage.value = 1; // Reset to page 1 on search / reload
    }
  } catch (error) {
    console.error('Failed to load products', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  fetchProducts();
};

const resetFilters = () => {
  filters.name = '';
  filters.category_id = '';
  filters.status = '';
  fetchProducts();
};

onMounted(() => {
  fetchCategories();
  fetchProducts();
});

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString();
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return '已上架';
    case 'draft': return '草稿';
    case 'archived': return '已下架';
    default: return status;
  }
};

const toggleStatus = async (product: any) => {
  const newStatus = product.status === 'active' ? 'archived' : 'active';
  try {
    const res = await adminApi.updateProductStatus(product.id, newStatus);
    if (res.success) {
      product.status = newStatus;
    } else {
      alert('操作失败: ' + res.error);
    }
  } catch (error: any) {
    alert('操作失败: ' + error.message);
  }
};

const confirmDelete = async (product: any) => {
  if (confirm(`确定要删除商品 "${product.name}" 吗？此操作不可恢复。`)) {
    try {
      const res = await adminApi.deleteProduct(product.id);
      if (res.success) {
        products.value = products.value.filter(p => p.id !== product.id);
        // Correct current page if last item on last page is deleted
        if (currentPage.value > totalPages.value && totalPages.value > 0) {
          currentPage.value = totalPages.value;
        }
      } else {
        alert('删除失败: ' + res.error);
      }
    } catch (error: any) {
      alert('删除失败: ' + error.message);
    }
  }
};
</script>
