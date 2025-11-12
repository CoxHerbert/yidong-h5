<template>
  <div class="workflow-mine">
    <van-search v-model="keyword" placeholder="请输入流程名称" shape="round" @search="refresh" @clear="refresh" />
    <van-tabs v-model:active="activeTab" shrink background="transparent" color="#4b7bff" @change="handleTabChange">
      <van-tab v-for="(tab, index) in tabs" :key="tab.name" :title="tab.name" :name="index">
        <div class="workflow-mine__content">
          <workflow-task-list :tasks="tasks" :loading="loading && !tasks.length" />
          <van-button
            v-if="tasks.length && !finished"
            type="primary"
            block
            plain
            :loading="loading"
            @click="loadMore"
          >
            加载更多
          </van-button>
          <van-empty v-if="finished && !loading && !tasks.length" description="暂无数据" />
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { doneList, myDoneList, sendList, todoList } from '@/api/workflow/process';

import WorkflowTaskList from './components/WorkflowTaskList.vue';

const keyword = ref('');
const activeTab = ref(0);
const tasks = ref([]);
const loading = ref(false);
const finished = ref(false);
const page = ref(1);
const pageSize = 5;

const tabs = [
  { name: '我的待办', loader: todoList },
  { name: '我的请求', loader: sendList },
  { name: '我的已办', loader: myDoneList },
  { name: '办结事宜', loader: doneList },
];

const route = useRoute();

onMounted(() => {
  if (route.query.current) {
    activeTab.value = Number(route.query.current);
  }
  refresh();
});

async function fetchList(reset = false) {
  if (loading.value) return;
  loading.value = true;
  try {
    if (reset) {
      page.value = 1;
      tasks.value = [];
      finished.value = false;
    }
    const loader = tabs[activeTab.value]?.loader;
    if (!loader) return;
    const response = await loader({
      processDefinitionName: keyword.value,
      current: page.value,
      size: pageSize,
    });
    const data = response?.data ?? response;
    const records = data?.records || [];
    tasks.value = reset ? records : tasks.value.concat(records);
    finished.value = records.length < pageSize;
    page.value += 1;
  } finally {
    loading.value = false;
  }
}

function refresh() {
  fetchList(true);
}

function loadMore() {
  fetchList(false);
}

function handleTabChange() {
  refresh();
}
</script>

<style scoped>
.workflow-mine {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding: 16px;
}

.workflow-mine__content {
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
