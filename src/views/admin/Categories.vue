<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-xl font-bold text-gray-900">分类管理</h3>
      <button 
        @click="openAddModal" 
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
      >
        <Plus class="w-4 h-4" /> 新增分类
      </button>
    </div>

    <!-- Category List -->
    <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">分类名称</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">图标代码</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">排序</th>
            <th class="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          <tr v-if="loading">
            <td colspan="5" class="px-6 py-10 text-center text-sm text-gray-400">
              <Loader2 class="w-6 h-6 animate-spin mx-auto mb-2" />
              正在加载分类...
            </td>
          </tr>
          <tr v-else-if="categories.length === 0">
            <td colspan="5" class="px-6 py-10 text-center text-sm text-gray-400">暂无分类数据</td>
          </tr>
          <tr v-for="cat in categories" :key="cat.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ cat.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-bold text-gray-900">{{ cat.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{{ cat.icon || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ cat.sort_order }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <button @click="openEditModal(cat)" class="text-amber-600 hover:text-amber-900 bg-amber-50 px-3 py-1 rounded transition-colors">
                  编辑
                </button>
                <button @click="confirmDelete(cat)" class="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded transition-colors">
                  删除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Category Modal (Add/Edit) -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h4 class="text-lg font-bold text-gray-900">{{ isEditing ? '编辑分类' : '新增分类' }}</h4>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">分类名称 *</label>
            <input 
              v-model="modalData.name" 
              type="text" 
              required 
              placeholder="例如：3D 模型" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">图标 (Lucide 图标名)</label>
            <input 
              v-model="modalData.icon" 
              type="text" 
              placeholder="例如：Package" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">排序权重</label>
            <input 
              v-model.number="modalData.sort_order" 
              type="number" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div class="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              @click="showModal = false" 
              class="px-4 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg"
            >
              取消
            </button>
            <button 
              type="submit" 
              :disabled="saving"
              class="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
              {{ isEditing ? '保存修改' : '立即创建' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { Plus, X, Loader2 } from 'lucide-vue-next';
import { categoriesApi, adminApi } from '../../api';

const categories = ref<any[]>([]);
const loading = ref(true);
const saving = ref(false);
const showModal = ref(false);
const isEditing = ref(false);
const currentId = ref<number | null>(null);

const modalData = reactive({
  name: '',
  icon: '',
  sort_order: 0
});

const fetchCategories = async () => {
  loading.value = true;
  try {
    const res = await categoriesApi.list();
    if (res.success) {
      categories.value = res.data || [];
    }
  } catch (error) {
    console.error('Failed to fetch categories', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCategories);

const openAddModal = () => {
  isEditing.value = false;
  currentId.value = null;
  modalData.name = '';
  modalData.icon = '';
  modalData.sort_order = 0;
  showModal.value = true;
};

const openEditModal = (cat: any) => {
  isEditing.value = true;
  currentId.value = cat.id;
  modalData.name = cat.name;
  modalData.icon = cat.icon;
  modalData.sort_order = cat.sort_order;
  showModal.value = true;
};

const handleSubmit = async () => {
  saving.value = true;
  try {
    let res;
    if (isEditing.value && currentId.value) {
      res = await adminApi.updateCategory(currentId.value, modalData);
    } else {
      res = await adminApi.createCategory(modalData);
    }
    
    if (res.success) {
      showModal.value = false;
      fetchCategories();
    } else {
      alert('操作失败: ' + res.error);
    }
  } catch (error: any) {
    alert('操作失败: ' + error.message);
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (cat: any) => {
  if (confirm(`确定要删除分类 "${cat.name}" 吗？\n注意：如果分类下已有商品，删除将失败。`)) {
    try {
      const res = await adminApi.deleteCategory(cat.id);
      if (res.success) {
        fetchCategories();
      } else {
        alert('删除失败: ' + res.error);
      }
    } catch (error: any) {
      alert('删除失败: ' + error.message);
    }
  }
};
</script>
