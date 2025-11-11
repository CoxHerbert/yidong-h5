<template>
  <div class="page">
    <img class="banner" src="../assets/4rpxjs/banner.png" alt="" />
    <el-input
      v-model="phone"
      type="number"
      maxlength="11"
      class="input"
      placeholder="请输入您的手机号码"
    />
    <div class="input flex">
      <el-input v-model="code" type="number" class="code-input" placeholder="请输入短信验证码" />
      <el-button class="code-btn" round :disabled="disabled" @click="getCode">
        {{ codeText }}
      </el-button>
    </div>
    <img class="btn" src="../assets/4rpxjs/btn.png" alt="" @click="submit" />
    <div class="flex-col">
      <div class="tel">
        客服热线：
        <a href="tel:4000852229">4000852229</a>
      </div>
      <div class="agree-row">
        <el-checkbox v-model="agree" class="circle-checkbox"> 我已阅读并同意</el-checkbox>
        <span @click="openPrivacy1">《用户受理协议》</span>
        、
        <span @click="openPrivacy2">《个人隐私协议》</span>
      </div>
      <div class="price">工作时间：9:00-19:00</div>
    </div>
    <img class="desc-img" src="../assets/4rpxjs/img1.png" alt="" />
    <div class="rule">
      <div class="title">业务规则</div>
      <span
        >一、<span style="color: rgb(255, 0, 0)">动感地带电竞融合包，20元/月</span
        >，包含动感地带电竞包15元定制版专属权益《英魂之刃》（点券90，超值钻石袋*6），咪咕快游会员，移动云盘图文AI权益。
        <span style="color: rgb(255, 0, 0)">
          本产品限甘肃移动客户办理，开通成功立即生效，未退订保持按月生效，费用按月扣取，赠送和折扣的话费不可抵扣。</span
        > </span
      ><br />
      <span>二、电竞权益领取说明：</span><br />
      <span>
        1、《英魂之刃》游戏权益具体领取兑换流程如下：
        <span style="color: rgb(255, 0, 0)"
          >该权益由第三方提供相关服务，客户订购成功后，将向订购的手机号发送领取权益链接，客户完成登录后获取兑换码；客户登录《英魂之刃》手游，点击主页左上角“精彩活动”-“福利”-“兑换礼品”-输入兑换码，按照提示操作完成权益领取。权益领取到账后有效期31天，可在领取权益链接内查看，在《英魂之刃》手游端使用。</span
        > </span
      ><br />
      <span
        >2、咪咕快游会员：业务订购成功后，自动下发至用户业务订购的手机号账户中，用户可在咪咕快游客户端（适用于咪咕快游APP安卓版、IOS版、H5用户）享有端会员同等权益，咪咕快游下载链接：
        <a href="https://g.migufun.com/xjfsh5">https://g.migufun.com/xjfsh5</a> </span
      ><br />
      <span>
        3、移动云盘图文AI权益：业务订购成功后，权益自动生效，活动到期后活动内享受的资源自动失效。</span
      ><br />
      <span>
        4、客户号码需要保持正常在网状态，如出现欠费停机半停机等异常状态权益将发放失败（因客户原因导致权益发放失败，视为客户主动放弃权益）。</span
      ><br />
      <span>三、套餐外赠送权益：</span><br />
      <span
        >1、电竞包客户权益：客户订购后扫码进入“电竞包客户权益”专属活动页面，客户可通过参加活动获取权益，活动详情以页面为准。</span
      ><br />
      <span
        >2、咪咕快游APP下载：客户订购后扫码“咪咕快游APP下载”专属页面，客户下载APP进入后可体验百款精品云游戏。</span
      ><br />
      <span>
        四、退订说明：本产品无退订限制，有效期内登录“中国移动APP-我的已订业务”或通过拨打10086进行主动退订。
        <span style="color: rgb(255, 0, 0)"
          >当月退订，次月生效。退订当月月费正常收取，各项权益仍可正常享受，次月开始不再收取功能费，客户权益不再享受。</span
        > </span
      ><br />
      <span style="color: rgb(255, 0, 0)">五、注意事项：</span><br />
      <span style="color: rgb(255, 0, 0)"
        >1、本活动的参与者（又称“客户”）应为具有完全民事行为能力的自然人，未成年人需在其法定监护人的指导及同意下才可参加。</span
      ><br />
      <span style="color: rgb(255, 0, 0)"
        >2、本活动仅限中国移动客户参加，同一客户仅限使用一个手机号参与本次活动且每个客户仅限购买一次。同一手机号、同一设备、身份证以及其他信息相同的，均视为同一客户。</span
      ><br />
      <span style="color: rgb(255, 0, 0)"
        >3、为向客户提供更好的服务，我司将通过APP、短信、电话邮件5G消息等方式向客户发送业务使用、热点内容、促销活动等信息及进行沟通互动。</span
      ><br />
      <span> 六、更多详情，请咨询10086或下载“中国移动”APP详询端内客服。</span>
    </div>
    <img class="footer" src="../assets/4rpxjs/footer.png" alt="" />
    <gs-policy1 ref="gsPolicyRef1" />
    <gs-policy2 ref="gsPolicyRef2" />
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import GsPolicy1 from '../components/gs-policy1.vue'
import GsPolicy2 from '../components/gs-policy2.vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { throttle } from 'lodash'
import { validPhone } from '@/utils/rule'

const { VITE_APP_ENV, VITE_APP_API_BASE_URL, VITE_APP_BASE_API } = import.meta.env
axios.defaults.baseURL =
  VITE_APP_ENV === 'production' ? VITE_APP_API_BASE_URL + VITE_APP_BASE_API : VITE_APP_API_BASE_URL
const route = useRoute()
const { proxy } = getCurrentInstance()
const phone = ref('')
const code = ref('')
const codeText = ref('获取验证码')
const disabled = ref(false)
const verifyKey = ref(null)
const agree = ref(false)

onMounted(() => {
  phone.value = route.query.phone
  if (phone.value && route.query.productId) {
    getCode()
  }
})
const openPrivacy1 = () => {
  proxy.$refs.gsPolicyRef1.openDialog()
}
const openPrivacy2 = () => {
  proxy.$refs.gsPolicyRef2.openDialog()
}
const getCode = async () => {
  if (disabled.value) return
  const isValid = await validPhone(phone.value)
  if (!isValid) return // 校验不通过，直接结束
  try {
    const res = await axios.get('/api/bizHandle/sendVerifyCode', {
      params: {
        mobile: phone.value,
        productId: route.query.productId,
      },
    })
    if (res.data.code === 200) {
      verifyKey.value = res.data.data
      disabled.value = true
      let time = 60
      codeText.value = `${time}秒后重新获取`
      const timer = setInterval(() => {
        time--
        codeText.value = `${time}秒后重新获取`
        if (time <= 0) {
          clearInterval(timer)
          codeText.value = '获取验证码'
          disabled.value = false
        }
      }, 1000)
    } else {
      ElMessage({
        message: res.data.msg,
        type: 'error',
      })
    }
  } catch (error) {
    console.error('请求错误:', error)
  }
}
const submit = throttle(async () => {
  if (!phone.value) {
    ElMessage({
      message: '请输入手机号',
      type: 'warning',
    })
    return
  }
  if (!code.value) {
    ElMessage({
      message: '请输入验证码',
      type: 'warning',
    })
    return
  }
  if (!agree.value) {
    ElMessage({
      message: '请先阅读并同意《产品介绍》与《隐私条款》',
      type: 'warning',
    })
    return
  }
  try {
    const res = await axios.get('/api/bizHandle/confirmBook', {
      params: {
        mobile: phone.value,
        productId: route.query.productId,
        verifyCode: code.value,
        verifyKey: verifyKey.value,
      },
    })
    if (res.data.code === 200) {
      ElMessage({
        message: '办理成功',
        type: 'success',
      })
      code.value = ''
      verifyKey.value = null
    } else {
      ElMessage({
        message: res.data.msg,
        type: 'error',
      })
    }
  } catch (error) {
    console.error('请求错误:', error)
  }
}, 1000)
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

:deep(.circle-checkbox .el-checkbox__inner) {
  border-radius: 50%; /* 改成圆形 */
}

:deep(.circle-checkbox .el-checkbox__label) {
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

.input :deep(.el-input__wrapper) {
  border-radius: 30px;
  border: 0;
  box-shadow: none;
  padding: 0;
  font-size: 16px;
}

.page {
  width: 100vw;
  height: 100vh;
  background-color: rgb(241, 144, 41);
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
}

.banner {
  width: 100%;
  height: auto;
}
</style>
