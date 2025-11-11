<template>
  <div class="page">
    <img class="banner" src="../assets/ezz1jo/banner.png" alt="" />
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
    <img class="btn" src="../assets/ezz1jo/btn.gif" alt="" @click="submit" />
    <div class="flex-col">
      <div class="tel">
        客服热线：
        <a href="tel:400 104 9866">400 104 9866</a>
      </div>
      <div class="agree-row">
        <van-checkbox v-model="agree" class="circle-checkbox"> 我已阅读并同意</van-checkbox>
        <span @click="openPrivacy1">《产品介绍》</span>
        和
        <span @click="openPrivacy2">《隐私条款》</span>
      </div>
      <div class="price">20元/月（自动续订）</div>
    </div>
    <div class="rule">
      <div class="title">业务规则</div>
      <span>1、业务名称：素质教育课程-D。</span><br />
      <span>2、业务月费：20元/月。</span><br />
      <span> 3、内含资源： </span><br />
      <span>
        包含素质教育课程-D（对学生在写作文过程中容易忽视的问题进行重点解读，加强阅读训练和写作训练，把知识点的梳理贯穿在整个作文教学环节中。依据学生的实际状况，有层次地培养学生在写作过程中的想象能力、思辨能力、批判能力）。</span
      ><br />
      <span> 4、内含权益：</span><br />
      <span>
        爆款会员卡：洪恩十万问月卡、洪恩思维月卡、洪恩双语绘本月卡、有道词典月卡、作业帮月卡、wps超级会员月卡、喜马拉雅儿童月卡、百度文库月卡、知乎盐选月卡、得到电子书月卡，每月可选其中一个。</span
      ><br />
      <span> 5、权益使用方式：</span><br />
      <span>(1)课程使用路径：下载“山西和教育”APP，可以查看和使用课程。</span><br />
      <span
        >(2)会员权益兑换方式：关注并进入“移通福市”进入福利兑换中心选择您需要的会员权益-点击“立即兑换”-输入手机验证码后即可兑换成功，可前往权益所在平台激活使用。</span
      ><br />
      <span
        >(3)如活动期内相关热门权益因库存不足或其他原因暂时无法换，用户可选择等待权益补货或选择其他等价值的权益兑换。给您带来的不便，敬请谅解。</span
      ><br />
      <span>(4)首次订购用户随时领取，次月起，每月1日-5日为权益领取日，过期将无法领取。</span><br />
      <span>6、业务类型：连续包月业务。</span><br />
      <span>7、生效时间：开通后立即生效。</span><br />
      <span>8、限定条件：无。</span><br />
      <span>
        9、退订方式：如需退订，发送短信0000至10086，按提示内容退订，退订后下一个账期生效。
      </span>
    </div>
    <sx-policy1 ref="sxPolicyRef1" />
    <sx-policy2 ref="sxPolicyRef2" />
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
import SxPolicy1 from '../components/sx-policy1.vue'
import SxPolicy2 from '../components/public-privacy-policy.vue'
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
  proxy.$refs.sxPolicyRef1.openDialog()
}
const openPrivacy2 = () => {
  proxy.$refs.sxPolicyRef2.openDialog()
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
  background-color: rgb(224, 60, 83);
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
}

.banner {
  width: 100%;
  height: auto;
}
</style>
