<template>
  <van-empty :description="text" :image="icon" class="wf-empty">
    <slot />
  </van-empty>
</template>

<script setup>
const props = defineProps({
  text: { type: String, default: '暂无数据' },
  icon: { type: String, default: 'default' },
});
</script>

<style scoped>
.wf-empty {
  padding: 24px 0;
}
</style>
