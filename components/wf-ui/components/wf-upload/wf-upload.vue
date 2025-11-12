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

<script>
export default {
  name: 'WfUpload',
  props: {
    modelValue: { type: Array, default: () => [] },
    column: { type: Object, default: () => ({}) },
    disabled: Boolean,
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return {
      fileList: [],
    };
  },
  watch: {
    modelValue: {
      immediate: true,
      deep: true,
      handler(val) {
        this.fileList = Array.isArray(val) ? [...val] : [];
      },
    },
  },
  methods: {
    sync(list) {
      this.$emit('update:modelValue', list);
      this.$emit('change', list);
    },
    handleAfterRead(item) {
      const files = Array.isArray(item) ? item : [item];
      const next = [...this.fileList];
      files.forEach((file) => {
        next.push({ url: file.content || file.url, file });
      });
      this.sync(next);
    },
    handleDelete({ index }) {
      const next = [...this.fileList];
      next.splice(index, 1);
      this.sync(next);
    },
  },
};
</script>
