<template>
    <a-card :bordered="false">
      <a-form-model ref="ruleForm">

        <a-form-model-item>
            <a-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload" accept=".png,.jpg,.jpeg">
                <a-button>
                    <upload-outlined></upload-outlined>
                    选择文件
                </a-button>
                <div style="margin-top:10px;font-size:12px;color:#888">仅支持.png/.jpg/.jpeg文件</div>
            </a-upload>
        </a-form-model-item>
  
        <a-form-model-item label="名字" prop="name">
          <a-input placeholder="请输入用户姓名" v-model="username" />
        </a-form-model-item>
        
        <a-form-model-item style="margin-top: 24px">
          <a-button type="primary" htmlType="submit" @click="onSubmit" :loading="uploading">提交</a-button>
        </a-form-model-item>
        
      </a-form-model>
    </a-card>
  </template>
  
  <script>
  import request from 'umi-request'

  export default {
    name:"add-ercode",
    data () {
      return {
        uploading:false,
        fileList:[],
        username:null
      }
    },
    props:{
      isUpdate:Boolean, // 是否追加资源
      pwd:String, // 追加资源的密码
    },
    created() {
      if(this.isUpdate){
        this.form.pwd = this.pwd;
      }
    },
    methods: {

      // 提交
      onSubmit:function(){
        if(this.fileList.length == 0){
          this.$message.error("请先选择上传文件");
        }else if(!this.username){
          this.$message.error("请输入名字");
        }else{

            this.uploading = true;
            let formData = new FormData();
            formData.append('files', this.fileList[0]);
            formData.append('name', this.username);
            request(`${process.env.VUE_APP_API_BASE_URL}/Admin/UploadScrollUser`, {
                method: 'post',
                data: formData,
            }).then(res => {
            if(res.state == 'success'){
                this.$message.success(`添加成功`);
                this.fileList = [];
                this.username = null;
                this.uploading = false;
                this.$emit("success");
            }else{
                this.$message.error("添加失败");
                this.uploading = false;
            }
            })
        }
      },

      // 上传资源
      beforeUpload:function(file){
        this.fileList = [...this.fileList, file];
        return false;
      }
    },
  }
  </script>
  
  <style scoped>
  .ant-form-item{margin-bottom: 10px;}
  </style>
  