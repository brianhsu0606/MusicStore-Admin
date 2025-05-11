import request from "@/utils/request";

export default {
  getRevenue() {
    return request({
      url: '/api/revenues',
      method: 'get'
    })
  },
  addRevenue(data) {
    return request({
      url: '/api/revenues',
      method: 'post',
      data
    })
  },
  deleteRevenue(id) {
    return request({
      url: `/api/revenues/${id}`,
      method: 'delete'
    })
  }
}