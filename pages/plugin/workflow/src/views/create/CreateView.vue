<template>
  <div class="create">
    <van-nav-bar title="发起流程" left-arrow @click-left="router.back" fixed placeholder />
    <section class="banner">
      <van-search
        v-model="keyword"
        placeholder="请输入流程名称"
        background="transparent"
        @search="loadData"
        @clear="loadData"
      />
    </section>
    <section class="content">
      <van-collapse v-model="activeCollapse">
        <van-collapse-item
          v-for="category in categories"
          :key="category.category"
          :name="category.category"
          :title="category.category"
        >
          <van-cell
            v-for="process in category.processList"
            :key="process.id"
            :title="process.processDefinitionName"
            :icon="process.icon ? undefined : 'records'"
            :value="process.processDefinitionKey"
            @click="startProcess(process)"
          >
            <template v-if="process.icon" #icon>
              <van-image width="40" height="40" round :src="process.icon" />
            </template>
          </van-cell>
        </van-collapse-item>
      </van-collapse>
      <wf-empty v-if="!categories.length" text="暂无可发起流程" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { showFailToast, showLoadingToast, showSuccessToast } from 'vant';
import { fetchProcessList } from '@/api/process';
import WfEmpty from '@/components/WfEmpty.vue';

interface ProcessCategory {
  category: string;
  processList: any[];
}

const router = useRouter();
const keyword = ref('');
const categories = ref<ProcessCategory[]>([]);
const activeCollapse = ref<string[]>([]);

const loadData = async () => {
  let toast: ReturnType<typeof showLoadingToast> | undefined;
  try {
    toast = showLoadingToast({ message: '加载中...', duration: 0 });
    const platform = 'h5';
    const { data } = await fetchProcessList({
      processDefinitionName: keyword.value,
      platform
    });
    categories.value = data || [];
    activeCollapse.value = categories.value.map((item) => item.category);
  } catch (error: any) {
    showFailToast(error.message || '加载失败');
  } finally {
    toast?.close();
  }
};

const startProcess = (process: any) => {
  showSuccessToast(`即将发起 ${process.processDefinitionName}`);
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.create {
  min-height: 100vh;
  background: #f5f6fa;
}

.banner {
  padding: 64px 16px 0;
  background: linear-gradient(135deg, #5a7bff 0%, #3a5bff 100%);
}

:deep(.van-search__content) {
  background: rgba(255, 255, 255, 0.2);
}

.content {
  padding: 16px;
}
</style>
