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

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: { type: [Number, Array], default: 0 },
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
