<template>
  <div v-if="open" class="popup-mask" @click="close">
    <div class="popup-box" @click.stop>
      <div class="popup-header">
        <span class="popup-title">《解约条款》</span>
        <span class="popup-close" @click="close">×</span>
      </div>
      <div class="popup-body">
        <div class="popup-content-line">甲方：中国移动通信客户</div>
        <div class="popup-content-line">乙方：中国移动通信集团广东有限公司</div>
        <div class="popup-content-line">
          甲方业务协议解约按类型分为“直接解约”和“有条件解约”两大场景。
        </div>
        <div class="popup-content-line">
          一、直接解约
          主要是涉及甲方直接订购的业务，乙方未进行任何优惠或补贴，甲方也未得从乙方得到实物或权益等相关的业务，采用无条件直接解约。
        </div>
        <div class="popup-content-line">
          二、有条件解约 1.合约业务
          如涉及赠送终端、话费存送、设备租赁或承诺在网或承诺消费获得相应优惠等业务，一般不能直接解约，甲方在“完成优惠赔付、不影响二次销售的退货”等情况下，有条件解约，按解约标准和流程操作（如有事先签订赔付标准，按约定的赔付标准执行）。具体如下：
        </div>
        <div class="popup-content-line">
          （1）资金优惠：如话费存送、套餐折扣等。解约条件：根据优惠、减免情况支付违约金。赔付标准：甲方如提前终止协议，则甲方需将已履行月份获赠金额或优惠减免金额总额、以及未履行月份所有低消或套餐金额总额的一定比例（法律规定范围内）进行赔付。
        </div>
        <div class="popup-content-line">
          （2）业务赠送：如承诺消费送流量包、语音包、短信包等。解约条件：根据已赠送业务价值，支付合理的违约金。赔付标准：甲方如要求提前终止协议，则甲方需将已获赠业务进行价值折算进行赔付。非流量类（语音、短信等）按单价标准资费折算，流量类按实际单价优惠资费折算。
        </div>
        <div class="popup-content-line">
          （3）宽带业务：如网龄送宽带，承诺低消送宽带。解约条件：提前终止宽带业务需对初装费或拆机费进行赔付。赔付标准：甲方如要求提前终止协议，需根据前期活动约定的初装费用或拆机费用进行赔付。
        </div>
        <div class="popup-content-line">
          （4）实物赠送：如承诺消费送终端、充值卡等。解约条件：在不影响二次销售的前提下，退还赠送的实物；在无法退还实物的情况下，通过对实物进行折现，支付违约金。赔付标准：根据退货要求且不影响二次销售的前提下，可在完成赠送实物退货后解约；如赠送实物已不满足退货条件，则甲方需根据实物赠送价值及未履行承诺期限进行补偿。
        </div>
        <div class="popup-content-line">
          （5）权益赠送：如咪咕视频、爱奇艺、优酷会员权益等。解约条件：需根据活动约定退回方可解约，不能退回需按价值折算进行补偿（权益赠送协议签订中应明确约定赠送权益的价值或折算方法）。赔付标准：权益未使用可在完成赠送权益回退后解约；权益已领取、使用，则甲方需将已使用权益进行价值折算，赔偿后解约。
        </div>
        <div class="popup-content-line">
          （6）实物租赁：如家庭宽带机顶盒、光猫等。解约条件：确保设备完好的情况下，返还租赁物；如无法归还或涉及其他利益损失的，可通过折现，支付合理违约金。赔付标准：甲方如要求提前终止协议，需根据活动约定条件退回或赔偿租赁物，根据退货约定且不影响二次销售的前提下，可在完成租赁实物退回后解约（注，如租赁物非新：在确保设备完好的情况下，可在完成租赁物退货后解约）；如租赁物已不满足再次租赁条件（设备已无法正常使用），则甲方需根据租赁设备价值进行等价偿还。
          2.融合业务
          融合套餐、主副卡、统付、共享、家庭网、集团网、惠农网、双向亲情互打等业务，需在不影响其他甲方业务使用的情况下，根据具体情况进行退订或解除。
          类别 场景 解约条件 举例 融合业务 统付业务、主副卡等 取消统付关系、解除相关成员
          家庭统付、家庭网、集团网等 共享业务 解除共享关系 流量、语音共享等 V网 解除V网成员关联关系
          家庭网、集团网、惠农网、双向亲情互打等 注：①主卡、共享者解除，应对其他成员尽到通知义务。
          ②副卡、被共享者解除，不应对其他成员权益造成损失。 3.吉祥号码业务
          如四连号、三连号等吉祥号码。解约条件：按吉祥号码低消和未履行协议期进行赔付。赔付标准：如甲方要求提前终止协议，则甲方应当按照未履行月份所有低消或套餐金额总额向乙方支付损失赔偿金，如甲方有签约减免或降档低消金额特殊情况的，采用前述同样标准执行。（参考最新吉祥号码等级对应的低消或套餐标准）。
          4.集团信息化业务
          解约条件：根据乙方投入成本补贴和未履行时间等进行价值折算赔付（协议签订中应明确约定相关业务价值或折算方法）。
          赔付标准：具体赔付标准按签订的协议条款折算。
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
