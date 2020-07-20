import { request } from "./request";

// 获取柱状图信息
export function getBarInfo() {
  return request({
    url: "/admin/show/bar",
    method: "get"
  });
}