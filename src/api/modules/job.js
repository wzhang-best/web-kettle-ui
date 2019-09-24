/* eslint semi: ["error", "always"] */
import httpRequest from '@/utils/httpRequest';

// 查看数据库连接
export function explore (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/job/explore'),
    method: 'get',
    params: httpRequest.adornParams(params)
  });
}
// 暂停作业
export function pause (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/job/pause'),
    method: 'post',
    params: httpRequest.adornParams(params)
  });
}
// 重放作业
export function replay (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/job/replay'),
    method: 'post',
    params: httpRequest.adornParams(params)
  });
}
// 获取作业执行日志、状态及结果
export function executeResult (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/job/result'),
    method: 'get',
    params: httpRequest.adornParams(params, 'get')
  });
}
// 执行作业
export function save (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/job/save'),
    method: 'post',
    data: params
  });
}
// 执行作业
export function run (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/job/run'),
    method: 'post',
    data: params
  });
}
// 显示执行结果面板
export function show (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/job/show'),
    method: 'post',
    params: httpRequest.adornParams(params)
  });
}
// 获取运行作业需要的SQL
export function sql (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/job/sql'),
    method: 'post',
    params: httpRequest.adornParams(params)
  });
}
// 停止作业
export function stop (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/job/stop'),
    method: 'post',
    params: httpRequest.adornParams(params)
  });
}
// 获取作业文件
export function kjb (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/job/kjb'),
    method: 'post',
    data: params
  });
}
// 测试
export function test (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/job/test'),
    method: 'post',
    params: httpRequest.adornParams(params)
  });
}
