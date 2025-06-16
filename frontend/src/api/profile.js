import request from "@/utils/request";

export default {
  getProfile() {
    return request({
      url: '/profile',
      method: 'get',
    })
  },
  updateProfile(data) {
    return request({
      url: '/profile',
      method: 'put',
      data,
    })
  },
}