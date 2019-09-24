/* eslint semi: ["error", "always"] */
import httpRequest from '@/utils/httpRequest';

// 获取数据库支持的访问方式: 如 JDBC, JNDI或ODBC
export function accessTypes (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/database/accessTypes'),
    method: 'get',
    params: httpRequest.adornParams(params)
  });
}
// 创建数据库连接
export function create (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/database/create'),
    method: 'post',
    params: httpRequest.adornParams(params)
  });
}
// 获取数据库配置项信息: 如 hostname, port, user, password等
export function databaseSetting (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/database/databaseSetting'),
    method: 'get',
    params: httpRequest.adornParams(params)
  });
}
// 获取支持的数据库类型: 如 KingbaseES, Oracle, MySQL等
export function databaseTypes (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/database/databaseSetting'),
    method: 'get',
    params: httpRequest.adornParams(params)
  });
}
// 删除数据库连接
export function remove (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/database/remove'),
    method: 'delete',
    params: httpRequest.adornParams(params)
  });
}
// 校验数据库配置信息
export function verify (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/database/verify'),
    method: 'post',
    params: httpRequest.adornParams(params)
  });
}
export function explorer (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/database/explorer-all'),
    method: 'get',
    params: params
  });
}
export function getSQL (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/database/get-sql'),
    method: 'get',
    params: params
  });
}
export function schemas (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/database/schemas'),
    method: 'get',
    params: params
  });
}
export function fields (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/database/fields'),
    method: 'get',
    params: params
  });
}
// 测试
export function test (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/database/test'),
    method: 'get',
    params: httpRequest.adornParams(params)
  });
}
