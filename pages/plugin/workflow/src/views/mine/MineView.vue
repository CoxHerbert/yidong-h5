<template>
  <div class="mine">
    <van-nav-bar title="我的流程" left-arrow @click-left="router.back" fixed placeholder />

    <div class="banner">
      <van-search
        v-model="keyword"
        placeholder="请输入流程名称"
        background="transparent"
        shape="round"
        @search="refresh"
        @clear="refresh"
      />
      <van-tabs v-model:active="activeTab" swipeable @change="handleTabChange">
        <van-tab v-for="tab in tabs" :title="tab.title" :name="tab.name" :key="tab.name" />
      </van-tabs>
    </div>

    <section class="list-container">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadMore"
      >
        <wkf-card
          :list="records"
          :type="currentTab?.type"
          :show-actions="currentTab?.name === 'todo'"
          empty-text="暂无流程记录"
          @view="handleView"
          @approve="handleApprove"
          @reject="handleReject"
        />
      </van-list>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showFailToast, showLoadingToast, showSuccessToast } from 'vant';
import WkfCard from '@/components/WkfCard.vue';
import {
  fetchTodoList,
  fetchSendList,
  fetchMyDoneList,
  fetchDoneList
} from '@/api/process';

interface TabItem {
  title: string;
  name: 'todo' | 'request' | 'done' | 'finished';
  loader: typeof fetchTodoList;
  type: number;
}

const router = useRouter();
const route = useRoute();

const keyword = ref('');
const activeTab = ref<TabItem['name']>('todo');
const records = ref<any[]>([]);
const page = ref(1);
const loading = ref(false);
const finished = ref(false);

const tabs: TabItem[] = [
  { title: '我的待办', name: 'todo', loader: fetchTodoList, type: 0 },
  { title: '我的请求', name: 'request', loader: fetchSendList, type: 1 },
  { title: '我的已办', name: 'done', loader: fetchMyDoneList, type: 2 },
  { title: '办结事宜', name: 'finished', loader: fetchDoneList, type: 3 }
];

const currentTab = computed(() => tabs.find((tab) => tab.name === activeTab.value));

const initFromQuery = () => {
  const tab = route.query.tab as TabItem['name'];
  if (tab && tabs.some((item) => item.name === tab)) {
    activeTab.value = tab;
  }
};

const reset = () => {
  records.value = [];
  page.value = 1;
  finished.value = false;
};

const loadMore = async () => {
  if (!currentTab.value) return;
  loading.value = true;
  let toast: ReturnType<typeof showLoadingToast> | undefined;
  try {
    toast = showLoadingToast({ message: '加载中...', duration: 0 });
    const { data } = await currentTab.value.loader({
      current: page.value,
      size: 10,
      processDefinitionName: keyword.value
    });
    const newRecords = data.records || [];
    records.value.push(...newRecords);
    finished.value = newRecords.length < 10;
    page.value += 1;
  } catch (error: any) {
    showFailToast(error.message || '加载失败');
    finished.value = true;
  } finally {
    toast?.close();
    loading.value = false;
  }
};

const refresh = () => {
  reset();
  loadMore();
};

const handleTabChange = () => {
  reset();
  loadMore();
};

const handleView = (item: any) => {
  showSuccessToast(`查看 ${item.processDefinitionName}`);
};

const handleApprove = (item: any) => {
  showSuccessToast(`已同意 ${item.processDefinitionName}`);
};

const handleReject = (item: any) => {
  showFailToast(`已拒绝 ${item.processDefinitionName}`);
};

watch(
  () => route.query.tab,
  () => {
    initFromQuery();
    refresh();
  }
);

onMounted(() => {
  initFromQuery();
  refresh();
});
</script>

<style scoped>
.mine {
  min-height: 100vh;
  background: #f5f6fa;
}

.banner {
  padding: 64px 16px 0;
  background: linear-gradient(135deg, #5a7bff 0%, #3a5bff 100%);
  color: #fff;
}

:deep(.van-search__content) {
  background: rgba(255, 255, 255, 0.2);
}

.list-container {
  padding: 16px;
}
</style>
