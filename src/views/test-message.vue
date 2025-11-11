<template>
  <div class="page">
    <div class="input-content">
      <span> 商品编号 </span>
      <van-field
        v-model="productId"
        type="digit"
        maxlength="11"
        class="input"
        placeholder="请输入商品编号"
      />
    </div>
    <div class="input-content">
      <span> 手机号码 </span>
      <van-field
        v-model="phone"
        type="tel"
        maxlength="11"
        class="input"
        placeholder="请输入手机号码"
      />
    </div>
    <div class="btn" @click="getCode">
      {{ codeText }}
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { showFailToast, showSuccessToast, showToast } from 'vant'
import { validPhone } from '@/utils/rule'
import { sendVerifyCode } from '@/api/bizHandle'

const productId = ref('')
const phone = ref('')
const codeText = ref('发送验证码')

const getCode = async () => {
  if (!productId.value) {
    showToast({ message: '请输入商品编号', type: 'fail' })
    return
  }
  const isValid = await validPhone(phone.value)
  if (!isValid) return // 校验不通过，直接结束
  try {
    const res = await sendVerifyCode({
      mobile: phone.value,
      productId: productId.value,
    })
    if (res.code === 200) {
      showSuccessToast(res.msg || '验证码发送成功')
    } else {
      showFailToast(res.msg || '验证码发送失败')
    }
  } catch (error) {
    console.error('请求错误:', error)
    showFailToast('验证码发送失败，请稍后重试')
  }
}
</script>
<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-content {
  width: 90%;
  padding-top: 40px;
}

.input {
  width: 100%;
  height: 45px;
  line-height: 45px;
  background-color: #fff;
  border-radius: 25px;
  margin-top: 5px;
  box-sizing: border-box;
  z-index: 9999;
  display: flex;
  align-items: center;
}
.input :deep(.van-cell) {
  background: transparent;
  padding: 0 16px;
}

.input :deep(.van-field__control) {
  font-size: 16px;
}
.btn {
  margin-top: 40px;
  width: 200px;
  text-align: center;
  line-height: 40px;
  border-radius: 8px;
  background: #2380f2;
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.32px;
}
</style>
