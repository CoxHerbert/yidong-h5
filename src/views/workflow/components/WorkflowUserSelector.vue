<template>
  <van-popup
    v-model:show="visible"
    position="bottom"
    round
    class="workflow-user-selector"
    data-testid="workflow-user-selector"
  >
    <div class="workflow-user-selector__header">
      <div class="workflow-user-selector__title">{{ title }}</div>
      <van-icon name="cross" class="workflow-user-selector__close" @click="handleCancel" />
    </div>
    <div class="workflow-user-selector__body">
      <van-field
        v-model="form.id"
        :label="checkType === 'checkbox' ? '人员ID（逗号分隔）' : '人员ID'"
        placeholder="请输入人员ID"
      />
      <van-field
        v-model="form.name"
        :label="checkType === 'checkbox' ? '人员姓名（逗号分隔）' : '人员姓名'"
        placeholder="请输入人员姓名"
      />
    </div>
    <div class="workflow-user-selector__footer">
      <van-button block type="primary" @click="handleConfirm">确定</van-button>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  type: string;
  checkType: 'radio' | 'checkbox';
  defaultChecked: string | string[] | null;
}>();

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const visible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const form = reactive({
  id: '',
  name: '',
});

watch(
  () => props.defaultChecked,
  (value) => {
    if (Array.isArray(value)) {
      form.id = value.join(',');
      form.name = value.join(',');
    } else if (typeof value === 'string') {
      form.id = value;
      form.name = value;
    } else {
      form.id = '';
      form.name = '';
    }
  },
  { immediate: true }
);

const title = computed(() => {
  switch (props.type) {
    case 'transfer':
      return '选择转办人员';
    case 'delegate':
      return '选择委托人员';
    case 'addInstance':
      return '选择加签人员';
    case 'copy':
      return '选择抄送人员';
    case 'assignee':
      return '指定审批人';
    default:
      return '选择人员';
  }
});

function handleConfirm() {
  const idValue = props.checkType === 'checkbox' ? form.id.split(',').map((item) => item.trim()).filter(Boolean) : form.id.trim();
  const nameValue = props.checkType === 'checkbox' ? form.name.split(',').map((item) => item.trim()).filter(Boolean) : form.name.trim();
  emit('confirm', { id: idValue, name: nameValue });
  visible.value = false;
}

function handleCancel() {
  emit('cancel');
  visible.value = false;
}
</script>

<style scoped>
.workflow-user-selector {
  padding: 16px;
}

.workflow-user-selector__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.workflow-user-selector__title {
  font-size: 16px;
  font-weight: 600;
}

.workflow-user-selector__close {
  font-size: 20px;
}

.workflow-user-selector__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.workflow-user-selector__footer {
  margin-top: 20px;
}
</style>
