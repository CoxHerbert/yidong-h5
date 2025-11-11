<template>
  <div v-if="open" class="popup-mask" @click="close">
    <div class="popup-box" @click.stop>
      <div class="popup-header">
        <span class="popup-title">《业务受理单》</span>
        <span class="popup-close" @click="close">×</span>
      </div>
      <div class="popup-body">
        <div class="popup-content-line">
          《咪咕短剧时尚精品会员》 产品名称：咪咕短剧时尚精品会员
        </div>
        <div class="popup-content-line">业务推广时间：即日起-2025年12月31日</div>
        <div class="popup-content-line">产品资费：15元/月，连续包月</div>
        <div class="popup-content-line">
          生效规则：不限办理次数，订购后立即生效并连续按月收费，如不使用请登录“中国移动"APP（路径:我的-已订业务）取消业务，取消当月底失效
        </div>
      </div>
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
  height: 60vh;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.popup-header {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  font-size: 18px;
}

.popup-title {
  padding-left: 18px;
  flex: 1;
  display: flex;
  justify-content: center;
}

.popup-body {
  padding: 0 16px 16px;
  overflow-y: auto;
}
.popup-content-line {
  font-size: 14px;
  padding: 11px 0;
}
</style>
