<template>
  <div class="workflow-workbench">
    <section class="workflow-workbench__hero">
      <div class="workflow-workbench__title">工作台</div>
      <div class="workflow-workbench__subtitle">
        {{ total > 0 ? `目前有 ${total} 个待办事宜` : '目前没有待办事宜，可以放松一下啦' }}
      </div>
    </section>
    <section class="workflow-workbench__grid">
      <van-grid :column-num="4" :border="false">
        <van-grid-item v-for="item in shortcuts" :key="item.name" :icon="item.icon" :text="item.name" @click="navigate(item)" />
      </van-grid>
    </section>
    <section class="workflow-workbench__tasks">
      <div class="workflow-workbench__section-title">
        <van-tag type="primary" plain>我的待办</van-tag>
        <van-button type="link" size="small" @click="navigate(shortcuts[0])">查看全部</van-button>
      </div>
      <workflow-task-list :tasks="tasks" :loading="loading" />
    </section>
    <van-floating-bubble axis="xy" icon="plus" @click="router.push({ name: 'workflow-create' })" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { todoList } from '@/api/workflow/process';

import WorkflowTaskList from './components/WorkflowTaskList.vue';

interface Shortcut {
  name: string;
  icon: string;
  route: { name: string; query?: Record<string, any> };
}

const router = useRouter();
const tasks = ref<Record<string, any>[]>([]);
const total = ref(0);
const loading = ref(false);

const shortcuts: Shortcut[] = [
  { name: '我的待办', icon: 'todo-list-o', route: { name: 'workflow-mine', query: { current: '0' } } },
  { name: '我的请求', icon: 'user-o', route: { name: 'workflow-mine', query: { current: '1' } } },
  { name: '我的已办', icon: 'passed', route: { name: 'workflow-mine', query: { current: '2' } } },
  { name: '办结事宜', icon: 'notes-o', route: { name: 'workflow-mine', query: { current: '3' } } },
];

onMounted(fetchTodoList);

async function fetchTodoList() {
  loading.value = true;
  try {
    const response = await todoList({ current: 1, size: 5 });
    const data = (response as any).data ?? response;
    tasks.value = data?.records || [];
    total.value = data?.total || tasks.value.length;
  } finally {
    loading.value = false;
  }
}

function navigate(item: Shortcut) {
  router.push(item.route);
}
</script>

<style scoped>
.workflow-workbench {
  min-height: 100vh;
  padding: 16px;
  background: linear-gradient(180deg, #eef3ff 0%, #f7f8fa 100%);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.workflow-workbench__hero {
  background: #4b7bff;
  color: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 12px 32px rgba(75, 123, 255, 0.28);
}

.workflow-workbench__title {
  font-size: 22px;
  font-weight: 700;
}

.workflow-workbench__subtitle {
  margin-top: 8px;
  font-size: 14px;
  opacity: 0.9;
}

.workflow-workbench__grid {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.workflow-workbench__tasks {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.workflow-workbench__section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
