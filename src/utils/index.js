import Vue from 'vue'
import router from '@/router'
import store from '@/store'

/**
 * 获取uuid
 */
export function getUUID () {
  function S4 () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4())
}

var ModelIDList = {'库': '00010001', '表': '00010002', '视图': '00010003', '目录': '00020001', '服务': '00030001'}
export function getModelID (key) {
  if (!key) {
    key = '库'
  }
  return ModelIDList[key]
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 树形数据转换
 * @param data
 * @param id
 * @param pid
 * @param ext
 * @returns {Array}
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId', ext) {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    if (ext) {
      data[i]['ext'] = ext
    }
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 + * 清除登录信息
 + */
export function clearLoginInfo () {
  Vue.cookie.delete('token')
  store.commit('resetStore')
  router.options.isAddDynamicMenuRoutes = false
}
