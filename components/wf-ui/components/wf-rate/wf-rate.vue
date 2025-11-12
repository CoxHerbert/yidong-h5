<template>
  <van-rate
    v-model="fieldValue"
    :count="column.count || 5"
    :allow-half="column.allowHalf === true"
    :size="column.size || 20"
    :color="column.color"
    :void-color="column.voidColor"
    :disabled="disabled"
  />
</template>

<script>
export default {
  name: 'WfRate',
  props: {
    modelValue: { type: Number, default: 0 },
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
