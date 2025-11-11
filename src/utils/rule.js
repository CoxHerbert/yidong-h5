import { showToast } from 'vant'

export const validPhone = async (value) => {
  const phoneReg = /^1[3-9]\d{9}$/
  if (!value) {
    showToast({ message: '请输入手机号码', type: 'fail' })
    return false
  }
  if (!phoneReg.test(value)) {
    showToast({ message: '请输入正确的手机号码', type: 'fail' })
    return false
  }
  return true
}
