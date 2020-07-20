import { request } from "./request"

// 获取用户列表信息
export function getUserInfo() {
  return request({
    url: "/admin/user/info",
    method: "get"
  })
}
