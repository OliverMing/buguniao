
import {request, METHOD} from '@/utils/request'
const BASE_URL = process.env.VUE_APP_API_BASE_URL;

/**
 *获取二维码列表
 * @param {*} parmas 
 * @returns 
 */
export async function getGameRecordList(parmas){
    return request(`${BASE_URL}/Admin/GetGameRecordList`, METHOD.POST, parmas)
}

export default {
    getGameRecordList
}