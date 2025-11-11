import axios from 'axios'

const { VITE_APP_ENV, VITE_APP_API_BASE_URL, VITE_APP_BASE_API } = import.meta.env

const baseURL =
  VITE_APP_ENV === 'production'
    ? `${VITE_APP_API_BASE_URL}${VITE_APP_BASE_API}`
    : VITE_APP_API_BASE_URL

const service = axios.create({
  baseURL,
  timeout: 10000,
})

service.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
)

export default service
