
/* eslint semi: ["error", "always"] */
import httpRequest from '@/utils/httpRequest';

// 获取支持的作业项
export function listEntry (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/studio/entries'),
    method: 'get',
    params: httpRequest.adornParams(params)
  });
}
// 获取支持的编码
export function encodings (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/studio/encodings'),
    method: 'get',
    params: httpRequest.adornParams(params)
  });
}
// 获取支持的数据类型
export function valueMetas (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/studio/value-metas'),
    method: 'get',
    params: httpRequest.adornParams(params)
  });
}
// 获取支持的数据格式
export function valueFormats (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/studio/value-formats'),
    method: 'get',
    params: params
  });
}
// 获取支持的转换插件
export function listStep (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/studio/steps'),
    method: 'get',
    params: httpRequest.adornParams(params)
  });
}
// 获取支持的计算类型
export function calculator (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/studio/calculator-functions'),
    method: 'get',
    params: params
  });
}
// 获取Execl支持的格式
export function spreadSheetTypes (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/studio/spread-sheet-types'),
    method: 'get',
    params: params
  });
}
// 获取去空格的类型
export function trimTypes (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/studio/trim-types'),
    method: 'get',
    params: params
  });
}
// 获取支持格式
export function formats (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/studio/formats'),
    method: 'get',
    params: params
  });
}
// 获取支持压缩格式
export function compressionProviders (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/studio/compression-providers'),
    method: 'get',
    params: params
  });
}
// 获取支持压缩格式
export function digits (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/studio/digits'),
    method: 'get',
    params: params
  });
}
// 获取Mask
export function escapeMasks (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/studio/escape-masks'),
    method: 'get',
    params: params
  });
}
// 获取special-characters
export function specialCharacters (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/studio/special-characters'),
    method: 'get',
    params: params
  });
}
// 获取paddings
export function paddings (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/studio/paddings'),
    method: 'get',
    params: params
  });
}
// 获取timezones
export function timezones (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/studio/timezones'),
    method: 'get',
    params: params
  });
}
// 获取locales
export function locales (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/studio/locales'),
    method: 'get',
    params: params
  });
}
