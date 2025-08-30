
import {request, METHOD} from '@/utils/request'
const BASE_URL = process.env.VUE_APP_API_BASE_URL;

import { 
    UPLOADERCODE,
    GETERCODELIST
} from '@/services/api'

// 上传二维码
export async function uploadErcode(parmas){
    return request(UPLOADERCODE, METHOD.POST, parmas)
}

// 获取二维码列表
export async function getErcodeList(parmas){
    return request(GETERCODELIST, METHOD.POST, parmas)
}

//删除二维码
export async function deleteErcode(id){
    return request(`${BASE_URL}/Admin/DeleteErcode?id=${id}`, METHOD.GET)
}

// 获取二维码滚动用户列表
export async function getErcodeScrollList(parmas){
    return request(`${BASE_URL}/Admin/GetErcodeScrollList`, METHOD.POST, parmas)
}

//删除滚动用户
export async function deleteScrollUser(id){
    return request(`${BASE_URL}/Admin/DeleteErcodeScrollUser?id=${id}`, METHOD.GET)
}

export default {
    uploadErcode,
    getErcodeList,
    deleteErcode,
    getErcodeScrollList,
    deleteScrollUser
}