import { ElMessage } from 'element-plus'

export const validPhone = async (value) => {
  const phoneReg = /^1[3-9]\d{9}$/
  if (!value) {
    ElMessage({ message: '请输入手机号码', type: 'warning' })
    return false
  }
  if (!phoneReg.test(value)) {
    ElMessage({ message: '请输入正确的手机号码', type: 'warning' })
    return false
  }
  return true
}
