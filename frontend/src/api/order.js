import request from "@/utils/request";

export default {
  getOrderList() {
    return request({
      url: '/orders',
      method: 'get',
    })
  },
  addOrder(data) {
    return request({
      url: '/orders/',
      method: 'post',
      data,
    })
  },
  updateOrder(id, data) {
    return request({
      url: `/orders/${id}`,
      method: 'put',
      data,
    })
  },
  deleteOrder(id) {
    return request({
      url: `/orders/${id}`,
      method: 'delete',
    })
  },
}