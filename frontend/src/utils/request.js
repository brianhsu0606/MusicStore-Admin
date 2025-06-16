import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

instance.interceptors.request.use(

  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (res) => {
    const { code, message, result } = res.data

    if (code === 200) {
      return result
    } else {
      return Promise.reject(message || '網路錯誤')
    }
  },
  (error) => {
    if (!error.response) {
      return Promise.reject('無法連線到伺服器')
    }

    const status = error.response.status
    let msg = '發生錯誤，請稍後再試'

    if (status === 400) msg = '請求參數錯誤'
    if (status === 401) msg = '請先登入'
    if (status === 403) msg = '權限不足'
    if (status === 404) msg = '找不到資源'
    if (status >= 500) msg = '伺服器發生錯誤'

    if (error.response.data?.message) {
      msg = error.response.data.message
    }

    return Promise.reject(msg)
  }
)

const request = (config) => {
  return instance(config)
}

export default request