<template>
  <div class="page">
    <div class="input-content">
      <span> 商品编号 </span>
      <el-input
        v-model="productId"
        type="number"
        maxlength="11"
        class="input"
        placeholder="请输入商品编号"
      />
    </div>
    <div class="input-content">
      <span> 手机号码 </span>
      <el-input
        v-model="phone"
        type="number"
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
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { validPhone } from '@/utils/rule'

const productId = ref('')
const phone = ref('')
const codeText = ref('发送验证码')

const getCode = async () => {
  if (!productId.value) {
    ElMessage({
      message: '请输入商品编号',
      type: 'warning',
    })
    return
  }
  const isValid = await validPhone(phone.value)
  if (!isValid) return // 校验不通过，直接结束
  try {
    const res = await axios.get('/api/bizHandle/sendVerifyCode', {
      params: {
        mobile: phone.value,
        productId: productId.value,
      },
    })
    if (res.data.code === 200) {
      ElMessage({
        message: res.data.msg,
        type: 'success',
      })
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
