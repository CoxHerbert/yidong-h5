<template>
  <div class="page">
    <img class="banner" src="../assets/a8wv05/banner.png" alt="" />
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
    <img class="btn" src="../assets/a8wv05/btn.gif" alt="" @click="submit" />
    <div class="flex-col">
      <div class="tel">
        客服热线：
        <a href="tel:10086">10086</a>
      </div>
      <div class="agree-row">
        <el-checkbox v-model="agree" class="circle-checkbox"> 我已阅读并同意</el-checkbox>
        <span @click="openPrivacy1">《产品介绍》</span>
        和
        <span @click="openPrivacy2">《隐私条款》</span>
      </div>
      <div class="price">资费：19.9元/月</div>
    </div>
    <div class="rule">
      <div class="title">活动说明</div>
      <span>【客户范围】</span><br />
      <span> 辽宁移动客户 </span><br />
      <span> 【产品规则】 </span><br />
      <span>
        ①19.9元/月，包含车主权益(1次免费洗车/20元加油券/20元充电券/20元停车券)4选1、15GB融合定向流量(不含港澳台)、多款车主类优惠券(具体权益内容及使用以领取页面展示为准)、办理即成为权益超市黄金会员享受黄金会员升级体验版服务。可享限时优惠：办理前3个月每月车主权益可享4选2，第4个月起恢复每月车主权益4选1。办理立即生效，按月自动续订与扣费，退订次月失效。退订可编辑短信“TD60235”到10086。</span
      ><br />
      <span> ②7天无理由：办理后7天内如反悔可编辑短信"TD60235"到10086进行业务退订。</span><br />
      <span style="color: rgb(255, 192, 0)"> ③不支持叠加办理，与随心行系列会员不支持同时办理。</span
      ><br />
      <span> ④随心行会员权益领取入口：</span><br />
      <span>a：登录中国移动APP点击右下方"我的”-点击“我的权益"-选择“随心行会员”领取。</span><br />
      <span>b：关注"辽宁移动权益超市"公众号，回复关键字“随心行点击会员专属页面领取。 </span><br />
      <span>
        ⑤15GB热门视频APP定向流量使用范围：可通过<a href="https://dx.10086.cn/CXlmDA"
          >https://dx.10086.cn/CXlmDA</a
        >
        链接了解使用范围。</span
      ><br />
      <span>⑥权益超市黄金会员及黄金会员升级体验版服务领取入口：</span><br />
      <span
        >登录中国移动APP点击右下方"我的”-点击"我的权益"-通过会员权益”领取。还可关注“辽宁移动权益超市"公众号，回复关键字"领”点击"超市会员”-“黄金会员升级版"专属页面可叠加领取。</span
      ><br />
      <span style="color: rgb(255, 192, 0)">
        ⑦客户可按月自主领取当期权益，过期不支持补领、补发。具体权益内容以领取页面为准。</span
      ><br />
      <span style="color: rgb(255, 192, 0)"> ⑧业务使用期间，须保持中国移动网络。</span>
    </div>
    <img class="footer" src="../assets/a8wv05/footer.png" alt="" />
    <ln-policy1 ref="lnPolicyRef1" />
    <ln-policy2 ref="lnPolicyRef2" />
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import LnPolicy1 from '../components/ln-policy1.vue'
import LnPolicy2 from '../components/public-privacy-policy.vue'
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
  proxy.$refs.lnPolicyRef1.openDialog()
}
const openPrivacy2 = () => {
  proxy.$refs.lnPolicyRef2.openDialog()
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
  background-color: rgb(227, 60, 80);
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
}

.banner {
  width: 100%;
  height: auto;
}
</style>
