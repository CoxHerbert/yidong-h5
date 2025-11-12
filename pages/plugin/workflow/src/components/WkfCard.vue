<template>
  <van-space fill direction="vertical" :size="12">
    <van-card
      v-for="item in list"
      :key="item.id || item.taskId"
      class="wkf-card"
      :title="item.processDefinitionName"
      :desc="item.categoryName"
      :thumb="item.applyUser?.avatar || defaultAvatar"
      :tag="statusMap[item.processIsFinished || item.status]?.label"
      :tag-text-color="statusMap[item.processIsFinished || item.status]?.color"
      @click="emit('view', item)"
    >
      <template #tags>
        <van-tag :type="statusMap[item.processIsFinished || item.status]?.type || 'primary'">
          {{ statusMap[item.processIsFinished || item.status]?.label || '正常' }}
        </van-tag>
      </template>
      <template #desc>
        <div class="cell" v-if="item.variables?.serialNumber">
          <span class="label">流水号：</span>
          <span class="value">{{ item.variables.serialNumber }}</span>
        </div>
        <div class="cell" v-if="!isDone">
          <span class="label">当前节点：</span>
          <span class="value">{{ item.taskName }}</span>
        </div>
        <div class="cell">
          <span class="label">申请人：</span>
          <span class="value">{{ item.startUsername }}</span>
        </div>
        <div class="cell">
          <span class="label">申请时间：</span>
          <span class="value">{{ item.createTime }}</span>
        </div>
      </template>
      <template v-if="showActions" #footer>
        <div class="footer">
          <van-button size="small" plain type="danger" @click.stop="emit('reject', item)">拒绝</van-button>
          <van-button size="small" type="primary" @click.stop="emit('approve', item)">同意</van-button>
        </div>
      </template>
    </van-card>
  </van-space>
  <wf-empty v-if="!list.length" :text="emptyText" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import WfEmpty from './WfEmpty.vue';

interface WkfItem {
  id?: string | number;
  taskId?: string | number;
  processDefinitionName?: string;
  categoryName?: string;
  variables?: Record<string, any>;
  taskName?: string;
  startUsername?: string;
  createTime?: string;
  status?: string;
  processIsFinished?: string;
  applyUser?: {
    avatar?: string;
  };
}

interface Props {
  list: WkfItem[];
  showActions?: boolean;
  type?: number;
  emptyText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  list: () => [],
  showActions: false,
  type: 0,
  emptyText: '暂无流程数据'
});

const emit = defineEmits<{
  (e: 'view', item: WkfItem): void;
  (e: 'approve', item: WkfItem): void;
  (e: 'reject', item: WkfItem): void;
}>();

const defaultAvatar =
  'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';

const statusMap: Record<string, { label: string; type: 'success' | 'danger' | 'warning' | 'primary'; color: string }> = {
  todo: { label: '待办', type: 'primary', color: '#1989fa' },
  delay: { label: '超时', type: 'danger', color: '#ee0a24' },
  finished: { label: '结束', type: 'success', color: '#07c160' },
  unfinished: { label: '正常', type: 'primary', color: '#1989fa' },
  terminate: { label: '终止', type: 'danger', color: '#ee0a24' },
  withdraw: { label: '撤销', type: 'warning', color: '#ff976a' },
  recall: { label: '撤回', type: 'warning', color: '#ff976a' },
  reject: { label: '驳回', type: 'danger', color: '#ee0a24' },
  deleted: { label: '删除', type: 'danger', color: '#ee0a24' }
};

const isDone = computed(() => props.type === 2);
</script>

<style scoped>
.wkf-card {
  border-radius: 12px;
  overflow: hidden;
}

.cell {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
}

.label {
  width: 72px;
  color: #999;
}

.footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
