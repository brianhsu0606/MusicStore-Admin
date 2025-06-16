import request from "@/utils/request";

export default {
  getRevenueList() {
    return request({
      url: '/revenues',
      method: 'get',
    })
  },
  addRevenue(data) {
    return request({
      url: '/revenues',
      method: 'post',
      data
    })
  },
  updateRevenue(id, data) {
    return request({
      url: `/revenues/${id}`,
      method: 'put',
      data
    })
  },
  deleteRevenue(id) {
    return request({
      url: `/revenues/${id}`,
      method: 'delete',
    })
  }
}