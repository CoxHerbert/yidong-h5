<template>
  <div class="container">
    <div class="banner">
      <img class="banner-img" src="../assets/index-banner.png" alt="" />
      <div class="banner-content">
        <img class="img1" src="../assets/index-img1.png" alt="" />
        <img class="img2" src="../assets/index-img2.png" alt="" />
        <div class="label1">24.9元/月，合约期36个自然月（含当月）</div>
        <div class="label2">
          <img src="../assets/index-hand.png" alt="" />
          <span>第1步 输入手机号</span>
        </div>
        <div class="input">
          <van-field
            v-model="phone"
            type="tel"
            maxlength="11"
            class="phone-input"
            placeholder="请输入您的手机号"
          />
        </div>
        <img class="btn" src="../assets/index-btn1.gif" alt="" @click="submit" />
        <div class="desc">
          <van-checkbox v-model="agree">
            我已阅读并同意
            <span @click.stop="openPersonal">《个人信息收集证明》</span>
          </van-checkbox>
        </div>
      </div>
    </div>
    <div class="rule-container">
      <img class="img3" src="../assets/index-img3.png" alt="" />
      <img class="img3" src="../assets/index-img4.png" alt="" />
      <img class="img3" src="../assets/index-img5.png" alt="" />
      <div class="rule-item">
        <img src="../assets/index-time.png" alt="" />
        <span>客服工作时间</span>
        周一至周五 9:00-17:30
      </div>
    </div>
    <img class="footer" src="../assets/index-footer.png" alt="" />
    <personal-information ref="personalInformationRef" @agree="handleAgree" />
    <agree-dialog ref="agreeDialogRef" @agree="handleAgree(true)" />
    <ConfirmOrder ref="confirmOrderRef" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import personalInformation from '@/components/personal-information.vue'
import { throttle } from 'lodash'
import { showFailToast } from 'vant'
import AgreeDialog from '../components/agree-dialog.vue'
import { validPhone } from '@/utils/rule'
import ConfirmOrder from '@/components/confirm-order.vue'
import { getProduct } from '@/api/bizHandle'

const { proxy } = getCurrentInstance()
const phone = ref('')
const agreeDialogRef = ref(null)
const agree = ref(false)
const personalInformationRef = ref(null)

const submit = throttle(async () => {
  const isValid = await validPhone(phone.value)
  if (!isValid) return // 校验不通过，直接结束

  if (!agree.value) {
    agreeDialogRef.value.openDialog()
    return
  }
  try {
    const res = await getProduct({
      mobile: phone.value,
    })
    if (res.code === 200) {
      const data = {
        productId: res.data.data.productId,
        phone: phone.value,
        productDescribe: res.data.data.productDescribe,
      }
      proxy.$refs.confirmOrderRef.open(data)
    } else {
      showFailToast(res.msg || '获取产品信息失败，请稍后重试')
    }
  } catch (error) {
    console.error('请求错误:', error)
    showFailToast('获取产品信息失败，请稍后重试')
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

<style scoped lang="scss">
img {
  display: block;
}
.footer {
  width: 100%;
  height: auto;
}
.rule-container {
  width: 100%;
  background: linear-gradient(180deg, #ff373f 0%, #ff272f 100%);
  padding-top: 24px;
  padding-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .img3 {
    width: 88%;
    height: auto;
    margin-bottom: 29px;
  }
  .rule-item {
    width: 88%;
    height: 12.5vw;
    padding: 0 10px;
    border-radius: 8px;
    border: 1px solid #b71621;
    background: #fff;
    display: flex;
    align-items: center;
    color: #908f8f;
    font-size: 14px;
    font-weight: 300;
    box-sizing: border-box;
    img {
      width: 5.5%;
      height: auto;
      margin-right: 5px;
    }
    span {
      flex: 1;
      color: #908f8f;
    }
  }
}
.btn {
  width: 70%;
  height: auto;
  z-index: 0;
  position: relative;
  margin-top: 10px;
}
.desc {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: -34px;
  :deep(.van-checkbox__label) {
    color: rgba(18, 18, 18, 0.9);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.4px;
    span {
      color: #fff;
    }
  }
}
.input {
  display: flex;
  align-items: center;
  width: 88%;
  height: 12vw;
  box-sizing: border-box;
  z-index: 99;
  .phone-input {
    height: 100%;
    flex: 1;
    font-size: 16px;
    letter-spacing: 1px;
  }
  .phone-input :deep(.van-cell) {
    padding: 0 13px;
    border-radius: 25px;
  }
  .phone-input :deep(.van-field__control) {
    font-weight: 900;
    color: #000;
  }
}
.banner {
  width: 100%;
  height: 166vw;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  .banner-img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }
  .banner-content {
    width: 100%;
    z-index: 9;
    display: flex;
    flex-direction: column;
    align-items: center;
    .img1 {
      width: 88%;
      height: auto;
      margin-top: 10px;
      margin-bottom: 8px;
    }
    .img2 {
      width: 86%;
      height: auto;
    }
    .label1 {
      -webkit-text-stroke-width: 1px;
      -webkit-text-stroke-color: #ff9500;
      font-size: 15px;
      font-weight: 600;
      line-height: normal;
      letter-spacing: 1px;
      background: linear-gradient(180deg, #ff7979 0%, #f22 118.52%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-align: center;
      margin: 6px 0 13px;
    }
    .label2 {
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 6px;
      img {
        width: 5.5%;
        height: auto;
        margin-left: 38px;
      }
      span {
        font-size: 13px;
        font-weight: 500;
        background: linear-gradient(
          94deg,
          #5773ff 1.41%,
          #ff7415 1.42%,
          #ff52ee 24.21%,
          #68c0ff 39.85%,
          #ff1fec 58.63%,
          #00e5ff 81.87%,
          #5367ff 84.55%,
          #5b45ff 94.38%
        );
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
}
.container {
  width: 100vw;
  overflow-y: scroll;
}
</style>
