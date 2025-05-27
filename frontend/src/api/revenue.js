import request from "@/utils/request";

export default {
  getRevenue() {
    return request({
      url: '/api/revenues',
      method: 'get',
    })
  },
  addRevenue(data) {
    return request({
      url: '/api/revenues',
      method: 'post',
      data
    })
  },
  updateRevenue(id, data) {
    return request({
      url: `/api/revenues/${id}`,
      method: 'put',
      data
    })
  },
  deleteRevenue(id) {
    return request({
      url: `/api/revenues/${id}`,
      method: 'delete',
    })
  }
}