/* eslint semi: ["error", "always"] */
import httpRequest from '@/utils/httpRequest';
// debug转换
export function debug (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/trans/debug'),
    method: 'post',
    params: httpRequest.adornParams(params)
  });
}
// 查看数据库连接
export function explore (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/trans/explore'),
    method: 'get',
    params: httpRequest.adornParams(params)
  });
}
// 分析转换对数据库的影响
export function impact (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/trans/impact'),
    method: 'post',
    params: httpRequest.adornParams(params)
  });
}
// 获取转换文件
export function ktr (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/trans/ktr'),
    method: 'post',
    data: params
  });
}
// 停止转换
export function pause (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/trans/pause'),
    method: 'post',
    params: httpRequest.adornParams(params)
  });
}
// 预览转换
export function preview (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/trans/preview'),
    method: 'post',
    params: httpRequest.adornParams(params)
  });
}
// 重放转换
export function replay (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/trans/replay'),
    method: 'post',
    params: httpRequest.adornParams(params)
  });
}
// 获取转换执行日志、状态及结果
export function executeResult (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/trans/result'),
    method: 'get',
    params: httpRequest.adornParams(params, 'get')
  });
}
// 执行转换
export function run (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/trans/run'),
    method: 'post',
    data: params
  });
}
// 保存转换
export function save (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/trans/save'),
    method: 'post',
    data: params
  });
}
// 显示执行结果面板
export function show (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/trans/show'),
    method: 'post',
    params: httpRequest.adornParams(params)
  });
}
// 获取运行转换需要的SQL
export function sql (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/trans/sql'),
    method: 'get',
    params: httpRequest.adornParams(params)
  });
}
// 停止转换
export function stop (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/trans/stop'),
    method: 'post',
    params: httpRequest.adornParams(params)
  });
}
// 校验转换
export function verify (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/trans/verify'),
    method: 'post',
    params: httpRequest.adornParams(params)
  });
}
// 测试
export function test (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/trans/test'),
    method: 'get',
    params: httpRequest.adornParams(params)
  });
}
// 获取字段
export function inputFields (params, stepName) {
  return httpRequest({
    url: httpRequest.adornUrl('/trans/input-fields'),
    method: 'POST',
    data: params,
    params: stepName
  });
}
// 获取输出字段
export function outPutFields (params, stepName) {
  return httpRequest({
    url: httpRequest.adornUrl('/trans/output-fields'),
    method: 'POST',
    data: params,
    params: stepName
  });
}
