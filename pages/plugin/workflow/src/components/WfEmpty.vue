<template>
  <van-empty class="wf-empty" :image="image" :description="text" />
</template>

<script setup lang="ts">
interface Props {
  text?: string;
  image?: string;
}

withDefaults(defineProps<Props>(), {
  text: '暂无数据',
  image: 'search'
});
</script>

<style scoped>
.wf-empty {
  padding: 48px 0;
}
</style>
