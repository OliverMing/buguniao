import { http } from './request'

export default {
    // 用户登录
    login:(params) => http('/Admin/Login','POST',params),
    // 获取所有资源池
    GetAllResourceList:() => http('/Anp/GetAllResourceList','GET'),
    // 获取资源池列表
    GetResourceList:(params) => http('/Anp/GetResourceList','POST',params),
    // 获取标记列表
    GetMarkList:() => http('/Anp/GetMarkList','POST'),
    // 获取领取列表
    GetPoolHaveUserList:(params) => http('/Anp/GetPoolHaveUserList','POST',params),
    // 获取资源池所有
    GetAllPool:()=> http(`/Anp/GetAllPool`,'GET'),
    // 图形统计
    GetMarkCount:()=> http(`/Anp/GetMarkCount`,'GET'),
    // 获取用户列表
    GetUserList:(params) => http('/Anp/GetUserList','POST',params),
    // 新增用户
    insertUser:(params) => http('/Anp/AddUser','POST',params),
    // 删除用户
    deleteUser:(params) => http('/Anp/DeleteUser','POST',params),
    // 获取回收池数据大概列表
    GetRecycleStatisticsList:(id) => http(`/Anp/GetRecycleStatisticsList?id=${id}`,'GET'),
    // 修改回收池可领取的标记数据字段
    UpdateRecycleGetMark:(params) => http(`/Anp/UpdateRecycleGetMark`,'POST',params),
    //获取批次详情列表
    GetBatchInfoList:(params) => http(`/Anp/GetBatchInfoList`,'POST',params),
    // 获取全部用户 
    GetAllUserList:() => http(`/Anp/GetAllUserList`,'GET'),
    // 资源池禁用与解禁
    UpdatePoolStatus:(id) => http(`/Anp/UpdatePoolStatus?id=${id}`,'GET'),
    // 删除资源
    DeletePool:(id) => http(`/Anp/DeletePool?id=${id}`,'GET'),
    // 模糊搜索手机号码
    GetPhoneNumber:(content) => http(`/Anp/GetPhoneNumber?content=${content}`,'GET'),
    // 获取历史流转记录
    GetHistoryRecord:(phone) => http(`/Anp/GetHistoryRecord?phone=${phone}`,'GET'),
    // 删除手机号码
    DelPhone:(phone) => http(`/Anp/DelPhone?phone=${phone}`,'GET'),
    // 设置单日领取上线
    SetDailyReceiveMax:(count) => http(`/Anp/SetDailyReceiveMax?count=${count}`,'GET'),
    // 获取单日领取上线
    GetDailyReceiveMax:() => http(`/Anp/GetDailyReceiveMax`,'GET'),
    // 修改资源池名字
    UpdateResourceName:(id,mark) => http(`/Anp/UpdateResourceName?id=${id}&mark=${mark}`,'GET'),
    

    
    // 获取版本列表
    GetVersionlist:(params) => http('/Admin/GetVersionlist','POST',params),
    // 上传新版本
    UploadAppPackage:(params) => http('/Admin/UploadAppPackage','POST',params),
    // 删除版本
    DeleteVersion:(id)=> http(`/Admin/DeleteVersion?id=${id}`,'GET'),

    // 禁用与启用二维码
    forbitErcode:(id) => http(`/Admin/forbitErcode?id=${id}`,'GET'),
    // 获取比例权重二维码列表
    GetRatioErcodeList:(channel) => http(`/Admin/GetRatioErcodeList?channel=${channel}`,'GET'),
    // 删除比例权重二维码
    DeleteRationErcode:(id) => http(`/Admin/DeleteRationErcode?id=${id}`,'GET'),
    // 获取分组列表
    GetGroupList:() => http(`/Admin/GetGroupList`,'GET'),

    // 获取聊天室列表（根据当前用户ID）
    getLiveRoomList:(id) => http(`/Admin/getLiveRoomList?userId=${id}`,'GET'),
    getLiveRoomListAll:() => http(`/Admin/getLiveRoomListAll`,'GET'),
    updateLiveRoom:(params) => http(`/Admin/updateLiveRoom`,'POST',params),
    deleteLiveRoom:(code) => http(`/Admin/DeleteLiveRoom?code=${code}`,'GET'),
    changeForbitStatus:(params) => http(`/Admin/ChangeForbitStatus`,'POST',params),
    getliveChatList:(params) => http(`/Admin/GetliveChatList`,'POST',params),
    updateLiveChat:(params) => http(`/Admin/UpdateLiveChat`,'POST',params),
    deleteLiveChat:(id) => http(`/Admin/DeleteLiveChat?id=${id}`,'GET'),

    // 新增消息
    InsertMessage:(params) => http(`/Live/InsertChat`,'POST',params),
    // 获取存在角色的用户列表
    GetRoleUserList:() => http(`/Admin/GetRoleUserList`,'POST'),
     // 获取部门列表
     GetAllDepartmentList:() => http(`/Admin/GetDepartmentList`,'GET'),
     // 新增部门
     AddDeparment:(params) => http(`/Admin/AddDepartment`,'POST',params),
     // 根据ID获取权限
     GetLimitById:(id) => http(`/Admin/GetLimitById?id=${id}`,'GET'),
     // 设置权限
     SetLimitById:(params) => http(`/Admin/SetLimitById`,'POST',params),
    // 获取获客助手列表
    GetCustomShareList:(type = 0,pageId,pageSize) => http(`/Anp/GetCustomShareList?type=${type}&pageId=${pageId}&pageSize=${pageSize}`,'POST'),
    // 删除获客助手
    delCustomShare:(id) => http(`/Anp/delCustom?id=${id}`,'POST'),
    // 设置获客助only
    setCustomOnly:(id,status) => http(`/Anp/setOnlyCustom?id=${id}&status=${status}`,'GET'),
    // 获取获客助手列表
    getRationErcodeUserList:(params) => http(`/Admin/GetRationErcodeUserList`,'POST',params),
    // 获取聊天室用户列表
    GetLiveUserList:(params) => http(`/Admin/GetLiveUserList`,'POST',params),
    // 设置用户黑名单状态
    SetUserBlackStatus:(id,status) => http(`/Admin/SetUserBlackStatus?chat_id=${id}&is_black=${status}`,'POST'),
    // 更新聊天室用户信息
    UpdateLiveUser:(params) => http(`/Admin/UpdateLiveUsersInfo`,'POST',params),
     // 新增聊天室用户
    InsertLiveUser:(params) => http(`/Admin/InsertLiveUser`,'POST',params),
    // 获取聊天室角色列表
    GetLiveRoleList:() => http(`/Admin/GetLiveRoleList`,'GET'),
    // 新增聊天室角色
    AddLiveRole:(params) => http(`/Admin/InsertLiveRole`,'POST',params),
    // 更新聊天室角色
    UpdateLiveRole:(params) => http(`/Admin/UpdateLiveRole`,'POST',params),
    // 删除聊天室角色
    DeleteLiveRole:(id) => http(`/Admin/DeleteLiveRole?id=${id}`,'GET'),
    // 查询战绩回顾
    SelectLivePerformance:(id) => http(`/Admin/SelectLivePerformance?id=${id}`,'GET'),
    // 编辑战绩回顾
    UpdateLivePerformance:(params) => http(`/Admin/UpdateLivePerformance`,'POST',params),
    // 更新聊天室
    UpdateLiveRoom:(params) => http(`/Admin/UpdateLiveRoom`,'POST',params),
    // 新增聊天室
    AddLiveRoom:(params) => http(`/Admin/AddLiveRoom`,'POST',params),
    // 获取聊天室在线人数 
    GetOnlineChatNumber:code => http(`//y8.gir666.top:8182/api/online?code=${code}`,'GET'),
    // 获取每日福利推送列表
    GetLiveRoomEaeryList:(code) => http(`/Admin/GetLiveRoomEaeryList?code=${code}`,'GET'),
    // 新增每日福利
    AddLiveRoomEaery:(params) => http(`/Admin/AddLiveRoomEaery`,'POST',params),
    // 删除每日福利
    DeleteLiveRoomEaery:(id) => http(`/Admin/DeleteLiveRoomEaery?id=${id}`,'GET'),
    // 更新每日福利
    UpdateLiveRoomEaery:(params) => http(`/Admin/UpdateLiveRoomEaery`,'POST',params),
    // 获取单聊消息列表
    GetSingleChatList:(params) => http(`/Live/GetSingleChatList`,'POST',params),
    // 新增单聊消息 
    InsertSingleChat:(params) => http(`/Live/InsertSingleChat`,'POST',params),
    // 获取单聊会话列表
    GetConversationList:(id) => http(`/Live/GetConversationList?id=${id}`,'POST'),
    // 获取VIP直播室列表
    GetVipLiveRoomList:(id) => http(`/Admin/getVipLiveRoomList?userId=${id}`,'GET'),
    // 获取所有单聊消息列表
    GetAllSingleChatList:(params) => http(`/Admin/GetSingleChatList`,'POST',params),
    
    // 获取聊天室分享配置列表
    GetLiveShareConfigList:() => http(`/Admin/GetLiveShareConfigList`,'GET'),
    // 新增聊天室分享配置
    AddLiveShareConfig:(params) => http(`/Admin/AddLiveShareConfig`,'POST',params),
    // 删除聊天室分享配置
    DeleteLiveShareConfig:(id) => http(`/Admin/DeleteLiveShareConfig?id=${id}`,'GET'),
    // 更新聊天室分享配置
    UpdateLiveShareConfig:(params) => http(`/Admin/UpdateLiveShareConfig`,'POST',params),
    // 批量发送模板消息，参数 openids 为逗号分隔的 openid 字符串
    SendTemplateMessage:(params) => http(`/Admin/SendTemplateMessage`,'POST',params),
    
    // 聊天文件管理
    // 获取聊天文件列表
    GetChatFileList:(params) => http('/Admin/GetChatFileList','POST',params),
    // 获取聊天文件列表
    GetChatFileTypeList:() => http('/Admin/GetChatFileTypeList','POST'),
    // 添加聊天文件记录
    AddChatFile:(params) => http('/Admin/AddChatFile','POST',params),
    // 删除聊天文件
    DeleteChatFile:(id) => http(`/Admin/DeleteChatFile?id=${id}`,'GET'),



    // VIP课程管理
    // 获取VIP课程列表
    GetVipCourseList:(params) => http('/Admin/GetVipCourseList','POST',params),
    // 添加VIP课程
    AddVipCourse:(params) => http('/Admin/AddVipCourse','POST',params),
    // 删除VIP课程
    DeleteVipCourse:(id) => http(`/Admin/DeleteVipCourse?id=${id}`,'GET'),
    // 更新VIP课程
    UpdateVipCourse:(params) => http('/Admin/UpdateVipCourse','POST',params),
    // 获取VIP课程阅读量列表
    GetVipFileReadList:(params) => http('/Admin/GetVipFileReadList','POST',params),

    // 金仓财道接口-------------------------------------------------------------------------

    // 获取所有金仓财道关注用户
    getAllWeChatUsersAsync:() => http(`/Wechat/GetAllWeChatUsersAsync`,'GET'),
    // 批量发送模板消息
    SendWechatTemplateMessage:(params) => http(`/Wechat/SendTemplateMessage`,'POST',params),
}