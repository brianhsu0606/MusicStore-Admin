import axios from "axios";

const instance = axios.create()

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
    return Promise.reject(error)
  }
)

const request = (config) => {
  return instance(config)
}

export default request