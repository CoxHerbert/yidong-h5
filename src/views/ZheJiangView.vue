<template>
  <div class="page">
    <img class="banner" src="../assets/bgwbxz/banner.jpg" alt="" />
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
    <img class="btn" src="../assets/bgwbxz/btn.gif" alt="" @click="submit" />
    <div class="flex-col">
      <div class="tel">
        客服热线：
        <a href="tel:4006693300">4006693300</a>
      </div>
      <div class="agree-row">
        <van-checkbox v-model="agree" class="circle-checkbox"> 我已阅读并同意</van-checkbox>
        <span @click="openPrivacy1">《产品介绍》</span>
        和
        <span @click="openPrivacy2">《隐私条款》</span>
      </div>
      <div class="price">资费：10元/月</div>
    </div>
    <div class="rule">
      <div class="title">业务说明</div>
      <span>1.产品名称：浙江和教育联合会员。</span><br />
      <span>2.产品资费：话费支付10元/月。</span><br />
      <span>3.产品对象：浙江移动用户。</span><br />
      <span>
        4.生效时间：订购后立即生效，不取消按月扣费；可随时取消，取消立即生效，当前周期内可继续享受权益，次月起不再扣费。 </span
      ><br />
      <span
        >5.产品权益：浙江和教育联合会员:是以大数据为驱动的教育平台，专注K12教学领域。通过人工智能技术为老师提供学生学业分析，为学生提供AI作文、口算批改、智能个性化辅导方案等的智能化教育产品。权益二：热门会员周卡：优酷黄金会员、喜马拉雅会员、搜狐黄金会员、芒果(PC影视)会员注：若已有该平台权益，叠加规则以该平台为准。</span
      ><br />
      <span>
        6.权益领取：权益一：浙江和教育联合会员：订购成功后，可前往关注浙江和教育微信公众号查看使用或前往品兑兑微信公众号-小舟易学-我要学习进行使用。权益二：热门会员周卡兑换：进入“品兑兑”微信公众号点击右下角浙江和教育联合会员领取会员页面选择要兑换的会员，输入订购号码回复验证码兑换领取，兑换成功后会收到平台的兑换成功通知。 </span
      ><br />
      <span
        >7.办理须知：订购业务前请仔细阅读活动规则，订购本业务，即视为同意接受本业务及其相关活动的所有条款或规则。</span
      ><br />
      <span
        >8.热门会员权益需用户月底前领取，用户需至指定领取入口领取权益，按自然月可领取一次权益。会员有效期7天，从领取当天开始计算。如当月权益未领取，次月无法补领。</span
      ><br />
      <span> 9.退订方式：致电客服热线4006693300协助退订。</span><br />
      <span
        >10.客服咨询：客服热线：4006693300，客服工作时间：周一到周日8:00-21:00，节假日无休。</span
      >
    </div>
    <zj-policy1 ref="zjPolicyRef1" />
    <zj-policy2 ref="zjPolicyRef2" />
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
import ZjPolicy1 from '../components/zj-policy1.vue'
import ZjPolicy2 from '../components/public-privacy-policy.vue'
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
  proxy.$refs.zjPolicyRef1.openDialog()
}
const openPrivacy2 = () => {
  proxy.$refs.zjPolicyRef2.openDialog()
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
  background-color: rgb(231, 57, 82);
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
}

.banner {
  width: 100%;
  height: auto;
}
</style>
