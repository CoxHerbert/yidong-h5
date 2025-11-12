<template>
  <van-stepper
    v-model="fieldValue"
    :min="column.min ?? 0"
    :max="column.max ?? Infinity"
    :step="column.step ?? 1"
    :disabled="disabled"
    :integer="column.integer !== false"
  />
</template>

<script>
export default {
  name: 'WfNumber',
  props: {
    modelValue: { type: [Number, String], default: 0 },
    column: { type: Object, default: () => ({}) },
    disabled: Boolean,
  },
  emits: ['update:modelValue', 'change'],
  computed: {
    fieldValue: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
        this.$emit('change', val);
      },
    },
  },
};
</script>
