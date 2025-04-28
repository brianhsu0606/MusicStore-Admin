import request from "@/utils/request";

export default {
  getTableData() {
    return request({
      url: '/api/dashboard/table-data',
      method: 'get',
    });
  },
  getCountData() {
    return request({
      url: '/api/dashboard/count-data',
      method: 'get',
    });
  },
  getChartData() {
    return request({
      url: '/api/dashboard/chart-data',
      method: 'get',
    });
  },
}