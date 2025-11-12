<template>
  <div class="workbench">
    <van-nav-bar title="工作台" fixed placeholder />
    <div class="hero">
      <h1>工作台</h1>
      <p>{{ todoTotal > 0 ? `目前有${todoTotal}个待办事宜` : '目前没有待办事宜，可以放松一下啦' }}</p>
    </div>
    <div class="grid-wrapper">
      <van-grid :column-num="4" :border="false">
        <van-grid-item
          v-for="item in gridItems"
          :key="item.type"
          :icon="item.icon"
          :text="item.name"
          @click="handleNavigate(item)"
        />
      </van-grid>
    </div>

    <section class="card-wrapper">
      <header class="section-title">
        <div class="marker"></div>
        <span>我的待办</span>
        <van-button size="mini" type="primary" plain @click="handleNavigate(gridItems[0])"
          >查看全部</van-button
        >
      </header>
      <wkf-card
        :list="todoList"
        empty-text="暂无待办事项"
        show-actions
        @view="handleView"
        @approve="handleApprove"
        @reject="handleReject"
      />
    </section>

    <van-floating-bubble axis="xy" icon="plus" @click="router.push('/create')" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { showConfirmDialog, showFailToast, showLoadingToast, showSuccessToast } from 'vant';
import WkfCard from '@/components/WkfCard.vue';
import { fetchTodoList } from '@/api/process';

interface GridItem {
  name: string;
  type: string;
  icon: string;
  route: string;
}

const router = useRouter();
const todoList = ref<any[]>([]);
const todoTotal = ref(0);

const gridItems: GridItem[] = [
  { name: '我的待办', type: 'todo', icon: 'todo-list-o', route: '/mine?tab=todo' },
  { name: '我的请求', type: 'request', icon: 'envelop-o', route: '/mine?tab=request' },
  { name: '我的已办', type: 'done', icon: 'passed', route: '/mine?tab=done' },
  { name: '办结事宜', type: 'finished', icon: 'completed', route: '/mine?tab=finished' }
];

const loadTodo = async () => {
  let toast: ReturnType<typeof showLoadingToast> | undefined;
  try {
    toast = showLoadingToast({ message: '加载中...', duration: 0 });
    const { data } = await fetchTodoList({ current: 1, size: 5 });
    todoList.value = data.records || [];
    todoTotal.value = data.total || 0;
  } catch (error: any) {
    showFailToast(error.message || '加载失败');
  } finally {
    toast?.close();
  }
};

const handleNavigate = (item: GridItem) => {
  router.push(item.route);
};

const handleView = (item: any) => {
  showConfirmDialog({
    title: '查看流程',
    message: `跳转到流程 ${item.processDefinitionName}`
  });
};

const handleApprove = (item: any) => {
  showSuccessToast(`已同意 ${item.processDefinitionName}`);
};

const handleReject = (item: any) => {
  showFailToast(`已拒绝 ${item.processDefinitionName}`);
};

onMounted(() => {
  loadTodo();
});
</script>

<style scoped>
.workbench {
  min-height: 100vh;
  background: #f5f6fa;
  padding-bottom: 120px;
}

.hero {
  padding: 72px 24px 24px;
  background: linear-gradient(120deg, #5a7bff 0%, #3a5bff 100%);
  color: #fff;
}

.hero h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.hero p {
  margin: 12px 0 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
}

.grid-wrapper {
  padding: 0 12px;
  margin-top: -48px;
}

.card-wrapper {
  padding: 24px 16px 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-title .marker {
  width: 4px;
  height: 16px;
  background: #3a5bff;
  border-radius: 2px;
}
</style>
