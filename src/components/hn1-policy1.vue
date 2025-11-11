<template>
  <div v-if="open" class="popup-mask" @click="close">
    <div class="popup-box" @click.stop>
      <div class="popup-header">
        <span class="popup-title">活动介绍</span>
        <span class="popup-close" @click="close">×</span>
      </div>
      <div class="popup-body">
        <div class="popup-content-line">订购说明</div>
        <div class="popup-content-line">1、参与限制：仅限有当前产品办理资格的用户参与。</div>
        <div class="popup-content-line">
          2、合约活动内容：参与活动时需要为您订购20元60G流量月包（电渠专属）12个月合约活动，同步开通20元60G流量月包（电渠专属），活动价20元/月，合约期12个自然月（含当月）。
        </div>
        <div class="popup-content-line">
          3、包含资源：每月含5GB国内（除港澳台地区）通用流量，每月加享55GB区域定向流量（可冲减快手、抖音、今日头条、西瓜等APP定向流量，具体免流范围以最新公告为准）。
        </div>
        <div class="popup-content-line">
          4、合约承诺及违约约定：合约期内不可降低当前套餐档次，需承诺在网并履行约定，如申请办理停机保号、销号、携号转网、终止合约等服务，请至当地移动自营厅解约后办理，解除合约按河南移动合约活动提前解约方案执行，解除合约按约定0元赔付。
        </div>
        <div class="popup-content-line">
          5、合约活动到期：合约期最后五天前不可取消，活动到期后产品将自动续订且按20元60G流量月包（电渠专属）标准价20元/月收费，含5GB/月国内（除港澳台地区）通用流量和55GB/月区域定向流量（可冲减使用的快手、抖音、今日头条、西瓜等APP定向流量，具体免流范围以最新公告为准），产品包含国内通用和定向流量均限当月使用，不可共享、结转、转赠。合约到期后，若您不需要，可根据到期短信主动退订或发送0000到10086，不退订视为继续使用。
        </div>
        <div class="popup-content-line">
          6、流量优先级：产品内包含的通用流量优先级低于主套餐套内流量，优先级同其他5G流量包产品；定向流量先于基础套餐和流量包内通用流量优先使用。
        </div>
        <div class="popup-content-line">
          7、该流量产品订购立即生效，按天按量扣费，退订立即生效。
        </div>
        <div class="popup-content-line">
          8、区域流量可在河南省内的商圈、景点、校园、生活区等地使用。
        </div>
        <div class="popup-content-line">客服电话：400-6833330</div>
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
