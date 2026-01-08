<template>
    <a-upload :file-list="fileList"
    :loading="loading"
    :before-upload="beforeUpload"
    :showUploadList="false"
    :remove="() => removeFileList()"
    accept="*">
        <a-button :loading="loading">
            {{ info ? '重新上传' : '选择文件' }}
        </a-button>
    </a-upload>
</template>

<script>
import request from 'umi-request'

export default {
    mode:{
       type:"input"   
    },
    data(){
        return {
            fileList:[], //上传文件列表
            loading:false
        }
    },
    methods:{
         // 上传资源
        beforeUpload(file){
            this.fileList = [file];
            let formData = new FormData();
            formData.append('files',file);

            // 上传中
            this.loading = true;
            request(`${process.env.VUE_APP_API_BASE_URL}/Admin/UploadFile`, {
                  method: 'post',
                  data: formData,
              }).then(res => {
                  this.$emit('input',`${process.env.VUE_APP_API_BASE_URL}/${res.data}`);
                  this.loading = false;
              }).catch(err => {
                  this.$message.error(err.message)
                  this.loading = false;
              })
            return false;
        },

        removeFileList(){
            this.fileList = [];
            this.$emit('input','')
        }
    }
}
</script>