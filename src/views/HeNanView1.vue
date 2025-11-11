<template>
  <div class="page">
    <img class="banner" src="../assets/1ex5vw/banner.png" alt="" />
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
    <img class="btn" src="../assets/1ex5vw/btn.gif" alt="" @click="submit" />
    <div class="flex-col">
      <div class="agree-row">
        <el-checkbox v-model="agree" class="circle-checkbox"> 我已阅读并同意</el-checkbox>
        <span @click="openPrivacy1">《产品介绍》</span>
        和
        <span @click="openPrivacy2">《隐私条款》</span>
        立即生效，活动到期后产品将自动续订且按标准价20元/月收费
      </div>
    </div>
    <div class="rule">
      <div class="title">活动说明</div>
      <span>订购说明</span><br />
      <span> 1、参与限制：仅限有当前产品办理资格的用户参与。 </span><br />
      <span>
        2、合约活动内容：参与活动时需要为您订购20元60G流量月包（电渠专属）12个月合约活动，同步开通20元60G流量月包（电渠专属），活动价20元/月，合约期12个自然月（含当月）。 </span
      ><br />
      <span>
        3、包含资源：每月含5GB国内（除港澳台地区）通用流量，每月加享55GB区域定向流量（可冲减快手、抖音、今日头条、西瓜等APP定向流量，具体免流范围以最新公告为准）。</span
      ><br />
      <span>
        4、合约承诺及违约约定：合约期内不可降低当前套餐档次，需承诺在网并履行约定，如申请办理停机保号、销号、携号转网、终止合约等服务，请至当地移动自营厅解约后办理，解除合约按河南移动合约活动提前解约方案执行，解除合约按约定0元赔付。</span
      ><br />
      <span>
        5、合约活动到期：合约期最后五天前不可取消，活动到期后产品将自动续订且按20元60G流量月包（电渠专属）标准价20元/月收费，含5GB/月国内（除港澳台地区）通用流量和55GB/月区域定向流量（可冲减使用的快手、抖音、今日头条、西瓜等APP定向流量，具体免流范围以最新公告为准），产品包含国内通用和定向流量均限当月使用，不可共享、结转、转赠。合约到期后，若您不需要，可根据到期短信主动退订或发送0000到10086，不退订视为继续使用。</span
      ><br />
      <span>
        6、流量优先级：产品内包含的通用流量优先级低于主套餐套内流量，优先级同其他5G流量包产品；定向流量先于基础套餐和流量包内通用流量优先使用。</span
      ><br />
      <span>7、该流量产品订购立即生效，按天按量扣费，退订立即生效。</span><br />
      <span>8、区域流量可在河南省内的商圈、景点、校园、生活区等地使用。</span><br />
      <span>客服电话：400-6833330</span>
    </div>
    <hn-policy1 ref="hnPolicyRef1" />
    <hn-policy2 ref="hnPolicyRef2" />
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import HnPolicy1 from '../components/hn1-policy1.vue'
import HnPolicy2 from '../components/public-privacy-policy.vue'
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
  proxy.$refs.hnPolicyRef1.openDialog()
}
const openPrivacy2 = () => {
  proxy.$refs.hnPolicyRef2.openDialog()
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
  background-color: rgb(221, 16, 64);
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
}

.banner {
  width: 100%;
  height: auto;
}
</style>
