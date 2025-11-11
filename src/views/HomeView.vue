<template>
  <div class="page">
    <img class="banner" src="../assets/home-banner.png" alt="" />
    <div class="scroll-container">
      <div class="auto-scroll">
        <div v-for="(item, i) in scrollingItems" :key="'src-' + i" class="scroll-item">
          {{ item }} 抢到了
        </div>
        <!-- 复制一份，实现无缝 -->
        <div v-for="(item, i) in scrollingItems" :key="'copy-' + i" class="scroll-item">
          {{ item }} 抢到了
        </div>
      </div>
    </div>
    <div class="gif">
      <img class="gif-img" src="../assets/home-hand.gif" alt="" />
      <span class="rainbow">第一步：输入手机号</span>
    </div>
    <el-input
      v-model="phone"
      type="number"
      maxlength="11"
      class="phone-input"
      placeholder="请输入您的手机号"
    />
    <div class="agree-row">
      <el-checkbox v-model="agree" class="circle-checkbox">
        我已阅读并同意
        <span class="privacy-text" @click.stop="openPersonal">《个人信息收集证明》</span>
      </el-checkbox>
    </div>
    <div class="btn-container">
      <img class="btn" src="../assets/home-btn.gif" alt="" @click="submit" />
    </div>
    <img class="desc" src="../assets/home-desc.png" alt="" />
    <img class="footer" src="../assets/index-footer.png" alt="" />
    <personal-information ref="personalInformationRef" @agree="handleAgree" />
    <agree-dialog ref="agreeDialogRef" @agree="handleAgree(true)" />
    <ConfirmOrder ref="confirmOrderRef" />
  </div>
</template>
<script setup>
import { ref, getCurrentInstance } from 'vue'
import personalInformation from '@/components/personal-information.vue'
import axios from 'axios'
import { throttle } from 'lodash'
import { ElMessage } from 'element-plus'
import AgreeDialog from '../components/agree-dialog.vue'
import { validPhone } from '@/utils/rule'
import ConfirmOrder from '@/components/confirm-order.vue'

const { VITE_APP_ENV, VITE_APP_API_BASE_URL, VITE_APP_BASE_API } = import.meta.env
axios.defaults.baseURL =
  VITE_APP_ENV === 'production' ? VITE_APP_API_BASE_URL + VITE_APP_BASE_API : VITE_APP_API_BASE_URL
const { proxy } = getCurrentInstance()
const phone = ref('')
const agreeDialogRef = ref(null)
const agree = ref(false)
const personalInformationRef = ref(null)
const scrollingItems = ref([
  '150****2110',
  '134****1118',
  '136****3002',
  '178****8793',
  '135****0173',
  '139****9308',
  '138****5666',
  '158****3701',
  '136****7788',
  '198****5523',
])

const submit = throttle(async () => {
  const isValid = await validPhone(phone.value)
  if (!isValid) return // 校验不通过，直接结束

  if (!agree.value) {
    agreeDialogRef.value.openDialog()
    return
  }
  try {
    const res = await axios.get('/api/bizHandle/getProduct', {
      params: {
        mobile: phone.value,
      },
    })
    if (res.data.code === 200) {
      const data = {
        productId: res.data.data.productId,
        phone: phone.value,
        productDescribe: res.data.data.productDescribe,
      }
      proxy.$refs.confirmOrderRef.open(data)
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

const openPersonal = () => {
  personalInformationRef.value.openDialog()
}

const handleAgree = (e) => {
  agree.value = e
  if (e == true && phone.value) submit()
}
</script>
<style scoped>
img {
  display: block;
}

.footer {
  width: 100%;
  height: auto;
}

.desc {
  width: 100%;
  height: auto;
  margin-top: 30vw;
}

.btn-container {
  position: relative;
  display: flex;
  justify-content: center;
}

.btn {
  width: 85%;
  height: auto;
  position: absolute;
  top: -10vw;
  z-index: 0;
}

.gif {
  display: flex;
  align-items: center;
  padding-left: calc(5% + 15px);
}

.rainbow {
  animation: rainbow 5s ease infinite;
  -webkit-animation: rainbow 5s ease infinite;
  background-image: linear-gradient(
    90deg,
    red,
    #ff9a00 10%,
    #d0de21 20%,
    #4fdc4a 30%,
    #3fdad8 40%,
    #2fc9e2 50%,
    #1c7fee 60%,
    #5f15f2 70%,
    #ba0cf8 80%,
    #fb07d9 90%,
    red
  );
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-size: 200% auto;
  color: transparent;
  font-size: 20px;
  font-weight: 700;
}

@keyframes rainbow {
  0% {
    background-position: 0;
  }
  100% {
    background-position: 200%;
  }
}

.gif-img {
  width: 13%;
  height: auto;
  transform: rotate(180deg);
}

.phone-input {
  width: 90%;
  margin-left: 5%;
  font-size: 16px;
  position: relative;
  z-index: 99;
}

.phone-input :deep(.el-input__wrapper) {
  height: 12vw;
  padding: 0 5vw;
  border-radius: 6.5vw;
}

.phone-input :deep(.el-input__inner) {
  font-weight: 900;
  color: #000;
}

.page {
  width: 100vw;
  height: 100vh;
  background-color: #d13042;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
}

.banner {
  width: 100%;
  height: auto;
}

.scroll-container {
  width: 100%;
  overflow: hidden;
  margin-top: 2vw;
}

/* 滚动轨道：两份内容排成一行，做无缝循环 */
.auto-scroll {
  display: inline-flex;
  align-items: center;
  width: max-content;
  animation: marquee 15s linear infinite;
  will-change: transform;
}

/* 鼠标悬停暂停（纯 CSS） */
/* .scroll-container:hover .auto-scroll {
  animation-play-state: paused;
} */

/* 单个胶囊 */
.scroll-item {
  background-color: rgba(0, 0, 0, 0.38);
  border-radius: 4vw;
  flex-shrink: 0;
  color: #fff;
  font-size: 14px;
  letter-spacing: 1px;
  opacity: 0.9;
  margin-right: 2.5vw;
  padding: 1.6vw;
  white-space: nowrap;
}

/* 核心：向左移动 50%（= 一份内容宽度），因为拼接了两份 */
@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.agree-row {
  width: 86%;
  margin-left: 7%;
  color: #fff;
  font-size: 16px;
  position: relative;
  z-index: 99;
}

:deep(.circle-checkbox .el-checkbox__inner) {
  border-radius: 50%; /* 改成圆形 */
}

:deep(.circle-checkbox .el-checkbox__label) {
  color: #fff;
  font-size: 16px;
}

.agree-row :deep(.is-checked) {
  --el-checkbox-checked-bg-color: #f1a90e;
  --el-checkbox-checked-icon-color: #fff;
  --el-checkbox-checked-input-border-color: #f1a90e;
}

.privacy-text {
  color: #f1a90e;
}
</style>
