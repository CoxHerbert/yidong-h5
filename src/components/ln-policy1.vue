<template>
  <div v-if="open" class="popup-mask" @click="close">
    <div class="popup-box" @click.stop>
      <div class="popup-header">
        <span class="popup-title">活动介绍</span>
        <span class="popup-close" @click="close">×</span>
      </div>
      <div class="popup-body">
        <div class="popup-content-line">【客户范围】</div>
        <div class="popup-content-line">辽宁移动客户</div>
        <div class="popup-content-line">【产品规则】</div>
        <div class="popup-content-line">
          ①19.9元/月，包含车主权益(1次免费洗车/20元加油券/20元充电券/20元停车券)4选1、15GB融合定向流量(不含港澳台)、多款车主类优惠券(具体权益内容及使用以领取页面展示为准)、办理即成为权益超市黄金会员享受黄金会员升级体验版服务。可享限时优惠：办理前3个月每月车主权益可享4选2，第4个月起恢复每月车主权益4选1。办理立即生效，按月自动续订与扣费，退订次月失效。退订可编辑短信“TD60235”到10086。
        </div>
        <div class="popup-content-line">
          ②7天无理由：办理后7天内如反悔可编辑短信"TD60235"到10086进行业务退订。
        </div>
        <div class="popup-content-line" style="color: rgb(255, 192, 0)">
          ③不支持叠加办理，与随心行系列会员不支持同时办理。
        </div>
        <div class="popup-content-line">④随心行会员权益领取入口：</div>
        <div class="popup-content-line">
          a：登录中国移动APP点击右下方"我的”-点击“我的权益"-选择“随心行会员”领取。
        </div>
        <div class="popup-content-line">
          b：关注"辽宁移动权益超市"公众号，回复关键字“随心行点击会员专属页面领取。
        </div>
        <div class="popup-content-line">
          ⑤15GB热门视频APP定向流量使用范围：可通过<a href="https://dx.10086.cn/CXlmDA"
            >https://dx.10086.cn/CXlmDA</a
          >
          链接了解使用范围。
        </div>
        <div class="popup-content-line">⑥权益超市黄金会员及黄金会员升级体验版服务领取入口：</div>
        <div class="popup-content-line">
          登录中国移动APP点击右下方"我的”-点击"我的权益"-通过会员权益”领取。还可关注“辽宁移动权益超市"公众号，回复关键字"领”点击"超市会员”-“黄金会员升级版"专属页面可叠加领取。
        </div>
        <div class="popup-content-line" style="color: rgb(255, 192, 0)">
          ⑦客户可按月自主领取当期权益，过期不支持补领、补发。具体权益内容以领取页面为准。
        </div>
        <div class="popup-content-line" style="color: rgb(255, 192, 0)">
          ⑧业务使用期间，须保持中国移动网络。
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
  max-height: 60vh;
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
