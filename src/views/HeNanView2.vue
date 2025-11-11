<template>
  <div class="page">
    <img class="banner" src="../assets/sqg1rj/banner.jpg" alt="" />
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
    <img class="btn" src="../assets/sqg1rj/btn.png" alt="" @click="submit" />
    <div class="flex-col">
      <div class="tel">
        客服热线：
        <a href="tel:400-6833330">400-6833330</a>
      </div>
      <div class="agree-row">
        <van-checkbox v-model="agree" class="circle-checkbox"> 我已阅读并同意</van-checkbox>
        <span @click="openPrivacy1">《产品介绍》</span>
        和
        <span @click="openPrivacy2">《隐私条款》</span>
      </div>
    </div>
    <div class="rule">
      <div class="title">订购说明</div>
      <span>1、参与限制：仅限有当前产品办理资格的用户参与。</span><br />
      <span
        >2、合约活动内容：参与活动时需要为您订购
        <span style="color: rgb(255, 0, 0)">20元60G流量月包（W）12个月活动</span>
        ，同步开通
        <span style="color: rgb(255, 0, 0)"
          >20元60G流量月包（W），活动价20元/月，合约期12个自然月（含当月）。</span
        > </span
      ><br />
      <span>
        3、包含资源：每月含5GB国内（除港澳台地区）通用流量，每月加享55GB在豫定向流量（可冲减快手、抖音、今日头条、西瓜等APP定向流量，具体免流范围以最新公告为准，在豫流量河南范围内使用）。</span
      ><br />
      <span>
        4、合约承诺及违约约定：合约期内
        <span style="color: rgb(255, 0, 0)">不可降低当前套餐档次</span>
        ，需承诺
        <span style="color: rgb(255, 0, 0)">在网并履行约定</span>
        ，如申请办理停机保号、销号、携号转网、终止合约等服务，请至当地移动自营厅解约后办理，解除合约按河南移动合约活动提前解约方案执行，解除合约按约定0元赔付。 </span
      ><br />
      <span>
        5、合约活动到期：
        <span style="color: rgb(255, 0, 0)">合约期最后五天前不可取消，</span>
        活动到期后产品将
        <span style="color: rgb(255, 0, 0)">自动续订</span>
        且按
        <span style="color: rgb(255, 0, 0)">20元60G流量月包（W）标准价20元/月</span>
        收费，含5GB/月国内(除港澳台地区)通用流量和55GB/月在豫定向流量(可冲减使用的快手、抖音、今日头条、西瓜等APP定向流量，具体免流范围以最新公告为准)，产品包含国内通用和在豫定向流量均限当月使用，不可共享、结转、转赠。
        <span style="color: rgb(255, 0, 0)">合约到期后</span>
        ，若您不需要，
        <span style="color: rgb(255, 0, 0)"
          >可根据到期短信主动退订或在中国移动APP-我的-已订业务中退订，不退订视为继续使用。</span
        > </span
      ><br />
      <span>
        6、流量优先级：产品内包含的通用流量优先级低于主套餐套内流量，优先级同其他5G流量包产品；在豫定向流量先于基础套餐和流量包内通用流量优先使用。流量使用遵循基础套餐的超套流量标准、封顶、限速规则执行。</span
      ><br />
      <span> 7、该流量产品订购立即生效，按天按量扣费，退订立即生效。</span>
    </div>
    <img class="footer" src="../assets/sqg1rj/footer.jpg" alt="" />
    <hn-policy1 ref="hnPolicyRef1" />
    <hn-policy2 ref="hnPolicyRef2" />
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
import HnPolicy1 from '../components/hn2-policy1.vue'
import HnPolicy2 from '../components/public-privacy-policy.vue'
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
  proxy.$refs.hnPolicyRef1.openDialog()
}
const openPrivacy2 = () => {
  proxy.$refs.hnPolicyRef2.openDialog()
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
  margin-top: 30px;
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
  background-color: rgb(218, 18, 64);
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
}

.banner {
  width: 100%;
  height: auto;
}
</style>
