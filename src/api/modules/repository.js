/* eslint semi: ["error", "always"] */
import httpRequest from '@/utils/httpRequest';

// 获取目录、转换及作业
export function list (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/repository'),
    method: 'get',
    params: httpRequest.adornParams(params, 'get')
  });
}
// 获取目录
export function listRepository (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/repository/directories'),
    method: 'get',
    params: httpRequest.adornParams(params, 'get')
  });
}
// 创建目录
export function create (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/repository/directories'),
    method: 'post',
    data: httpRequest.adornParams(params)
  });
}
// 删除目录
export function delDirectories (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/repository/directories'),
    method: 'delete',
    params: httpRequest.adornParams(params, 'delete')
  });
}
// 修改目录名称
export function renameDirectory (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/repository/directories/name'),
    method: 'put',
    data: httpRequest.adornParams(params)
  });
}
// 打开转换
export function trans (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/repository/trans'),
    method: 'get',
    params: httpRequest.adornParams(params, 'get')
  });
}
// 修改转换名称
export function renameTrans (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/repository/trans/name'),
    method: 'put',
    data: httpRequest.adornParams(params)
  });
}
// 删除转换
export function delTrans (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/repository/trans'),
    method: 'delete',
    params: httpRequest.adornParams(params, 'delete')
  });
}
// 打开作业
export function jobs (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/repository/jobs'),
    method: 'get',
    params: httpRequest.adornParams(params, 'get')
  });
}
// 修改作业名称
export function renameJobs (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/repository/jobs/name'),
    method: 'put',
    data: httpRequest.adornParams(params)
  });
}
// 删除作业
export function delJobs (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/repository/jobs'),
    method: 'delete',
    params: httpRequest.adornParams(params)
  });
}
// 获取数据库连接列表
export function databases (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/repository/databases'),
    method: 'get',
    params: httpRequest.adornParams(params)
  });
}
