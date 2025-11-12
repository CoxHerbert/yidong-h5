<template>
  <div v-if="process" class="workflow-actions" data-testid="workflow-actions">
    <div v-if="process.status === 'todo'" class="workflow-actions__primary">
      <van-button
        v-if="getButton('wf_pass')"
        type="primary"
        block
        :loading="loading"
        data-testid="action-pass"
        @click="$emit('examine', true)"
      >
        {{
          process.processIsFinished === 'recall' || process.processIsFinished === 'reject'
            ? '重新提交'
            : getButton('wf_pass').name
        }}
      </van-button>
      <van-button
        v-if="getButton('wf_reject')"
        type="danger"
        plain
        block
        :loading="loading"
        data-testid="action-reject"
        @click="$emit('examine', false)"
      >
        {{ nodeList.length > 1 ? getButton('wf_reject').name : '取消申请' }}
      </van-button>
    </div>
    <div v-if="process.status === 'todo' && moreOptions.length" class="workflow-actions__more">
      <van-dropdown-menu data-testid="action-more">
        <van-dropdown-item
          v-model="selectedAction"
          :options="moreOptions"
          placeholder="更多操作"
          @change="handleMoreAction"
        />
      </van-dropdown-menu>
    </div>
    <div v-if="process.status === 'done' && process.isOwner && process.isReturnable" class="workflow-actions__primary">
      <van-button
        type="warning"
        plain
        block
        :loading="loading"
        data-testid="action-withdraw"
        @click="confirmWithdraw('start')"
      >撤回</van-button>
      <van-button
        type="danger"
        block
        :loading="loading"
        data-testid="action-terminate"
        @click="confirmWithdraw('end')"
      >撤销</van-button>
    </div>

    <van-action-sheet
      v-model:show="rollbackSheetVisible"
      :actions="nodeList"
      cancel-text="取消"
      close-on-click-action
      description="选择要退回到的节点"
      data-testid="action-rollback-sheet"
      @select="handleNodeSelect"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { showConfirmDialog, showToast } from 'vant';

import { useWorkflowStore } from '@/stores/workflow';

const props = defineProps({
  loading: { type: Boolean, default: false },
  buttonList: { type: Array, default: () => [] },
  process: { type: Object, default: null },
  comment: { type: String, default: '' },
});

const emit = defineEmits(['examine', 'user-select', 'draft', 'rollback', 'terminate', 'withdraw']);

const workflowStore = useWorkflowStore();
const nodeList = ref([]);
const rollbackSheetVisible = ref(false);
const selectedAction = ref('');

const buttonMap = computed(() => Object.fromEntries((props.buttonList || []).map((btn) => [btn.buttonKey, btn])));

const moreOptions = computed(() => {
  const options = [];
  if (getButton('wf_transfer')) options.push({ text: getButton('wf_transfer').name || '转办', value: 'transfer' });
  if (getButton('wf_delegate')) options.push({ text: getButton('wf_delegate').name || '委托', value: 'delegate' });
  if (getButton('wf_rollback')) options.push({ text: getButton('wf_rollback').name || '驳回', value: 'rollback' });
  if (getButton('wf_terminate')) options.push({ text: getButton('wf_terminate').name || '终止', value: 'terminate' });
  if (props.process?.isMultiInstance && getButton('wf_add_instance')) {
    options.push({ text: getButton('wf_add_instance').name || '加签', value: 'addInstance' });
  }
  options.push({ text: '暂存', value: 'draft' });
  return options;
});

function getButton(key) {
  return buttonMap.value[key];
}

watch(
  () => props.process?.taskId,
  async (taskId) => {
    if (!taskId) {
      nodeList.value = [];
      return;
    }
    try {
      const response = await workflowStore.fetchBackNodes({ taskId });
      const list = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      nodeList.value = list.map((item) => ({ name: item.nodeName, nodeId: item.nodeId }));
    } catch (error) {
      console.warn('[workflow] fetch back nodes failed', error);
      nodeList.value = [];
    }
  },
  { immediate: true }
);

function handleMoreAction(action) {
  selectedAction.value = '';
  switch (action) {
    case 'transfer':
    case 'delegate':
    case 'addInstance':
      if (!props.comment && ['transfer', 'delegate'].includes(action)) {
        showToast('请填写批复意见');
        return;
      }
      emit('user-select', { type: action, checkType: action === 'addInstance' ? 'checkbox' : 'radio' });
      break;
    case 'rollback':
      if (!props.comment) {
        showToast('请填写批复意见');
        return;
      }
      rollbackSheetVisible.value = true;
      break;
    case 'terminate':
      if (!props.comment) {
        showToast('请填写批复意见');
        return;
      }
      emit('terminate');
      break;
    case 'draft':
      emit('draft');
      break;
    default:
      break;
  }
}

function handleNodeSelect(action) {
  rollbackSheetVisible.value = false;
  emit('rollback', action.nodeId);
}

function confirmWithdraw(type) {
  const content = type === 'start' ? '确定要撤回重新提交吗？若当前流程无发起人节点，效果同撤销。' : '确定要撤销此流程吗？';
  showConfirmDialog({ title: '提示', message: content })
    .then(() => emit('withdraw', `wf_withdraw_${type}`))
    .catch(() => undefined);
}
</script>

<style scoped>
.workflow-actions {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: #ffffff;
  box-shadow: 0 -6px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.workflow-actions__primary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.workflow-actions__more {
  display: flex;
  justify-content: flex-end;
}
</style>
