import request from "@/utils/request";

export default {
  getOrders() {
    return request({
      url: '/api/orders',
      method: 'get',
    })
  },
  addOrder(data) {
    return request({
      url: '/api/orders/',
      method: 'post',
      data,
    })
  },
  updateOrder(data, id) {
    return request({
      url: `/api/orders/${id}`,
      method: 'put',
      data,
    })
  },
  deleteOrder(id) {
    return request({
      url: `/api/orders/${id}`,
      method: 'delete',
    })
  },
}