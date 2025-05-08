import request from "@/utils/request";

export default {
  getRevenue() {
    return request({
      url: '/api/revenue',
      method: 'get'
    })
  },
  addRevenue(data) {
    return request({
      url: '/api/revenue',
      method: 'post',
      data
    })
  },
  deleteRevenue(id) {
    return request({
      url: `/api/revenue/${id}`,
      method: 'delete'
    })
  }
}