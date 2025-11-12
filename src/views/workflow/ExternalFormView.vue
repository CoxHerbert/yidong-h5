<template>
  <div class="workflow-external">
    <van-empty description="该表单由外部系统提供，请在原业务中处理" />
  </div>
</template>

<script>
export default {
  name: 'WorkflowExternalFormView',
};
</script>

<style scoped>
.workflow-external {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f8fa;
}
</style>
