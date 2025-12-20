import request from 'umi-request'

const http = (url,method,data) => {
    return new Promise((reslove,reject) => {
       let urls = url.includes('//') ? url : `${process.env.VUE_APP_API_BASE_URL + url}`
        request(urls, {
            method,
            data,
        }).then(res => {
          if(res.state == 'success' || res.message == 'success'){
            reslove(res.message == 'success' ? res : res.data);
          }else{
            reject();
          }
        })
    })
}

export {
    http
}