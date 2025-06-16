import request from "@/utils/request";

export default {
  getUserList() {
    return request({
      url: '/users',
      method: 'get',
    })
  },
  updateUser(id, data) {
    return request({
      url: `/users/${id}`,
      method: 'put',
      data
    })
  },
  deleteUser(id) {
    return request({
      url: `/users/${id}`,
      method: 'delete'
    })
  }
}