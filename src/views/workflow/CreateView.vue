<template>
  <div class="workflow-create">
    <van-search v-model="keyword" placeholder="请输入流程名称" shape="round" @search="fetchList" @clear="fetchList" />
    <van-collapse v-model="activeCategories" accordion>
      <van-collapse-item v-for="category in categories" :key="category.category" :title="category.category">
        <van-cell
          v-for="processItem in category.processList"
          :key="processItem.processDefinitionId"
          :title="processItem.processDefinitionName"
          :label="processItem.processDefinitionKey"
          is-link
          @click="startProcess(processItem)"
        />
      </van-collapse-item>
    </van-collapse>
    <van-empty v-if="!categories.length && !loading" description="暂无可发起流程" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { list as fetchProcessList } from '@/api/workflow/process';

import { useWorkflowForm } from './composables/useWorkflowForm';

interface CategoryItem {
  category: string;
  processList: Array<Record<string, any>>;
}

const keyword = ref('');
const categories = ref<CategoryItem[]>([]);
const activeCategories = ref<string[]>([]);
const loading = ref(false);

const workflow = useWorkflowForm();

onMounted(fetchList);

async function fetchList() {
  loading.value = true;
  try {
    const response = await fetchProcessList({ processDefinitionName: keyword.value, platform: 'h5' });
    const data = (response as any).data ?? response;
    categories.value = data || [];
    activeCategories.value = categories.value.map((item) => item.category);
  } finally {
    loading.value = false;
  }
}

function startProcess(item: Record<string, any>) {
  workflow.dynamicRoute(item, 'start');
}
</script>

<style scoped>
.workflow-create {
  min-height: 100vh;
  padding: 16px;
  background-color: #f7f8fa;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
