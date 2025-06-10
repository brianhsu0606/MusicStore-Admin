import request from "@/utils/request";

export default {
  getMember() {
    return request({
      url: '/api/members',
      method: 'get',
    })
  },
  addMember(data) {
    return request({
      url: '/api/members',
      method: 'post',
      data,
    })
  },
  updateMember(id, data) {
    return request({
      url: `/api/members/${id}`,
      method: 'put',
      data,
    })
  },
  deleteMember(id) {
    return request({
      url: `/api/members/${id}`,
      method: 'delete',
    })
  },
}