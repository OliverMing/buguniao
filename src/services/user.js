import {LOGIN, GETUSERLIST,ADDUSER,DELETEUSER} from '@/services/api'
import {request, METHOD, removeAuthorization} from '@/utils/request'

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(name, password) {
  console.info(LOGIN);
  return request(LOGIN, METHOD.GET, {
    account: name,
    pwd: password
  })
}

/**
 * 获取用户列表
 * @param {*} params 
 * @returns 
 */
export async function getUserList(params) {
  return request(GETUSERLIST, METHOD.GET, params)
}

/**
 * 添加用户
 * @param {*} params 
 * @returns 
 */
 export async function addUser(params) {
  return request(ADDUSER, METHOD.POST, params)
}

/**
 * 删除用户
 * @param {*} params 
 * @returns 
 */
 export async function deleteUser(params) {
  return request(DELETEUSER, METHOD.GET, params)
}

/**
 * 退出登录
 */
export function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  localStorage.removeItem(process.env.VUE_APP_USER_KEY)
  removeAuthorization()
}
export default {
  login,
  logout,
  getUserList,
  addUser,
  deleteUser
}
