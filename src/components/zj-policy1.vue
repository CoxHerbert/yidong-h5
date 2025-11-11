<template>
  <div v-if="open" class="popup-mask" @click="close">
    <div class="popup-box" @click.stop>
      <div class="popup-header">
        <span class="popup-title">活动介绍</span>
        <span class="popup-close" @click="close">×</span>
      </div>
      <div class="popup-body">
        <div class="popup-content-line">1.产品名称：浙江和教育联合会员。</div>
        <div class="popup-content-line">2.产品资费：话费支付10元/月。</div>
        <div class="popup-content-line">3.产品对象：浙江移动用户。</div>
        <div class="popup-content-line">
          4.生效时间：订购后立即生效，不取消按月扣费；可随时取消，取消立即生效，当前周期内可继续享受权益，次月起不再扣费。
        </div>
        <div class="popup-content-line">
          5.产品权益：浙江和教育联合会员:是以大数据为驱动的教育平台，专注K12教学领域。通过人工智能技术为老师提供学生学业分析，为学生提供AI作文、口算批改、智能个性化辅导方案等的智能化教育产品。权益二：热门会员周卡：优酷黄金会员、喜马拉雅会员、搜狐黄金会员、芒果(PC影视)会员注：若已有该平台权益，叠加规则以该平台为准。
        </div>
        <div class="popup-content-line">
          6.权益领取：权益一：浙江和教育联合会员：订购成功后，可前往关注浙江和教育微信公众号查看使用或前往品兑兑微信公众号-小舟易学-我要学习进行使用。权益二：热门会员周卡兑换：进入“品兑兑”微信公众号点击右下角浙江和教育联合会员领取会员页面选择要兑换的会员，输入订购号码回复验证码兑换领取，兑换成功后会收到平台的兑换成功通知。
        </div>
        <div class="popup-content-line">
          7.办理须知：订购业务前请仔细阅读活动规则，订购本业务，即视为同意接受本业务及其相关活动的所有条款或规则。
        </div>
        <div class="popup-content-line">
          8.热门会员权益需用户月底前领取，用户需至指定领取入口领取权益，按自然月可领取一次权益。会员有效期7天，从领取当天开始计算。如当月权益未领取，次月无法补领。
        </div>
        <div class="popup-content-line">9.退订方式：致电客服热线4006693300协助退订。</div>
        <div class="popup-content-line">
          10.客服咨询：客服热线：4006693300，客服工作时间：周一到周日8:00-21:00，节假日无休。
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
