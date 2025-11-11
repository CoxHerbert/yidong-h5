<template>
  <div class="page">
    <img class="banner" src="../assets/3hsvuk/banner.jpg" alt="" />
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
    <img class="btn" src="../assets/3hsvuk/btn.png" alt="" @click="submit" />
    <div class="flex-col">
      <div class="tel">
        客服热线：
        <a href="tel:4008862553">4008862553</a>
      </div>
      <div class="agree-row">
        <el-checkbox v-model="agree" class="circle-checkbox"> 我已阅读并同意</el-checkbox>
        <span @click="openPrivacy">《解约条款》</span>
      </div>
      <div class="price">业务名称：咪咕短剧情感精品会员</div>
      <div class="price">资费：15元/月，为连续按月收费</div>
      <div class="price">客服时间：周一至周五(9:00-18:00)</div>
    </div>
    <div class="rule">
      <div class="title">产品规则</div>
      <span>【业务名称】</span><br />
      <span> 咪咕短剧情感精品会员</span><br />
      <span> 【业务内容】 </span><br />
      <span>
        咪咕短剧情感精品会员，
        <span style="color: rgb(238, 130, 47)">资费15元/月</span>
        ，按自然月扣费。订购用户每月可畅看精选特色精品短剧，前往“咪咕读”APP-我的-我的包月查看详情。赠送话费不能用于抵扣本产品费用。 </span
      ><br />
      <span>【生效规则】</span><br />
      <span>
        不限办理次数，订购后立即生效并连续按月收费，如不使用请登录“中国移动”APP(路径：我的-已订业务)取消业务:取消当月底失效。
      </span>
    </div>
    <img class="footer" src="../assets/3hsvuk/footer.png" alt="" />
    <gd-policy ref="gdPolicyRef" />
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import GdPolicy from '../components/gd2-policy1.vue'
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
const openPrivacy = () => {
  proxy.$refs.gdPolicyRef.openDialog()
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
  background-color: rgb(49, 110, 196);
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
}

.banner {
  width: 100%;
  height: auto;
}
</style>
