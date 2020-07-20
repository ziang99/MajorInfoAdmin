import { request } from "./request"

// 获取信息
export function getUserList () {
  return request({
    url: "/admin/manager",
    method: "get"
  })
}
// 删除管理员
export function delectUser(id) {
  return request({
    url: `/admin/manager/${id}`,
    method: "delete"
  });
}
// 添加管理员
export function addGradeName(userForm) {
  return request({
    url: `/admin/manager`,
    method: "post",
    data: userForm
  });
}
// 获取信息
export function getGradeName (id) {
  return request({
    url: `/admin/manager/${id}`,
    method: "get"
  })
}
// 修改专业名称
export function updataGrade(updataClassInfo) {
  return request({
    url: "/admin/manager",
    method: "put",
    data: updataClassInfo,
  });
}
