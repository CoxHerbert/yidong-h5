<template>
  <div v-if="open" class="popup-mask" @click="close">
    <div class="popup-box" @click.stop>
      <div class="popup-header">
        <span class="popup-title">活动介绍</span>
        <span class="popup-close" @click="close">×</span>
      </div>
      <div class="popup-body">
        <div class="popup-content-line">一、产品信息</div>
        <div class="popup-content-line">1、产品名称：橙翼包19.9元权益合约；</div>
        <div class="popup-content-line">2、产品资费：19.9元/月；</div>
        <div class="popup-content-line">
          3、产品内容：用户办理此合约升级为5G用户,每月获得5GB全国通用流量，办理合约成为中国电信plus会员用户，享受以下特权：
        </div>

        <div class="popup-content-line">
          ①会员特权：每月可享受会员特权（爱奇艺、优酷、腾讯、芒果TV、酷狗音乐、QQ绿钻豪华版、网易云音乐VIP会员月卡、喜马拉雅巅峰会员月卡、高德打车10元券、WPS普通会员月卡、作业帮会员月卡、翼支付5元通用券*3（无话费场景）N选1）;
        </div>
        <div class="popup-content-line">
          ②本地特权：每月可领取美团外卖5元代金券*2、肯德基新奥尔良烤翅抵扣券、肯德基允指原味鸡抵用券、饿了么5元红包券*2、滴滴出行快车5元券*2，N选1；
        </div>
        <div class="popup-content-line">③5G特权：流量优惠券，每月可领取5GBplus会员专属流量包。</div>
        <div class="popup-content-line">二、规则描述</div>
        <div class="popup-content-line">
          1、产品有效期：12个自然月，到期如用户不退订，则自动续订；
        </div>
        <div class="popup-content-line">
          2、订购规则：订购立即生效，5G流量全额提供，当月功能费全额计扣，不折算，不允许变更；
        </div>
        <div class="popup-content-line">3、重复订购规则：有效期内不允许重复订购；</div>
        <div class="popup-content-line">
          4、退订规则：允许退订，退订次月生效。退订渠道：线下中国电信营业厅、10000号及95106均可办理。
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
