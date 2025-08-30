import request from 'umi-request'

const http = (url,method,data) => {
    return new Promise((reslove,reject) => {
        request(`${process.env.VUE_APP_API_BASE_URL + url}`, {
            method,
            data,
        }).then(res => {
          if(res.state == 'success'){
            reslove(res.data);
          }else{
            reject();
          }
        })
    })
}

export {
    http
}