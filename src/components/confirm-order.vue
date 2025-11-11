<template>
  <div class="popup-mask" v-if="show">
    <div class="popup-content">
      <img class="bg" src="../assets/confirm-bg.png" alt="" />
      <div class="title">您的号码{{ phoneText }}正在订购</div>
      <div class="describe">
        <div v-html="nodes"></div>
      </div>
      <div class="input flex">
        <van-field
          v-model="code"
          type="digit"
          class="code-input"
          placeholder="请输入短信验证码"
          maxlength="6"
        />
        <van-button
          class="code-btn"
          round
          type="primary"
          :disabled="disabled"
          :loading="loading"
          loading-text="发送中..."
          @click="getCode"
        >
          {{ codeText }}
        </van-button>
      </div>
      <div class="btn-group">
        <div class="btn1" @click="close">残忍拒绝</div>
        <img class="btn2" src="../assets/confirm-btn.gif" alt="" @click="submit" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { throttle } from 'lodash'
import { useRoute } from 'vue-router'
import { showFailToast, showSuccessToast, showToast } from 'vant'
import { confirmBook, sendVerifyCode } from '@/api/bizHandle'

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
  phoneText.value = phone.value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  show.value = true
  getCode()
  try {
    nodes.value = val.productDescribe
    nodes.value = nodes.value.replace(/<p/g, '<div style="line-height: 1.2;"')
    nodes.value = nodes.value.replace(/<\/p>/g, '</div>')
    nodes.value = nodes.value.replace(
      /<img/g,
      '<img style="width: 100%;height: auto;margin-top: 6px;"',
    )
  } catch (error) {}
}

const resetTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  timer.value = null
  disabled.value = false
  codeText.value = '获取验证码'
}

const close = () => {
  productId.value = ''
  nodes.value = ''
  phone.value = ''
  phoneText.value = ''
  code.value = ''
  verifyKey.value = null
  show.value = false
  resetTimer()
}

const startCountdown = () => {
  let time = 60
  codeText.value = `获取验证码 (${time})`
  disabled.value = true
  timer.value = setInterval(() => {
    time--
    codeText.value = `获取验证码 (${time})`
    if (time <= 0) {
      resetTimer()
    }
  }, 1000)
}

const getCode = async () => {
  if (disabled.value || loading.value) return
  loading.value = true
  try {
    const res = await sendVerifyCode({
      mobile: phone.value,
      productId: productId.value,
      ...route.query,
    })
    if (res.code === 200) {
      verifyKey.value = res.data
      startCountdown()
    } else {
      showFailToast(res.msg || '验证码发送失败')
      resetTimer()
    }
  } catch (error) {
    console.error('请求错误:', error)
    showFailToast('验证码发送失败，请稍后重试')
    resetTimer()
  } finally {
    loading.value = false
  }
}

const submit = throttle(async () => {
  if (!code.value) {
    showToast({
      message: '请输入验证码',
      type: 'fail',
    })
    return
  }
  try {
    const res = await confirmBook({
      mobile: phone.value,
      productId: productId.value,
      verifyCode: code.value,
      verifyKey: verifyKey.value,
    })
    if (res.code === 200) {
      showSuccessToast('办理成功')
      code.value = ''
      verifyKey.value = null
      close()
    } else {
      showFailToast(res.msg || '办理失败，请稍后重试')
    }
  } catch (error) {
    console.error('请错误:', error)
    showFailToast('办理失败，请稍后重试')
  }
}, 1000)

defineExpose({
  open,
})

onBeforeUnmount(() => {
  resetTimer()
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
    background-color: #fff;
    border-radius: 25px;
    padding-left: 12.5px;
    margin: 22px 0 17px;
    box-sizing: border-box;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 8px;
    .code-btn {
      width: 41%;
      height: 100%;
      border-radius: 25px;
      background: #950e10;
      border: 0;
      color: #fff;
      font-size: 13px;
      font-weight: 500;
      box-sizing: border-box;
      flex: none;
    }
  }
  .code-input {
    flex: 1;
  }
  .code-input :deep(.van-cell) {
    padding: 0;
    background: transparent;
  }
  .code-input :deep(.van-field__body) {
    align-items: center;
  }
  .code-input :deep(.van-field__control) {
    font-size: 16px;
    font-weight: 600;
    color: #000;
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
