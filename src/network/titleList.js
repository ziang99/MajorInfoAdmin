import { request } from "./request";

// 获取信息
export function getClassList() {
  return request({
    url: "/admin/grade",
    method: "get",
  });
}
// 添加学院
export function addGradeName(userForm) {
  return request({
    url: "/admin/grade",
    method: "post",
    data: userForm,
  });
}
// 根据id获取到该要修改的学院名称
export function getGradeName(id) {
  return request({
    url: `/admin/grade/${id}`,
    method: "get",
  });
}
// 修改学院名称
export function updataGrade(updataUserInfo) {
  return request({
    url: `/admin/grade`,
    method: "put",
    data: updataUserInfo,
  });
}
// 删除学院
export function delectGrade(id) {
  return request({
    url: `/admin/grade/${id}`,
    method: "delete",
  });
}

// 添加专业
export function addClassName(classForm) {
  return request({
    url: "/admin/grade",
    method: "post",
    data: classForm,
  });
}
// 根据id获取到该要修改的专业名称
export function getClassName(id) {
  return request({
    url: `/admin/grade/${id}`,
    method: "get",
  });
}
// 修改专业名称
export function updataClass(updataClassInfo) {
  return request({
    url: "/admin/grade",
    method: "put",
    data: updataClassInfo,
  });
}
// 删除专业
export function delectClass(id) {
  return request({
    url: `/admin/grade/${id}`,
    method: "delete",
  });
}

