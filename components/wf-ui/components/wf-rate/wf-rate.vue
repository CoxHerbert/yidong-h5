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

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: { type: Number, default: 0 },
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
