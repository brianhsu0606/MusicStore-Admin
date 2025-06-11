import request from "@/utils/request";

export default {
  getUserList() {
    return request({
      url: '/api/users',
      method: 'get',
    })
  },
  updateUser(id, data) {
    return request({
      url: `/api/users/${id}`,
      method: 'put',
      data
    })
  },
  deleteUser(id) {
    return request({
      url: `/api/users/${id}`,
      method: 'delete'
    })
  }
}