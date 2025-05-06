import request from "@/utils/request";

export default {
  getUser() {
    return request({
      url: '/api/users',
      method: 'get',
      // headers: {
      //   Authorization: localStorage.getItem('token') // 一定要帶 token
      // }
    })
  }
}