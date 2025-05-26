import request from "@/utils/request";

export default {
  getReports() {
    return request({
      url: '/api/reports',
      method: 'get',
    })
  },
  addReport(data) {
    return request({
      url: '/api/reports',
      method: 'post',
      data
    })
  },
  updateReport(id, data) {
    return request({
      url: `/api/reports/${id}`,
      method: 'put',
      data
    })
  },
  deleteReport(id) {
    return request({
      url: `/api/reports/${id}`,
      method: 'delete',
    })
  }
}