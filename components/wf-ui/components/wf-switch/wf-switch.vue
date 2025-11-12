<template>
  <van-switch
    v-model="fieldValue"
    :disabled="disabled"
    :size="column.size || 20"
    :inactive-value="column.inactiveValue ?? false"
    :active-value="column.activeValue ?? true"
  />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: { type: [Boolean, String, Number], default: undefined },
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
