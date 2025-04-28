import request from "@/utils/request";

export default {
  register(data) {
    return request({
      url: '/api/register',
      method: 'post',
      data,
    })
  },
  login(data) {
    return request({
      url: '/api/login',
      method: 'post',
      data,
    })
  },
}