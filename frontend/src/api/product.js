import request from "@/utils/request";

export default {
  getProductList() {
    return request({
      url: '/api/products',
      method: 'get'
    })
  },
  addProduct(data) {
    return request({
      url: '/api/products',
      method: 'post',
      data
    })
  },
  updateProduct(id, data) {
    return request({
      url: `/api/products/${id}`,
      method: 'put',
      data
    })
  },
  deleteProduct(id) {
    return request({
      url: `/api/products/${id}`,
      method: 'delete',
    })
  },
}