import request from "@/utils/request";

export default {
  getProductList() {
    return request({
      url: '/products',
      method: 'get'
    })
  },
  addProduct(data) {
    return request({
      url: '/products',
      method: 'post',
      data
    })
  },
  updateProduct(id, data) {
    return request({
      url: `/products/${id}`,
      method: 'put',
      data
    })
  },
  deleteProduct(id) {
    return request({
      url: `/products/${id}`,
      method: 'delete',
    })
  },
}