import request from "@/utils/request";

export default {
  getCostList() {
    return request({
      url: '/costs',
      method: 'get'
    })
  },
  addCost(data) {
    return request({
      url: '/costs',
      method: 'post',
      data
    })
  },
  updateCost(id, data) {
    return request({
      url: `/costs/${id}`,
      method: 'put',
      data
    })
  },
  deleteCost(id) {
    return request({
      url: `/costs/${id}`,
      method: 'delete',
    })
  },
}