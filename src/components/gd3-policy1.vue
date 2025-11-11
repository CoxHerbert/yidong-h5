<template>
  <div v-if="open" class="popup-mask" @click="close">
    <div class="popup-box" @click.stop>
      <div class="popup-header">
        <span class="popup-title">活动介绍</span>
        <span class="popup-close" @click="close">×</span>
      </div>
      <div class="popup-body">
        <div class="popup-content-line">一、产品名称：AI家秀</div>
        <div class="popup-content-line">二、产品资费及权益</div>
        <div class="popup-content-line">
          业务办理后，自业务办理首月开始计费15元/月，赠送1个家庭名额超出赠送名额之外的家庭成员6元/月，自动续订，话费支付。AI家秀采用家庭主用户退订则全部家庭成员均退订的方式。本产品包含20+选1热门会员月卡；享AI家秀产品使用。
        </div>
        <div class="popup-content-line">三、产品说明</div>
        <div class="popup-content-line">
          1、AI家秀订购后，用户拨号等待中可以看自主上传图片生成的视频铃音。用户可前往“AI家秀”微信小程序生成自己的专属视频。
        </div>
        <div class="popup-content-line">
          2、AI家秀是广东移动用户拨打电话时看到自己上传图片生成的视频设置的视频，或者看AI家秀提供的内容丰富的默认视频。
        </div>
        <div class="popup-content-line">四、业务规则</div>
        <div class="popup-content-line">
          1、办理对象：广东移动用户且未开通呼叫秀精选频道的用户。
        </div>
        <div class="popup-content-line">2、业务权益：</div>
        <div class="popup-content-line">
          （1）AI家秀：包含各类默认的各类的模板权益，或者用户自主上传图片生成的视频。主叫用户在手机上观看由自己设置的一段趣味视频内容。
        </div>
        <div class="popup-content-line">
          （2）搜索微信公众号“会员大合集"，领取20+个爆款会员月卡任选1，开通AI家秀当月及次月可领取，当月退订则下月不可领取。用户当月不领取，用户不可补领。若权益种类发生变化，具体可领取权益以权益领取页面为准。
        </div>
        <div class="popup-content-line">
          （3）权益领取路径：点击会员大合集公众号中的“权益领取”根据页面指引，进入会员领取专栏，选中需要领取的会员，输入手机号和验证码，点击“立即领取”即可兑换成功。用户确保输入手机号为订购成功的手机号，并且手机号准确无误，系统将24小时内自动为用户充值权益。会员有效期30天，用户领取成功后自动充值到用户订购手机号上如用户原有会员的，则在原有会员有效期上顺延。
        </div>
        <div class="popup-content-line">
          （4）设置并观看AI家秀需要手机打开VOLTE功能，且手机系统为安卓或者鸿蒙，暂不支持苹果系统播放视频铃音。
        </div>
        <div class="popup-content-line">3、如有疑问可拨打客服热线：4000602033。</div>
        <div class="popup-content-line">4、业务退订方式：</div>
        <div class="popup-content-line">（1）拨打移动客服电话10086进行退订。</div>
        <div class="popup-content-line">（2）进入AI家秀微信小程序退订。</div>
        <div class="popup-content-line">
          5、温馨提示：使用相关权益时，请遵守相应平台的用户服务协议和权益使用协议，如违反相关协议规定，运营商和联合权益提供方均有权单独进行处理，包括但不限于中止或终止提供其所属平台的服务及要求侵权赔偿等。如活动期内相关热门权益因库存不足或其他原因暂时无法兑换，用户可选择当月内延后兑换或者进行其他等价值的权益兑换给您带来的不便，敬请谅解。
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
