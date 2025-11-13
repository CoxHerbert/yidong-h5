<template>
  <van-switch
    v-model="fieldValue"
    :disabled="disabled"
    :size="column.size || 20"
    :inactive-value="column.inactiveValue ?? false"
    :active-value="column.activeValue ?? true"
  />
</template>

<script>
export default {
  name: 'WfSwitch',
  props: {
    modelValue: { type: [Boolean, String, Number], default: undefined },
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
