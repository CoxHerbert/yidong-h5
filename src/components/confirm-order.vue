<template>
  <div class="popup-mask" v-if="show">
    <div class="popup-content">
      <img class="bg" src="../assets/confirm-bg.png" alt="" />
      <div class="title">您的号码{{ phoneText }}正在订购</div>
      <div class="describe">
        <div v-html="nodes"></div>
      </div>
      <div class="input flex">
        <el-input v-model="code" type="number" class="code-input" placeholder="请输入短信验证码" />
        <el-button class="code-btn" round :disabled="disabled" :loading="loading" @click="getCode">
          {{ codeText }}
        </el-button>
      </div>
      <div class="btn-group">
        <div class="btn1" @click="close">残忍拒绝</div>
        <img class="btn2" src="../assets/confirm-btn.gif" alt="" @click="submit" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { throttle } from 'lodash'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'

const route = useRoute()
const show = ref(false)
const productId = ref('')
const nodes = ref('')
const phone = ref('')
const phoneText = ref('')
const code = ref('')
const codeText = ref('获取验证码')
const disabled = ref(false)
const verifyKey = ref(null)
const loading = ref(false)
const timer = ref(null)

const open = (val) => {
  productId.value = val.productId
  phone.value = val.phone
  // 手机号脱敏显示
  phoneText.value = phone.value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  show.value = true
  getCode()
  try {
    // 富文本显示
    nodes.value = val.productDescribe
    // 检测nodes里面有没有p标签,有的话，把p标签换成div标签;
    nodes.value = nodes.value.replace(/<p/g, '<div style="line-height: 1.2;"')
    nodes.value = nodes.value.replace(/<\/p>/g, '</div>')
    // 检测nodes里面有没有<img>,有的话，加上img的样式width: 100%;height: auto;
    nodes.value = nodes.value.replace(
      /<img/g,
      '<img style="width: 100%;height: auto;margin-top: 6px;"',
    )
  } catch (error) {}
}

const close = () => {
  productId.value = ''
  nodes.value = ''
  phone.value = ''
  phoneText.value = ''
  code.value = ''
  codeText.value = '获取验证码'
  disabled.value = false
  verifyKey.value = null
  show.value = false
  if (timer.value) {
    clearInterval(timer.value)
  }
}

const getCode = async () => {
  if (disabled.value || loading.value) return
  loading.value = true
  disabled.value = true
  let time = 60
  codeText.value = `获取验证码 (${time})`
  timer.value = setInterval(() => {
    time--
    codeText.value = `获取验证码 (${time})`
    if (time <= 0) {
      clearInterval(timer.value)
      codeText.value = '获取验证码'
      disabled.value = false
    }
  }, 1000)
  try {
    const res = await axios.get('/api/bizHandle/sendVerifyCode', {
      params: {
        mobile: phone.value,
        productId: productId.value,
        ...route.query,
      },
    })
    if (res.data.code === 200) {
      verifyKey.value = res.data.data
    } else {
      ElMessage({
        message: res.data.msg,
        type: 'error',
      })
    }
  } catch (error) {
    console.error('请求错误:', error)
  } finally {
    loading.value = false
  }
}
const submit = throttle(async () => {
  if (!code.value) {
    ElMessage({
      message: '请输入验证码',
      type: 'warning',
    })
    return
  }
  try {
    const res = await axios.get('/api/bizHandle/confirmBook', {
      params: {
        mobile: phone.value,
        productId: productId.value,
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
      close()
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

defineExpose({
  open,
})
</script>
<style lang="scss" scoped>
.popup-mask {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.popup-content {
  position: relative;
  width: 85%;
  height: 110vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
  box-sizing: border-box;
  .describe {
    z-index: 9999;
    flex: 1;
    overflow-y: scroll;
    width: 90%;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    padding: 10px;
    box-sizing: border-box;
  }
  .input {
    width: 90%;
    height: 45px;
    line-height: 45px;
    background-color: #fff;
    border-radius: 25px;
    padding-left: 12.5px;
    margin: 22px 0 17px;
    box-sizing: border-box;
    z-index: 9999;
    display: flex;
    align-items: center;
    .code-btn {
      width: 41%;
      height: 100%;
      border-radius: 0 25px 25px 0;
      background: #950e10;
      border: 0;
      color: #fff;
      font-size: 13px;
      font-weight: 500;
      box-sizing: border-box;
      flex: none;
    }
  }
  .code-input :deep(.el-input__wrapper) {
    border-radius: 15px;
    border: 0;
    box-shadow: none;
    padding: 0;
    font-size: 16px;
    letter-spacing: 1px;
  }
  .code-input :deep(.el-input__inner) {
    font-weight: 600;
    color: #000;
    margin-top: 2.5px;
  }
  .btn-group {
    display: flex;
    justify-content: space-between;
    z-index: 9999;
    padding: 0 10%;
    width: 100%;
    box-sizing: border-box;
    .btn1 {
      width: 26%;
      height: 6.4vw;
      border-radius: 18px;
      border: 1px solid #fff;
      color: #fff;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.2px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 15px;
    }
    .btn2 {
      width: 64%;
      height: auto;
    }
  }
  .title {
    color: #620000;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2px;
    margin: 13% 0 14px;
    z-index: 9999;
  }
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
}
</style>
