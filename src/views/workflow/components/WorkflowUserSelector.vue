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

<script>
export default {
  name: 'WorkflowUserSelector',
  props: {
    modelValue: { type: Boolean, default: false },
    type: { type: String, default: '' },
    checkType: { type: String, default: 'radio' },
    defaultChecked: { type: [String, Array], default: null },
  },
  emits: ['update:modelValue', 'confirm', 'cancel'],
  data() {
    return {
      form: {
        id: '',
        name: '',
      },
    };
  },
  computed: {
    visible: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      },
    },
    title() {
      switch (this.type) {
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
    },
  },
  watch: {
    defaultChecked: {
      immediate: true,
      handler(value) {
        if (Array.isArray(value)) {
          const text = value.join(',');
          this.form.id = text;
          this.form.name = text;
        } else if (typeof value === 'string') {
          this.form.id = value;
          this.form.name = value;
        } else {
          this.form.id = '';
          this.form.name = '';
        }
      },
    },
  },
  methods: {
    handleConfirm() {
      const parse = (input) =>
        this.checkType === 'checkbox'
          ? input
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
          : input.trim();
      const idValue = parse(this.form.id);
      const nameValue = parse(this.form.name);
      this.$emit('confirm', { id: idValue, name: nameValue });
      this.visible = false;
    },
    handleCancel() {
      this.$emit('cancel');
      this.visible = false;
    },
  },
};
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
