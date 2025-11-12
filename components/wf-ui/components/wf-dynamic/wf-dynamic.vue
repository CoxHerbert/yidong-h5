<template>
  <div class="wf-dynamic">
    <div v-if="!items.length && !canAdd" class="wf-dynamic__empty">
      <van-empty description="暂无明细" />
    </div>
    <div v-for="(row, index) in items" :key="index" class="wf-dynamic__item">
      <div class="wf-dynamic__item-header">
        <span class="wf-dynamic__item-title">{{ renderTitle(index) }}</span>
        <van-button
          v-if="canRemove"
          size="mini"
          type="danger"
          :disabled="disabled"
          @click="remove(index)"
        >
          {{ removeText }}
        </van-button>
      </div>
      <WfForm
        :model-value="row"
        :option="resolveChildOption(index)"
        @update:model-value="updateRow(index, $event)"
        @label-change="forwardLabelChange(index, $event)"
      />
    </div>
    <div v-if="!items.length && canAdd" class="wf-dynamic__empty">
      <van-empty description="暂无明细" />
    </div>
    <van-button
      v-if="canAdd"
      class="wf-dynamic__add"
      plain
      type="primary"
      size="small"
      :disabled="disabled"
      @click="add"
    >
      {{ addText }}
    </van-button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import WfForm from '../wf-form/wf-form.vue';
import { deepClone } from '../../util/index.js';

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  column: { type: Object, required: true },
  disabled: Boolean,
  dic: { type: Array, default: () => [] },
  dynamicIndex: Number,
});

const emit = defineEmits(['update:modelValue', 'change', 'label-change']);

const items = ref<Record<string, any>[]>([]);

watch(
  () => props.modelValue,
  (val) => {
    if (Array.isArray(val)) {
      items.value = deepClone(val);
    } else if (val === null || val === undefined) {
      items.value = [];
    } else {
      items.value = deepClone([val]);
    }
  },
  { immediate: true, deep: true }
);

watch(
  items,
  (val) => {
    emit('update:modelValue', deepClone(val));
    emit('change', deepClone(val));
  },
  { deep: true }
);

const childColumns = computed(() => props.column?.children?.column || []);

const addText = computed(() => props.column?.children?.addBtnText || '新增');
const removeText = computed(() => props.column?.children?.delBtnText || '移除');
const canAdd = computed(() => props.column?.children?.addBtn !== false && !props.disabled && !props.column?.detail);
const canRemove = computed(() => props.column?.children?.delBtn !== false && !props.disabled && !props.column?.detail);

function createEmptyRow() {
  const row = {} as Record<string, any>;
  childColumns.value.forEach((column) => {
    if (!column?.prop) return;
    if (column.value !== undefined) {
      row[column.prop] = deepClone(column.value);
    } else {
      row[column.prop] = undefined;
    }
  });
  return row;
}

function resolveChildOption(index: number) {
  const option = deepClone(props.column?.children || {});
  option.column = childColumns.value.map((col) => ({ ...col }));
  option.menuBtn = false;
  option.submitBtn = false;
  option.detail = props.column?.detail || props.disabled;
  option.readonly = props.column?.readonly || props.disabled;
  option.disabled = props.column?.disabled || props.disabled;
  option.dynamicIndex = index;
  option.labelPosition = option.labelPosition || 'top';
  return option;
}

function updateRow(index: number, value: Record<string, any>) {
  const list = deepClone(items.value);
  list[index] = deepClone(value);
  items.value = list;
}

function forwardLabelChange(index: number, payload: { prop: string; value: any }) {
  emit('label-change', { index, ...payload });
}

function add() {
  const list = deepClone(items.value);
  list.push(createEmptyRow());
  items.value = list;
}

function remove(index: number) {
  const list = deepClone(items.value);
  list.splice(index, 1);
  items.value = list;
}

function renderTitle(index: number) {
  const baseTitle = props.column?.children?.title || props.column?.label || '子表单';
  return `${baseTitle} ${index + 1}`;
}
</script>

<style scoped>
.wf-dynamic {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wf-dynamic__item {
  padding: 12px;
  border: 1px solid #ebedf0;
  border-radius: 8px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wf-dynamic__item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wf-dynamic__item-title {
  font-weight: 600;
  color: #323233;
}

.wf-dynamic__add {
  align-self: flex-start;
}

.wf-dynamic__empty {
  display: flex;
  justify-content: center;
  padding: 16px 0;
  background-color: #ffffff;
  border-radius: 8px;
}
</style>
