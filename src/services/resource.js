import { 
  GETRESOURCELIST,
  GETRESOURCELOGLIST,
  DELETERESOURCE,
  GETMARKLIST,
  GETMARKCOUNT,
  GETSINGLENUMBER,
  SETSINGLENUMBER,
  GETPHONELISTBYID,
  GETPHONENUMBER
} from '@/services/api'
import {request, METHOD} from '@/utils/request'

const BASE_URL = process.env.VUE_APP_API_BASE_URL;

/**
 * 获取资源列表
 * @param {*} parmas 
 * @returns 
 */
export async function getResourceList(parmas){
    return request(GETRESOURCELIST, METHOD.POST, parmas)
}

/**
 * 搜索手机号码
 * @param {*} content 
 * @returns 
 */
export async function searchPhoneNumber(content){
  return request(`${GETPHONENUMBER}?content=${content}`,METHOD.GET)
}

/**
 * 获取资源领取列表
 * @param {*} parmas 
 * @returns 
 */
 export async function getResourceLogList(parmas){
  return request(GETRESOURCELOGLIST, METHOD.POST, parmas)
}

/**
 * 删除资源
 * @param {*} params 
 * @returns 
 */
 export async function deleteResource(params) {
  return request(DELETERESOURCE, METHOD.GET, params)
}

/**
 * 获取标记列表
 * @returns 
 */
 export async function getMarkList() {
  return request(GETMARKLIST, METHOD.GET)
}
 
/**
 * 获取标记echarts统计
 * @returns 
 */
 export async function getMarkCount() {
  return request(GETMARKCOUNT, METHOD.GET)
}

/**
 * 获取单日领取上线
 * @returns 
 */
 export async function getSingleNumber() {
  return request(GETSINGLENUMBER, METHOD.GET)
}

/**
 * 设置单日领取上线
 * @returns 
 */
 export async function setSingleNumber(params) {
  return request(SETSINGLENUMBER, METHOD.GET,params)
}

/**
 * 根据密码获取手机号码列表
 * @param {*} parmas 
 * @returns 
 */
 export async function getPhoneListById(parmas){
  return request(GETPHONELISTBYID, METHOD.POST, parmas)
}

// 设置资源状态
export async function setResourceStatus(id){
  return request(`${BASE_URL}/Admin/SetResourceStatus?id=${id}`, METHOD.GET)
}

export default {
    getResourceList,
    getResourceLogList,
    deleteResource,
    getMarkList,
    getMarkCount,
    getSingleNumber,
    setSingleNumber,
    getPhoneListById,
    setResourceStatus,
    searchPhoneNumber
}