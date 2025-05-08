import request from "@/utils/request";

export default {
  getCost() {
    return request({
      url: '/api/costs',
      method: 'get'
    })
  },
  addCost(data) {
    return request({
      url: '/api/costs',
      method: 'post',
      data
    })
  },
  deleteCost(id) {
    return request({
      url: `/api/costs/${id}`,
      method: 'delete',
    })
  },
}