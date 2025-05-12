import axios from "axios";
import { ElMessage } from 'element-plus'

const instance = axios.create()

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (res) => {
    const { code, message, result } = res.data
    if (code === 200) {
      return result
    }
    else {
      ElMessage.error(message || '網路錯誤')
      return Promise.reject(message || '網路錯誤')
    }
  }
)

const request = (config) => {
  config.method = config.method || 'get'
  return instance(config)
}
export default request