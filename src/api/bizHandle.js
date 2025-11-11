import request from '@/utils/request'

export const getProduct = (params) =>
  request.get('/api/bizHandle/getProduct', { params })

export const sendVerifyCode = (params) =>
  request.get('/api/bizHandle/sendVerifyCode', { params })

export const confirmBook = (params) =>
  request.get('/api/bizHandle/confirmBook', { params })
