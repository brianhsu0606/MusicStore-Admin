import request from "@/utils/request";

export default {
  register(data) {
    return request({
      url: '/register',
      method: 'post',
      data,
    })
  },
  login(data) {
    return request({
      url: '/login',
      method: 'post',
      data,
    })
  },
}