<template>
  <div v-if="src" class="workflow-bpmn" data-testid="workflow-bpmn">
    <iframe :src="src" class="workflow-bpmn__frame" @load="loading = false" />
    <div v-if="loading" class="workflow-bpmn__loading">
      <van-loading type="spinner" size="24px" />
    </div>
  </div>
  <van-empty v-else description="暂无流程图数据" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

interface BpmnOption {
  processInsId?: string;
  taskId?: string;
  token?: string;
}

const props = defineProps<{ bpmnOption: BpmnOption | null }>();

const loading = ref(true);

const src = computed(() => {
  const option = props.bpmnOption;
  if (!option?.processInsId || !option?.taskId || !option?.token) {
    return '';
  }
  const base = import.meta.env.DEV ? 'http://localhost:2888' : 'https://www.eastwinbip.com';
  const query = new URLSearchParams({
    processInsId: option.processInsId,
    taskId: option.taskId,
    token: option.token,
  });
  return `${base}/process-priview?${query.toString()}`;
});

watch(
  () => props.bpmnOption,
  () => {
    loading.value = true;
  },
  { deep: true }
);
</script>

<style scoped>
.workflow-bpmn {
  position: relative;
  width: 100%;
  height: calc(100vh - 160px);
}

.workflow-bpmn__frame {
  width: 100%;
  height: 100%;
  border: none;
}

.workflow-bpmn__loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.88);
}
</style>
