import { http } from './request'

export default {
    // 用户登录
    login:(params) => http('/Anp/AdminLogin','POST',params),
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
}