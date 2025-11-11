<template>
  <div class="page">
    <img class="banner" src="../assets/mhkub9/banner.png" alt="" />
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
    <img class="btn" src="../assets/mhkub9/btn.gif" alt="" @click="submit" />
    <div class="flex-col">
      <div class="tel">
        客服热线：
        <a href="tel:4008089391">4008089391</a>
      </div>
      <div class="agree-row">
        <van-checkbox v-model="agree" class="circle-checkbox"> 我已阅读并同意</van-checkbox>
        <span @click="openPrivacy1">《个人隐私协议》</span>
        、
        <span @click="openPrivacy2">《业务受理单》</span>
        、
        <span @click="openPrivacy3">《解约条款》</span>
      </div>
      <div class="price">资费：15元/月</div>
    </div>
    <img class="desc-img" src="../assets/mhkub9/img1.png" alt="" />
    <div class="rule">
      <div class="title">业务规则</div>
      <span>订购用户每月可畅看精选特色精品短剧</span><br />
      <span>
        【业务内容】咪咕短剧时尚精品会员，资费15元/月，按自然月扣费。订购用户每月可畅看精选特色精品短剧，前往“咪咕阅读”APP-我的-我的包月查看详情。赠送话费不能用于抵扣本产品费用。 </span
      ><br />
      <span>
        【生效规则】不限办理次数，订购后立即生效并连续按月收费，如不使用请登录“中国移动"APP(路径：我的-已订业务)取消业务，取消当月底失效。 </span
      ><br />
      <span>客服服务电话：4008089391</span><br />
      <span>客服服务时间：每周一至周五9:00-18:00</span>
    </div>
    <img class="footer" src="../assets/mhkub9/footer.png" alt="" />
    <gd-policy1 ref="gdPolicyRef1" />
    <gd-policy2 ref="gdPolicyRef2" />
    <gd-policy3 ref="gdPolicyRef3" />
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
import GdPolicy1 from '../components/gd1-policy1.vue'
import GdPolicy2 from '../components/gd1-policy2.vue'
import GdPolicy3 from '../components/gd1-policy3.vue'
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
const openPrivacy3 = () => {
  proxy.$refs.gdPolicyRef3.openDialog()
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
  color: #252525;
  font-size: 14px;
}

.agree-row {
  color: #252525;
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
  color: #252525;
}

.flex-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 5%;
  margin-bottom: 60px;
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
  background-color: rgb(255, 37, 90);
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
}

.banner {
  width: 100%;
  height: auto;
}
</style>
