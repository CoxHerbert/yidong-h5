<template>
  <van-empty v-if="!tasks.length && !loading" description="暂无数据" />
  <div v-else class="workflow-task-list">
    <van-skeleton v-for="index in (loading ? placeholderCount : 0)" :key="index" title :row="3" />
    <van-card
      v-for="task in tasks"
      :key="task.id || task.taskId"
      :title="task.processDefinitionName || task.name"
      :desc="task.taskName"
      :tag="task.status"
      @click="handleClick(task)"
    >
      <template #tags>
        <van-tag v-if="task.status === 'todo'" type="primary">待办</van-tag>
        <van-tag v-else-if="task.status === 'delay'" type="danger">超时</van-tag>
        <van-tag v-else type="success">已办</van-tag>
      </template>
      <template #footer>
        <div class="workflow-task-list__footer">
          <span>申请人：{{ task.startUsername }}</span>
          <span>{{ task.createTime }}</span>
        </div>
      </template>
    </van-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { useWorkflowForm } from '../composables/useWorkflowForm';

const props = defineProps<{
  tasks: Array<Record<string, any>>;
  loading?: boolean;
}>();

const workflow = useWorkflowForm();

const placeholderCount = computed(() => (props.tasks.length > 0 ? 0 : 2));

function handleClick(task: Record<string, any>) {
  workflow.dynamicRoute(task, 'detail');
}
</script>

<style scoped>
.workflow-task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.workflow-task-list__footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #969799;
}
</style>
