//跨域代理前缀
// const API_PROXY_PREFIX='/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
const BASE_URL = process.env.VUE_APP_API_BASE_URL;
module.exports = {
  LOGIN: `${BASE_URL}/Admin/Login`,
  GETUSERLIST:`${BASE_URL}/Admin/GetUserList`,
  ADDUSER:`${BASE_URL}/Admin/AddUser`,
  GETRESOURCELIST:`${BASE_URL}/Admin/GetResourceList`,
  DELETEUSER:`${BASE_URL}/Admin/DeleteUser`,
  DELETERESOURCE:`${BASE_URL}/Admin/DeleteResource`,
  GETRESOURCELOGLIST:`${BASE_URL}/Admin/GetResourceLogList`,
  GETMARKLIST:`${BASE_URL}/Admin/GetMarkList`,
  GETMARKCOUNT:`${BASE_URL}/Admin/GetMarkCount`,
  GETSINGLENUMBER:`${BASE_URL}/Admin/getSingleNumber`,
  SETSINGLENUMBER:`${BASE_URL}/Admin/setSingleNumber`,
  GETPHONELISTBYID:`${BASE_URL}/Admin/GetPhoneListByPwd`,
  UPLOADERCODE:`${BASE_URL}/Admin/UploadErcode`,
  GETERCODELIST:`${BASE_URL}/Admin/GetErcodeList`,
  GETPHONENUMBER:`${BASE_URL}/Admin/GetPhoneNumber`,
}
