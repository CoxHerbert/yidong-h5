<template>
  <div class="wf-input">
    <van-field
      v-model="fieldValue"
      :type="fieldType"
      :maxlength="column.maxlength ?? 350"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="column.readonly"
      :formatter="column.formatter"
      :clearable="column.clearable !== false"
      :rows="column.rows"
      :autosize="column.type === 'textarea' ? column.autosize ?? true : undefined"
      @focus="handleFocus"
      @blur="handleBlur"
      @click="handleClick"
    />
  </div>
</template>

<script>
import fieldValueMixin from '../../mixins/fieldValue.js';

const typeMap = {
  input: 'text',
  password: 'password',
  textarea: 'textarea',
  number: 'digit',
};

export default {
  name: 'WfInput',
  mixins: [fieldValueMixin],
  props: {
    modelValue: { type: [String, Number, Array, Object], default: undefined },
    column: { type: Object, required: true },
    disabled: Boolean,
    dic: { type: Array, default: () => [] },
    dynamicIndex: Number,
  },
  emits: ['update:modelValue', 'change', 'focus', 'blur', 'click', 'label-change'],
  computed: {
    fieldType() {
      return typeMap[this.column.type] || 'text';
    },
  },
  methods: {
    handleFocus(event) {
      this.focus(event);
    },
    handleBlur(event) {
      this.blur(event);
    },
    handleClick(event) {
      this.click(event);
    },
  },
};
</script>

<style scoped>
.wf-input {
  width: 100%;
}
</style>
