<template>
  <div class="page">
    <img class="banner" src="../assets/g9uj5j/banner.png" alt="" />
    <van-field
      v-model="phone"
      type="tel"
      maxlength="11"
      class="input"
      placeholder="请输入您的手机号码"
    />
    <div class="input flex">
      <van-field v-model="code" type="digit" class="code-input" placeholder="请输入短信验证码" />
      <van-button class="code-btn" round :disabled="disabled" @click="getCode">
        {{ codeText }}
      </van-button>
    </div>
    <img class="btn" src="../assets/g9uj5j/btn.gif" alt="" @click="submit" />
    <div class="flex-col">
      <div class="tel">
        客服热线：
        <a href="tel:4000602033">4000602033</a>
      </div>
      <div class="agree-row">
        <van-checkbox v-model="agree" class="circle-checkbox"> 我已阅读并同意</van-checkbox>
        <span @click="openPrivacy1">《产品介绍》</span>
        和
        <span @click="openPrivacy2">《隐私条款》</span>
      </div>
      <div class="price">资费：15元/月</div>
    </div>
    <img class="desc-img" src="../assets/g9uj5j/img1.png" alt="" />
    <div class="rule">
      <div class="title">活动规则</div>
      <span>一、产品名称：AI家秀</span><br />
      <span>二、产品资费及权益</span><br />
      <span
        >业务办理后，自业务办理首月开始计费15元/月，赠送1个家庭名额超出赠送名额之外的家庭成员6元/月，自动续订，话费支付。AI家秀采用家庭主用户退订则全部家庭成员均退订的方式。本产品包含20+选1热门会员月卡；享AI家秀产品使用。</span
      ><br />
      <span> 三、产品说明</span><br />
      <span>
        1、AI家秀订购后，用户拨号等待中可以看自主上传图片生成的视频铃音。用户可前往“AI家秀”微信小程序生成自己的专属视频。</span
      ><br />
      <span>
        2、AI家秀是广东移动用户拨打电话时看到自己上传图片生成的视频设置的视频，或者看AI家秀提供的内容丰富的默认视频。 </span
      ><br />
      <span>四、业务规则</span><br />
      <span> 1、办理对象：广东移动用户且未开通呼叫秀精选频道的用户。</span><br />
      <span> 2、业务权益： </span><br />
      <span>
        （1）AI家秀：包含各类默认的各类的模板权益，或者用户自主上传图片生成的视频。主叫用户在手机上观看由自己设置的一段趣味视频内容。</span
      ><br />
      <span>
        （2）搜索微信公众号“会员大合集"，领取20+个爆款会员月卡任选1，开通AI家秀当月及次月可领取，当月退订则下月不可领取。用户当月不领取，用户不可补领。若权益种类发生变化，具体可领取权益以权益领取页面为准。</span
      ><br />
      <span>
        （3）权益领取路径：点击会员大合集公众号中的“权益领取”根据页面指引，进入会员领取专栏，选中需要领取的会员，输入手机号和验证码，点击“立即领取”即可兑换成功。用户确保输入手机号为订购成功的手机号，并且手机号准确无误，系统将24小时内自动为用户充值权益。会员有效期30天，用户领取成功后自动充值到用户订购手机号上如用户原有会员的，则在原有会员有效期上顺延。 </span
      ><br />
      <span
        >（4）设置并观看AI家秀需要手机打开VOLTE功能，且手机系统为安卓或者鸿蒙，暂不支持苹果系统播放视频铃音。</span
      ><br />
      <span>3、如有疑问可拨打客服热线：4000602033。</span><br />
      <span>4、业务退订方式：</span><br />
      <span>（1）拨打移动客服电话10086进行退订。</span><br />
      <span>（2）进入AI家秀微信小程序退订。</span><br />
      <span>
        5、温馨提示：使用相关权益时，请遵守相应平台的用户服务协议和权益使用协议，如违反相关协议规定，运营商和联合权益提供方均有权单独进行处理，包括但不限于中止或终止提供其所属平台的服务及要求侵权赔偿等。如活动期内相关热门权益因库存不足或其他原因暂时无法兑换，用户可选择当月内延后兑换或者进行其他等价值的权益兑换给您带来的不便，敬请谅解。
      </span>
    </div>
    <img class="footer" src="../assets/g9uj5j/footer.png" alt="" />
    <gd-policy1 ref="gdPolicyRef1" />
    <gd-policy2 ref="gdPolicyRef2" />
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
import GdPolicy1 from '../components/gd3-policy1.vue'
import GdPolicy2 from '../components/public-privacy-policy.vue'
import { confirmBook, sendVerifyCode } from '@/api/bizHandle'
import { useRoute } from 'vue-router'
import { showFailToast, showSuccessToast, showToast } from 'vant'
import { throttle } from 'lodash'
import { validPhone } from '@/utils/rule'

const route = useRoute()
const { proxy } = getCurrentInstance()
const phone = ref('')
const code = ref('')
const codeText = ref('获取验证码')
const disabled = ref(false)
const verifyKey = ref(null)
const agree = ref(false)
const countdownTimer = ref(null)

onMounted(() => {
  phone.value = route.query.phone
  if (phone.value && route.query.productId) {
    getCode()
  }
})
const openPrivacy1 = () => {
  proxy.$refs.gdPolicyRef1.openDialog()
}
const openPrivacy2 = () => {
  proxy.$refs.gdPolicyRef2.openDialog()
}
const resetCountdown = () => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
  }
  countdownTimer.value = null
  codeText.value = '获取验证码'
  disabled.value = false
}

const startCountdown = () => {
  let time = 60
  codeText.value = `${time}秒后重新获取`
  disabled.value = true
  countdownTimer.value = setInterval(() => {
    time--
    codeText.value = `${time}秒后重新获取`
    if (time <= 0) {
      resetCountdown()
    }
  }, 1000)
}

const getCode = async () => {
  if (disabled.value) return
  const isValid = await validPhone(phone.value)
  if (!isValid) return
  try {
    const res = await sendVerifyCode({
      mobile: phone.value,
      productId: route.query.productId,
    })
    if (res.code === 200) {
      verifyKey.value = res.data
      startCountdown()
    } else {
      showFailToast(res.msg || '验证码发送失败')
      resetCountdown()
    }
  } catch (error) {
    console.error('请求错误:', error)
    showFailToast('验证码发送失败，请稍后重试')
    resetCountdown()
  }
}
const submit = throttle(async () => {
  const isValid = await validPhone(phone.value)
  if (!isValid) return
  if (!code.value) {
    showToast({ message: '请输入验证码', type: 'fail' })
    return
  }
  if (!agree.value) {
    showToast({ message: '请先阅读并同意相关协议', type: 'fail' })
    return
  }
  try {
    const res = await confirmBook({
      mobile: phone.value,
      productId: route.query.productId,
      verifyCode: code.value,
      verifyKey: verifyKey.value,
    })
    if (res.code === 200) {
      showSuccessToast('办理成功')
      code.value = ''
      verifyKey.value = null
      resetCountdown()
    } else {
      showFailToast(res.msg || '办理失败，请稍后重试')
    }
  } catch (error) {
    console.error('请求错误:', error)
    showFailToast('办理失败，请稍后重试')
  }
}, 1000)
onBeforeUnmount(() => {
  resetCountdown()
})

</script>
<style scoped>
img {
  display: block;
}

.footer {
  width: 100%;
  height: auto;
}

.rule .title {
  font-size: 18px;
  text-align: center;
  margin: 5px 0;
  font-weight: bolder;
}

.rule {
  width: 94%;
  margin-left: 3%;
  padding: 20px 12px;
  border-radius: 20px;
  box-sizing: border-box;
  background-color: #fff;
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 28px;
}

.desc-img {
  width: 94%;
  height: auto;
  margin-left: 3%;
}

.price {
  color: #fff;
  font-size: 14px;
}

.agree-row {
  color: #fff;
  font-size: 14px;
  margin: 5px 0;
  text-align: center;
}

:deep(.circle-checkbox .van-checkbox__icon) {
  border-radius: 50%; /* 改成圆形 */
}

:deep(.circle-checkbox .van-checkbox__label) {
  color: #fff;
  font-size: 14px;
}

.tel,
.tel a {
  font-size: 18px;
  color: #fff;
}

.flex-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 5%;
  margin-bottom: 60px;
  margin-top: 30px;
}

.btn {
  width: 86%;
  height: auto;
  margin-left: 7%;
  margin-top: 25px;
}

.code-btn {
  width: 120px;
  height: 40px;
  line-height: 40px;
  background-color: #fec802;
  font-size: 16px;
  color: #fff;
  border: 0;
}

.flex {
  display: flex;
  align-items: center;
}

.input {
  width: 90%;
  margin-left: 5%;
  height: 57px;
  line-height: 57px;
  margin-top: 30px;
  border: 1px solid #fec802;
  background-color: #fff;
  border-radius: 30px;
  padding: 0 5px 0 20px;
  box-sizing: border-box;
}

.input :deep(.van-cell) {
  border-radius: 30px;
  border: 0;
  box-shadow: none;
  padding: 0;
  font-size: 16px;
}

.page {
  width: 100vw;
  height: 100vh;
  background-color: rgb(39, 110, 244);
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
}

.banner {
  width: 100%;
  height: auto;
}
</style>
