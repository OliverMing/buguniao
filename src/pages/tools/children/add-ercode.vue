<template>
    <a-card :bordered="false">
      <a-form-model ref="ruleForm" @submit="onSubmit" :model="form" :rules="rules" @submit.native.prevent>

        <a-form-model-item>
            <a-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload" accept=".png,.jpg,.jpeg">
                <a-button>
                    <upload-outlined></upload-outlined>
                    选择文件
                </a-button>
                <div style="margin-top:10px;font-size:12px;color:#888">仅支持.png/.jpg/.jpeg文件</div>
            </a-upload>
        </a-form-model-item>
  
        <a-form-model-item label="备注" prop="remark">
          <a-input placeholder="备注:(如事业一部张三)" v-model="form.remark" />
        </a-form-model-item>
        
        <a-form-model-item style="margin-top: 24px">
          <a-button type="primary" htmlType="submit" :loading="uploading">提交</a-button>
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
        form: { 
          user_id:null,
          remark:null,
        }
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
      // 提交资源
      onSubmit:function(){
        if(this.fileList.length == 0){
          this.$message.error("请先选择上传文件");
        }else{
          this.$refs.ruleForm.validate(valid => {
            if(valid){
              let formData = new FormData();
              formData.append('files', this.fileList[0]);
              formData.append('user_id', this.form.user_id);
              formData.append('remark', this.form.remark || null);
              this.uploading = true;
              request(`${process.env.VUE_APP_API_BASE_URL}/Admin/UploadErcode`, {
                  method: 'post',
                  data: formData,
              }).then(res => {
                if(res.state == 'success'){
                  this.$message.success(`${this.isUpdate ? '上传资源' : '追加资源'}成功啦~`);
                  this.fileList = [];
                  this.form = {
                    mark:null,
                    pwd:null
                  }
                  this.uploading = false;
                  this.$emit("success");
                }else{
                  this.$message.error("资源添加失败");
                  this.uploading = false;
                }
              })
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
  