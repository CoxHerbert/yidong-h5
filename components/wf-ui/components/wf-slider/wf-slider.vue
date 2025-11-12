<template>
  <van-slider
    v-model="fieldValue"
    :min="column.min ?? 0"
    :max="column.max ?? 100"
    :step="column.step ?? 1"
    :disabled="disabled"
    :range="column.range === true"
    :bar-height="column.barHeight"
    :button-size="column.buttonSize"
  />
</template>

<script>
export default {
  name: 'WfSlider',
  props: {
    modelValue: { type: [Number, Array], default: 0 },
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
