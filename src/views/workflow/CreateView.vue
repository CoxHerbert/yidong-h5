<template>
  <div class="workflow-create">
    <van-search
      v-model="keyword"
      placeholder="请输入流程名称"
      shape="round"
      @search="fetchList"
      @clear="fetchList"
    />
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

<script>
import { onMounted, ref } from 'vue';

import { list as fetchProcessList } from '@/api/workflow/process';

import { useWorkflowForm } from './composables/useWorkflowForm';

export default {
  name: 'WorkflowCreateView',
  setup() {
    const keyword = ref('');
    const categories = ref([]);
    const activeCategories = ref([]);
    const loading = ref(false);

    const workflow = useWorkflowForm();

    async function fetchList() {
      loading.value = true;
      try {
        const response = await fetchProcessList({ processDefinitionName: keyword.value, platform: 'h5' });
        const data = response?.data ?? response;
        categories.value = data || [];
        activeCategories.value = categories.value.map((item) => item.category);
      } finally {
        loading.value = false;
      }
    }

    function startProcess(item) {
      workflow.dynamicRoute(item, 'start');
    }

    onMounted(fetchList);

    return {
      keyword,
      categories,
      activeCategories,
      loading,
      fetchList,
      startProcess,
    };
  },
};
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
