import request from "@/utils/request";

export default {
  getMemberList() {
    return request({
      url: '/members',
      method: 'get',
    })
  },
  addMember(data) {
    return request({
      url: '/members',
      method: 'post',
      data,
    })
  },
  updateMember(id, data) {
    return request({
      url: `/members/${id}`,
      method: 'put',
      data,
    })
  },
  deleteMember(id) {
    return request({
      url: `/members/${id}`,
      method: 'delete',
    })
  },
}