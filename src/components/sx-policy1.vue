<template>
  <div v-if="open" class="popup-mask" @click="close">
    <div class="popup-box" @click.stop>
      <div class="popup-header">
        <span class="popup-title">活动介绍</span>
        <span class="popup-close" @click="close">×</span>
      </div>
      <div class="popup-body">
        <div class="popup-content-line">1、业务名称：素质教育课程-D。</div>
        <div class="popup-content-line">2、业务月费：20元/月。</div>
        <div class="popup-content-line">3、内含资源：</div>
        <div class="popup-content-line">
          包含素质教育课程-D（对学生在写作文过程中容易忽视的问题进行重点解读，加强阅读训练和写作训练，把知识点的梳理贯穿在整个作文教学环节中。依据学生的实际状况，有层次地培养学生在写作过程中的想象能力、思辨能力、批判能力）。
        </div>
        <div class="popup-content-line">4、内含权益：</div>
        <div class="popup-content-line">
          爆款会员卡：洪恩十万问月卡、洪恩思维月卡、洪恩双语绘本月卡、有道词典月卡、作业帮月卡、wps超级会员月卡、喜马拉雅儿童月卡、百度文库月卡、知乎盐选月卡、得到电子书月卡，每月可选其中一个。
        </div>
        <div class="popup-content-line">5、权益使用方式：</div>
        <div class="popup-content-line">
          (1)课程使用路径：下载“山西和教育”APP，可以查看和使用课程。
        </div>
        <div class="popup-content-line">
          (2)会员权益兑换方式：关注并进入“移通福市”进入福利兑换中心选择您需要的会员权益-点击“立即兑换”-输入手机验证码后即可兑换成功，可前往权益所在平台激活使用。
        </div>
        <div class="popup-content-line">
          (3)如活动期内相关热门权益因库存不足或其他原因暂时无法换，用户可选择等待权益补货或选择其他等价值的权益兑换。给您带来的不便，敬请谅解。
        </div>
        <div class="popup-content-line">
          (4)首次订购用户随时领取，次月起，每月1日-5日为权益领取日，过期将无法领取。
        </div>
        <div class="popup-content-line">6、业务类型：连续包月业务。</div>
        <div class="popup-content-line">7、生效时间：开通后立即生效。</div>
        <div class="popup-content-line">8、限定条件：无。</div>
        <div class="popup-content-line">
          9、退订方式：如需退订，发送短信0000至10086，按提示内容退订，退订后下一个账期生效。
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
