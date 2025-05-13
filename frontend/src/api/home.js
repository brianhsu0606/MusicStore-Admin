import request from "@/utils/request";

export default {
  getChartData() {
    return request({
      url: '/api/dashboard/chart-data',
      method: 'get',
    });
  },
}