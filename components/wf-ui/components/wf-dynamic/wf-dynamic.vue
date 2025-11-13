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

<script>
import WfForm from '../wf-form/wf-form.vue';
import { deepClone } from '../../util/index.js';

export default {
  name: 'WfDynamic',
  components: { WfForm },
  props: {
    modelValue: { type: Array, default: () => [] },
    column: { type: Object, required: true },
    disabled: Boolean,
    dic: { type: Array, default: () => [] },
    dynamicIndex: Number,
  },
  emits: ['update:modelValue', 'change', 'label-change'],
  data() {
    return {
      items: [],
    };
  },
  computed: {
    childColumns() {
      return this.column?.children?.column || [];
    },
    addText() {
      return this.column?.children?.addBtnText || '新增';
    },
    removeText() {
      return this.column?.children?.delBtnText || '移除';
    },
    canAdd() {
      return this.column?.children?.addBtn !== false && !this.disabled && !this.column?.detail;
    },
    canRemove() {
      return this.column?.children?.delBtn !== false && !this.disabled && !this.column?.detail;
    },
  },
  watch: {
    modelValue: {
      immediate: true,
      deep: true,
      handler(val) {
        if (Array.isArray(val)) {
          this.items = deepClone(val);
        } else if (val === null || val === undefined) {
          this.items = [];
        } else {
          this.items = deepClone([val]);
        }
      },
    },
    items: {
      deep: true,
      handler(val) {
        const cloned = deepClone(val);
        this.$emit('update:modelValue', cloned);
        this.$emit('change', cloned);
      },
    },
  },
  methods: {
    createEmptyRow() {
      const row = {};
      this.childColumns.forEach((column) => {
        if (!column?.prop) return;
        if (column.value !== undefined) {
          row[column.prop] = deepClone(column.value);
        } else {
          row[column.prop] = undefined;
        }
      });
      return row;
    },
    resolveChildOption(index) {
      const option = deepClone(this.column?.children || {});
      option.column = this.childColumns.map((col) => ({ ...col }));
      option.menuBtn = false;
      option.submitBtn = false;
      option.detail = this.column?.detail || this.disabled;
      option.readonly = this.column?.readonly || this.disabled;
      option.disabled = this.column?.disabled || this.disabled;
      option.dynamicIndex = index;
      option.labelPosition = option.labelPosition || 'top';
      return option;
    },
    updateRow(index, value) {
      const list = deepClone(this.items);
      list[index] = deepClone(value);
      this.items = list;
    },
    forwardLabelChange(index, payload) {
      const detail = typeof payload === 'object' && payload !== null ? payload : { value: payload };
      this.$emit('label-change', { index, ...detail });
    },
    add() {
      const list = deepClone(this.items);
      list.push(this.createEmptyRow());
      this.items = list;
    },
    remove(index) {
      const list = deepClone(this.items);
      list.splice(index, 1);
      this.items = list;
    },
    renderTitle(index) {
      const baseTitle = this.column?.children?.title || this.column?.label || '子表单';
      return `${baseTitle} ${index + 1}`;
    },
  },
};
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
