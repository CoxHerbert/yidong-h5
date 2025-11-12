<template>
  <van-uploader
    v-model:file-list="fileList"
    :max-count="column.limit || 3"
    :disabled="disabled"
    :after-read="handleAfterRead"
    :max-size="column.maxSize"
    :preview-image="column.preview !== false"
    :multiple="column.multiple === true"
    @delete="handleDelete"
  />
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  column: { type: Object, default: () => ({}) },
  disabled: Boolean,
});

const emit = defineEmits(['update:modelValue', 'change']);

const fileList = ref([]);

watch(
  () => props.modelValue,
  (val) => {
    fileList.value = Array.isArray(val) ? [...val] : [];
  },
  { immediate: true, deep: true }
);

function sync(list) {
  emit('update:modelValue', list);
  emit('change', list);
}

function handleAfterRead(item) {
  const files = Array.isArray(item) ? item : [item];
  const next = [...fileList.value];
  files.forEach((file) => {
    next.push({ url: file.content || file.url, file });
  });
  sync(next);
}

function handleDelete({ index }) {
  const next = [...fileList.value];
  next.splice(index, 1);
  sync(next);
}
</script>
