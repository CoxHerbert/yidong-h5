<template>
  <div class="page">
    <img class="banner" src="../assets/rf5uwy/banner.jpg" alt="" />
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
    <img class="btn" src="../assets/rf5uwy/btn.gif" alt="" @click="submit" />
    <div class="flex-col">
      <div class="agree-row">
        <el-checkbox v-model="agree" class="circle-checkbox"> 我已阅读并同意</el-checkbox>
        <span @click="openPrivacy1">《产品介绍》</span>
        和
        <span @click="openPrivacy2">《隐私条款》</span>
      </div>
      <div class="price">资费：19.9元/月</div>
    </div>
    <div class="rule">
      <div class="title">业务说明</div>
      <span>一、产品信息</span><br />
      <span>1、产品名称：橙翼包19.9元权益合约；</span><br />
      <span>2、产品资费：19.9元/月；</span><br />
      <span
        >3、产品内容：用户办理此合约升级为5G用户,每月获得5GB全国通用流量，办理合约成为中国电信plus会员用户，享受以下特权：</span
      ><br />
      <span>
        ①会员特权：每月可享受会员特权（爱奇艺、优酷、腾讯、芒果TV、酷狗音乐、QQ绿钻豪华版、网易云音乐VIP会员月卡、喜马拉雅巅峰会员月卡、高德打车10元券、WPS普通会员月卡、作业帮会员月卡、翼支付5元通用券*3（无话费场景）N选1）;</span
      ><br />
      <span>
        ②本地特权：每月可领取美团外卖5元代金券*2、肯德基新奥尔良烤翅抵扣券、肯德基允指原味鸡抵用券、饿了么5元红包券*2、滴滴出行快车5元券*2，N选1；</span
      ><br />
      <span>③5G特权：流量优惠券，每月可领取5GBplus会员专属流量包。</span><br />
      <span>二、规则描述</span><br />
      <span>1、产品有效期：12个自然月，到期如用户不退订，则自动续订；</span><br />
      <span>
        2、订购规则：订购立即生效，5G流量全额提供，当月功能费全额计扣，不折算，不允许变更；</span
      ><br />
      <span> 3、重复订购规则：有效期内不允许重复订购；</span><br />
      <span>
        4、退订规则：允许退订，退订次月生效。退订渠道：线下中国电信营业厅、10000号及95106均可办理。</span
      >
    </div>
    <img class="footer" src="../assets/rf5uwy/footer.jpg" alt="" />
    <qh-policy1 ref="qhPolicyRef1" />
    <qh-policy2 ref="qhPolicyRef2" />
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import QhPolicy1 from '../components/qh-policy1.vue'
import QhPolicy2 from '../components/public-privacy-policy.vue'
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
  proxy.$refs.qhPolicyRef1.openDialog()
}
const openPrivacy2 = () => {
  proxy.$refs.qhPolicyRef2.openDialog()
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

:deep(.circle-checkbox .el-checkbox__inner) {
  border-radius: 50%; /* 改成圆形 */
}

:deep(.circle-checkbox .el-checkbox__label) {
  color: #fff;
  font-size: 14px;
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
  background-color: rgb(136, 136, 255);
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
}

.banner {
  width: 100%;
  height: auto;
}
</style>
