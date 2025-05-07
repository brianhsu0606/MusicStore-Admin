import request from "@/utils/request";

export default {
  getUsers() {
    return request({
      url: '/api/users',
      method: 'get',
    })
  },
  deleteUser(id) {
    return request({
      url: `/api/users/${id}`,
      method: 'delete'
    })
  },
  updateUser(id, data) {
    return request({
      url: `/api/users/${id}`,
      method: 'put',
      data
    })
  }
}