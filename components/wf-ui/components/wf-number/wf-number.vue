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

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: { type: [Number, String], default: 0 },
  column: { type: Object, default: () => ({}) },
  disabled: Boolean,
});

const emit = defineEmits(['update:modelValue', 'change']);

const fieldValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
    emit('change', val);
  },
});
</script>
