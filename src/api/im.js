import { http } from './request'
const imUrl = 'https://fc-mp-f4cd065e-98aa-41d7-a313-195d7685e535.next.bspapp.com/http';

export default {
    // 用户登录
    registerImUser:(params) => http(`${imUrl}/uni-id-co/registerUser`,'POST',params),
    // 获取聊天记录列表
    getMessageList:(params) => http(`${imUrl}/IMGetMessageList`,'POST',params),
    // 清除所有聊天消息 
    clearAllMessage:() => http(`${imUrl}/IMClearAllMessage`,'GET'),
    // 删除IM用户
    deleteUserById:(params) => http(`${imUrl}/IMDeleteUser`,'POST',params),
}