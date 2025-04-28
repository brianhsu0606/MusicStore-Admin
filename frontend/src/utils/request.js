import axios from "axios";
import { ElMessage } from 'element-plus'

const instance = axios.create()

// 請求攔截器
instance.interceptors.request.use(
  function (config) {
    // new
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 回應攔截器
instance.interceptors.response.use(
  (res) => {
    const { code, msg, result } = res.data
    // 先行判斷 code === 200，只回傳 result 物件，在前端就不用再判斷一次
    if (code === 200) {
      return result
    }
    else {
      ElMessage.error(msg || '網路錯誤')
      return Promise.reject(msg || '網路錯誤')
    }
  }
)

const request = (config) => {
  config.method = config.method || 'get'
  return instance(config)
}
export default request