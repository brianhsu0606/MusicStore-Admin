import request from "@/utils/request";

export default {
  getProfile() {
    return request({
      url: '/api/profile',
      method: 'get',
    })
  },
  updateProfile(data) {
    return request({
      url: '/api/profile',
      method: 'put',
      data,
    })
  },
  getAvatars() {
    return request({
      url: '/api/profile',
      method: 'get',
    })
  },
}