<template>
  <div v-if="open" class="popup-mask" @click="close">
    <div class="popup-box" @click.stop>
      <div class="popup-header">
        <span class="popup-title">产品介绍</span>
        <span class="popup-close" @click="close">×</span>
      </div>
      <div class="popup-body">
        <div class="popup-content-line">一、权益说明</div>
        <div class="popup-content-line">
          每月可享：(1)价值25元云闪付电费券包。电费券包可在云闪付APP缴费时使用，使用规则请见使用页面显示。(2)5GB湖北归属地流量每月自动下发。归属地流量限在湖北归属地使用，
          <span style="color: rgb(255, 0, 0)"
            >不可结转、不可共享、不可转赠、不可核减办理前已超出流量。</span
          >
        </div>
        <div class="popup-content-line">二、订购规则</div>
        <div class="popup-content-line">
          订购成功后立即生效，默认连续订购12个月，12个月到期自动取消。12个月内可以随时退订，无赔付。退订可通过中国移动APP、拨打10086热线或到营业厅退订，退订次月生效。
        </div>
        <div class="popup-content-line">三、互斥规则</div>
        <div class="popup-content-line" style="color: rgb(255, 0, 0)">
          已订购原湖北电费联合会员（流量版）、湖北电费联合会员（云盘版）及相关活动的用户无法订购本产品，如需订购，请先退订原产品再重新订购。
        </div>
        <div class="popup-content-line">四、使用规则</div>
        <div class="popup-content-line">
          1、用户订购后，将向订购手机号所绑定的云闪付APP账号下发权益，首次注册并使用云闪付APP的用户，直接使用办理的号码注册云闪付，权益24小时内到账，次月月初72小时内自动下发权益；
        </div>
        <div class="popup-content-line">
          2、请使用会员手机号码登录云闪付APP，先点首页右上角，点击“我的奖励-我的票券”查看权益。票券可在网上国网APP缴纳电费，使用云闪付支付通道支付满卡券面额+0.01元可抵扣；或在云闪付APP中搜索“网上国网”小程序，缴费额满卡券面额+0.01元时自动抵扣。
        </div>
        <div class="popup-content-line">
          3、云闪付APP账号注册/绑定/使用过程中，仅支持一证一号（身份证/手机号卡），如同一用户有多个移动手机号，请务必在订购前确认是否重复订购，避免因无法注册云闪付导致票券无法核销的现象（符合同一设备、同一注册手机号、同一银行卡预留手机号、同一银行实体卡号、同一身份证号或者同一APP账号等任一条件的，均视为同一用户。用户需使用本人的电子设备、银行卡等亲自参加）；
        </div>
        <div class="popup-content-line">
          4、使用本权益时，需要GPS定位（2024年4月29日起新发券支持在外省给湖北户号缴费，手机GPS功能打开状态，云闪付APP定位权限打开：一般在手机设置——应用管理————云闪付中设置）在湖北省内地市（云闪付APP首页左上角选择）；
        </div>
        <div class="popup-content-line">
          5、权益有效期为到账后30天内（工作日和双休日均可使用），自权益发放当日起至第30天的23：59：59失效（包含发放当日，如1月1日发券，有效期至1月30日23时59分59秒）；
          <span style="color: rgb(255, 0, 0)">逾期未使用将自动失效，不予补发</span>
          ，具体使用时间可在云闪付端内查询。
        </div>
        <div class="popup-content-line">
          资费说明：<span style="color: rgb(255, 0, 0)">22元/月</span>
        </div>
        <div class="popup-content-line">温馨提示</div>
        <div class="popup-content-line">办理本产品后，即视为您已阅读并知晓和同意以下内容。</div>
        <div class="popup-content-line">为了您更好地使用本产品，请您务必仔细阅读：</div>
        <div class="popup-content-line">
          1、权益到账后，当月无法退换。云闪付APP电费缴费权益仅限办理手机号码所注册的云闪付账号使用，不得转赠他人。关于云闪付电费券使用问题可咨询95516。
        </div>
        <div class="popup-content-line">
          2、订购条件：支持中国移动在网实名制客户订购；非实名制用户、欠费用户、当月话费余额不足抵扣产品资费的用户将无法订购本产品。
        </div>
        <div class="popup-content-line">
          3、注意事项：在产品有效期内订购号码需保持正常在网使用，否则可能导致无法领取权益或无法使用部分或全部服务。若在产品有效期内办理销户或携号转网业务，需先退订终止本业务。
        </div>
        <div class="popup-content-line">
          4、因权益方内部调整，我们可能会变更、终止与权益方的合作，您可能无法继续通过湖北移动接受该权益方提供的产品，同时公司将会及时公告或告知。如因此导致您无法使用或购买产品的，请您理解我们无需对此承担责任。可能给您带来的不便，敬请谅解。
        </div>
        <div class="popup-content-line">
          5、湖北移动可能会根据本服务的整体规划，对本服务相关权益细则收费标准、权益发放方式等进行修改和变更，前述修改、变更的内容，湖北移动将在相应服务页面或以其他合理方式进行告知，并在告知后生效。当您采用接受服务的形式（包括但不限于支付行为、未退定继续使用本服务等），即表明您已经接受本服务的全部修改。
        </div>
        <div class="popup-content-line">6、其他未尽事宜，详询10086或4000573752。</div>
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
