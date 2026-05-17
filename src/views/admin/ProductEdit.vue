<template>
  <div class="w-full space-y-6 pb-20">
    <div class="flex items-center gap-4 border-b border-gray-200 pb-4">
      <router-link to="/admin/products" class="text-gray-500 hover:text-gray-700">
        <ArrowLeft class="w-5 h-5" />
      </router-link>
      <h2 class="text-xl font-bold text-gray-900">{{ isEditing ? '编辑商品' : '新增商品' }}</h2>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- 基础信息 -->
      <div class="bg-white shadow rounded-lg p-6 border border-gray-200 space-y-6">
        <h3 class="text-lg font-medium text-gray-900 border-b pb-2">基础信息</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">商品名称 *</label>
            <input v-model="form.name" required type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">价格 (NB) *</label>
            <input v-model="form.price" required type="number" step="0.01" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              成本 (NB) * 
              <span class="text-xs text-gray-400 font-normal">(仅后台记录，前端不展示)</span>
            </label>
            <input v-model="form.cost" required type="number" step="0.01" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">分类 *</label>
            <select v-model="form.category_id" required class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">标签 (短语)</label>
            <input v-model="form.tag" type="text" placeholder="例如：高级账号" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">主图 URL</label>
            <input v-model="form.image_url" type="url" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">状态</label>
            <select v-model="form.status" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
              <option value="active">上架</option>
              <option value="draft">草稿</option>
              <option value="archived">下架</option>
            </select>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">简短描述</label>
          <input v-model="form.description" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">详细介绍</label>
          <textarea v-model="form.long_description" rows="4" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"></textarea>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">商品备注 <span class="text-xs text-gray-400 font-normal">(仅后台可见，前端不返回、不展示)</span></label>
          <textarea v-model="form.admin_note" rows="3" placeholder="在此输入此商品的管理员内部备注信息..." class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"></textarea>
        </div>

        <!-- Notices -->
        <div class="space-y-4 pt-4 border-t">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700">注意事项 (每条为独立项目)</label>
            <button type="button" @click="addNotice" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
              <Plus class="w-4 h-4" /> 添加注意
            </button>
          </div>
          
          <div v-for="(notice, idx) in form.notices" :key="idx" class="flex items-start gap-4 bg-gray-50 p-2 rounded-md border border-gray-200">
            <textarea v-model="form.notices[idx]" rows="2" placeholder="输入注意事项内容（支持HTML，如 <span class='text-error font-bold'>重要</span>）" required class="flex-1 rounded-md border-gray-300 shadow-sm sm:text-sm px-3 py-1.5 border"></textarea>
            <button type="button" @click="form.notices.splice(idx, 1)" class="text-red-500 hover:text-red-700 mt-2">
              <X class="w-5 h-5" />
            </button>
          </div>
          <p v-if="!form.notices || form.notices.length === 0" class="text-xs text-gray-500">留空则前端将显示默认的注意事项。</p>
        </div>
      </div>

      <!-- 变体配置 (易用版) -->
      <div class="bg-white shadow rounded-lg p-6 border border-gray-200 space-y-6">
        <div class="flex items-center justify-between border-b pb-2">
          <h3 class="text-lg font-medium text-gray-900">变体与规格 (选填)</h3>
        </div>

        <!-- Types -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">可选类型</label>
          <div v-if="parsedTypes.length > 0" class="flex flex-wrap gap-2 mb-2">
            <span v-for="(typeStr, tIdx) in parsedTypes" :key="tIdx" class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-100 text-indigo-700 text-sm font-medium border border-indigo-200">
              {{ typeStr }}
              <button type="button" @click="removeType(tIdx)" class="text-indigo-500 hover:text-indigo-800 ml-1">
                <X class="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
          <div class="flex items-center gap-2">
            <input v-model="newType" @keydown.enter.prevent="addType" type="text" placeholder="输入类型名称后按回车(Enter)添加，例如：基础版" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
            <button type="button" @click="addType" class="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded border border-gray-300 hover:bg-gray-200 text-sm transition-colors">添加</button>
          </div>
          <p class="text-xs text-gray-500">留空则不显示类型选择。</p>
        </div>

        <!-- Packages -->
        <div class="space-y-4 pt-4 border-t">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700">套餐选项</label>
            <button type="button" @click="addPackage" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
              <Plus class="w-4 h-4" /> 添加套餐
            </button>
          </div>
          
          <div v-for="(pkg, idx) in form.packages" :key="idx" class="bg-gray-50 p-4 rounded-md border border-gray-200 relative">
            <button type="button" @click="form.packages.splice(idx, 1)" class="absolute top-2 right-2 text-red-500 hover:text-red-700">
              <X class="w-4 h-4" />
            </button>
            <div class="grid grid-cols-2 gap-4 mb-2">
              <input v-model="pkg.name" placeholder="套餐名称" required class="rounded-md border-gray-300 shadow-sm sm:text-sm px-3 py-1.5 border" />
              <input v-model="pkg.price" type="number" step="0.01" placeholder="价格" required class="rounded-md border-gray-300 shadow-sm sm:text-sm px-3 py-1.5 border" />
            </div>
            <input v-model="pkg._rawFeatures" placeholder="包含功能，用逗号分隔 (如: 解锁全站, 专属客服)" class="w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-3 py-1.5 border mt-2" />
            
            <!-- Type Association -->
            <div v-if="parsedTypes.length > 0" class="mt-3 pt-3 border-t border-gray-200">
              <span class="text-xs text-gray-500 block mb-1">关联类型 (不选则适用于所有)</span>
              <div class="flex flex-wrap gap-3">
                <label v-for="(typeStr, tIdx) in parsedTypes" :key="tIdx" class="inline-flex items-center gap-1 text-sm text-gray-700">
                  <input type="checkbox" :value="tIdx" v-model="pkg._typeIdxs" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  {{ typeStr }}
                </label>
              </div>
            </div>
          </div>
          <p v-if="!form.packages || form.packages.length === 0" class="text-xs text-gray-500">留空则不显示套餐选择。</p>
        </div>

        <!-- Durations -->
        <div class="space-y-4 pt-4 border-t">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700">时长选项</label>
            <button type="button" @click="addDuration" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
              <Plus class="w-4 h-4" /> 添加时长
            </button>
          </div>
          
          <div v-for="(dur, idx) in form.durations" :key="idx" class="bg-gray-50 p-4 rounded-md border border-gray-200 relative">
            <button type="button" @click="form.durations.splice(idx, 1)" class="absolute top-2 right-2 text-red-500 hover:text-red-700">
              <X class="w-4 h-4" />
            </button>
            <div class="grid grid-cols-3 gap-4 mb-2">
              <input v-model="dur.name" placeholder="时长名称 (如: 1个月)" required class="rounded-md border-gray-300 shadow-sm sm:text-sm px-3 py-1.5 border" />
              <input v-model="dur.price_modifier" type="number" step="0.01" placeholder="加价金额" required class="rounded-md border-gray-300 shadow-sm sm:text-sm px-3 py-1.5 border" />
              <input v-model="dur.tag" placeholder="标签 (如: 推荐)" class="rounded-md border-gray-300 shadow-sm sm:text-sm px-3 py-1.5 border" />
            </div>

            <!-- Package Association -->
            <div v-if="form.packages && form.packages.length > 0" class="mt-3 pt-3 border-t border-gray-200">
              <span class="text-xs text-gray-500 block mb-1">关联套餐 (不选则适用于所有)</span>
              <div class="flex flex-wrap gap-3">
                <label v-for="(pkg, pIdx) in form.packages" :key="pIdx" class="inline-flex items-center gap-1 text-sm text-gray-700">
                  <input type="checkbox" :value="pkg.id || pIdx + 1" v-model="dur._pkgIds" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  {{ pkg.name || '未命名套餐' }}
                </label>
              </div>
            </div>
          </div>
          <p v-if="!form.durations || form.durations.length === 0" class="text-xs text-gray-500">留空则不显示时长选择。</p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-end gap-4 border-t pt-4">
        <router-link to="/admin/products" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          取消
        </router-link>
        <button type="submit" :disabled="saving" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none flex items-center gap-2 disabled:opacity-50">
          <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
          保存商品
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Plus, X, Loader2 } from 'lucide-vue-next';
import { adminApi, categoriesApi, productsApi } from '../../api';

const route = useRoute();
const router = useRouter();

const isEditing = computed(() => !!route.params.id);
const saving = ref(false);

const categories = ref<any[]>([]);

const newType = ref('');
const parsedTypes = ref<string[]>([]);

const addType = () => {
  const t = newType.value.trim();
  if (t && !parsedTypes.value.includes(t)) {
    parsedTypes.value.push(t);
  }
  newType.value = '';
};

const removeType = (idx: number) => {
  parsedTypes.value.splice(idx, 1);
};

const form = ref<any>({
  name: '',
  description: '',
  long_description: '',
  price: 0,
  cost: 0,
  currency: 'NB',
  category_id: 1,
  tag: '',
  image_url: '',
  status: 'active',
  is_featured: false,
  types: [],
  packages: [],
  durations: [],
  notices: [
    '部分商品下单后需人工核验可能存在延迟属于正常现象，如果超过24小时没处理，请联系客服人员',
    '支付后，可前往我的订单查看订单状态，如果为<span class="text-error font-blod">已完成</span>即可查看商品信息，如果为<span class="text-error font-blod">处理中</span>，请耐心等待',
    '<span class="text-error font-blod">一定要按照订单中商品信息的说明进行使用，如不按照说明使用，本站概不质保</span>'
  ],
  admin_note: ''
});

onMounted(async () => {
  // Load categories
  try {
    const catRes = await categoriesApi.list();
    if (catRes.success) {
      categories.value = catRes.data || [];
    }
  } catch (e) {}

  if (isEditing.value) {
    try {
      const res = await adminApi.getProductById(route.params.id as string);
      if (res.success && res.data) {
        form.value = { ...res.data };
        
        // Transform variants for editing
        parsedTypes.value = form.value.types || [];
        if (form.value.packages) {
          form.value.packages.forEach((pkg: any) => {
            pkg._rawFeatures = pkg.features ? pkg.features.join(', ') : '';
            pkg._typeIdxs = pkg.type_idxs || [];
          });
        }
        if (form.value.durations) {
          form.value.durations.forEach((dur: any) => {
            dur._pkgIds = dur.pkg_ids || [];
          });
        }
        if (!form.value.notices) {
          form.value.notices = [];
        }
      }
    } catch (e) {
      console.error(e);
      alert('加载商品失败');
      router.push('/admin/products');
    }
  }
});

const addPackage = () => {
  if (!form.value.packages) form.value.packages = [];
  form.value.packages.push({ name: '', price: 0, _rawFeatures: '', _typeIdxs: [] });
};

const addDuration = () => {
  if (!form.value.durations) form.value.durations = [];
  form.value.durations.push({ name: '', price_modifier: 0, tag: '', _pkgIds: [] });
};

const addNotice = () => {
  if (!form.value.notices) form.value.notices = [];
  form.value.notices.unshift('');
};

const handleSubmit = async () => {
  saving.value = true;
  try {
    // Process variants before saving
    const payload = { ...form.value };
    
    payload.types = parsedTypes.value;
    if (payload.types.length === 0) payload.types = null;

    if (payload.packages && payload.packages.length > 0) {
      payload.packages = payload.packages.map((pkg: any, idx: number) => ({
        id: pkg.id || idx + 1,
        name: pkg.name,
        price: Number(pkg.price),
        features: pkg._rawFeatures ? pkg._rawFeatures.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [],
        type_idxs: pkg._typeIdxs && pkg._typeIdxs.length > 0 ? pkg._typeIdxs : null
      }));
    } else {
      payload.packages = null;
    }

    if (payload.durations && payload.durations.length > 0) {
      payload.durations = payload.durations.map((dur: any, idx: number) => ({
        id: dur.id || idx + 1,
        name: dur.name,
        price_modifier: Number(dur.price_modifier),
        tag: dur.tag,
        pkg_ids: dur._pkgIds && dur._pkgIds.length > 0 ? dur._pkgIds : null
      }));
    } else {
      payload.durations = null;
    }

    if (payload.notices) {
      payload.notices = payload.notices.filter((n: string) => n.trim() !== '');
      if (payload.notices.length === 0) payload.notices = null;
    }

    let res;
    if (isEditing.value) {
      res = await adminApi.updateProduct(route.params.id as any, payload);
    } else {
      res = await adminApi.createProduct(payload);
    }

    if (res.success) {
      router.push('/admin/products');
    } else {
      alert('保存失败: ' + res.error);
    }
  } catch (e: any) {
    alert('保存出错: ' + e.message);
  } finally {
    saving.value = false;
  }
};
</script>
