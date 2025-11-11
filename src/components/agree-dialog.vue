<template>
  <div v-if="showDialog" class="dialog-mask">
    <div class="dialog-box">
      <div class="dialog-content">您是否同意《个人信息收集证明》</div>
      <div class="dialog-footer">
        <div class="btn cancel" @click="showDialog = false">取消</div>
        <div class="btn confirm" @click="handleAgree">同意</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['agree'])
const showDialog = ref(false)

const handleAgree = async () => {
  emit('agree')
  showDialog.value = false
}

const openDialog = () => {
  showDialog.value = true
}

defineExpose({
  openDialog,
})
</script>

<style scoped>
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.dialog-box {
  width: 280px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  text-align: center;
}

.dialog-content {
  font-size: 14px;
  color: #333;
  padding: 20px 20px 20px;
  line-height: 1.5;
}

.dialog-footer {
  display: flex;
  border-top: 1px solid #eee;
}

.btn {
  flex: 1;
  padding: 12px 0;
  font-size: 15px;
  cursor: pointer;
}

.cancel {
  color: #f56c6c;
  border-right: 1px solid #eee;
}

.confirm {
  color: #409eff;
}
</style>
