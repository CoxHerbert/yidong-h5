<template>
  <div v-if="open" class="popup-mask" @click="close">
    <div class="popup-box" @click.stop>
      <span class="popup-close" @click="close">×</span>
      <img src="../assets/4rpxjs/policy.jpg" alt="" />
    </div>
  </div>
</template>

<script setup>
import { toRefs, reactive } from 'vue'

const data = reactive({
  open: false,
})
const { open } = toRefs(data)

const openDialog = () => {
  open.value = true
}

const close = () => {
  open.value = false
}

defineExpose({
  openDialog,
})
</script>

<style scoped>
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 0 20px;
  box-sizing: border-box;
}

.popup-box {
  width: 100%;
  max-height: 60vh;
  background: #fff;
  border-radius: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
}

.popup-close {
  position: absolute;
  right: 16px;
  top: 12px;
}
</style>
