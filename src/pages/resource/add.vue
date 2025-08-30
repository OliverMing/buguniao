<template>
    <a-card :bordered="false">
      <a-form-model ref="ruleForm" @submit="onSubmit" :model="form" :rules="rules" @submit.native.prevent>

        <a-form-model-item>
            <a-upload ref="upload" :file-list="fileList"  :before-upload="beforeUpload" accept=".xlsx,.xls,.txt">
                <a-button>
                    <upload-outlined></upload-outlined>
                    选择文件
                </a-button>
                <div style="margin-top:10px;font-size:12px;color:#888">仅支持xlsx/xls文件/txt文件</div>
            </a-upload>
        </a-form-model-item>

          <a-form-model-item label="批次名称" prop="batch_name">
            <a-input placeholder="请输入批次名称" v-model="form.batch_name" />
          </a-form-model-item>

    
          <a-form-model-item label="资源池密码" prop="pwd">
            <a-input placeholder="密码" v-model="form.pwd"  />
          </a-form-model-item>

          <a-form-model-item label="回收池密码" prop="recycle_pwd">
            <a-input placeholder="密码" v-model="form.recycle_pwd" />
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
    name:"add-resource",
    data () {
      return {
        desc:"请上传excel文本资源文件，重复号码将自动过滤",
        uploading:false,
        fileList:[],
        form: { 
          batch_name:null,
          recycle_pwd:null,
          pwd:null,
        },
        rules:{
          batch_name:[
            { required: true, message: '请输入批次名称', trigger: 'blur' }
          ],
          pwd:[
            { required: true, message: '请输入资源池密码', trigger: 'blur' }
          ],
          recycle_pwd:[
            { required: true, message: '请输入回收池密码', trigger: 'blur' }
          ]
        }
      }
    },
    props:{
      isUpdate:Boolean, // 是否追加资源
      pwd:String, // 追加资源id
    },
    created() {
      if(this.pwd) this.form.pwd = this.pwd;
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
              formData.append('batch_name', this.form.batch_name);
              formData.append('pwd', this.form.pwd);
              formData.append('recycle_pwd', this.form.recycle_pwd);
              // formData.append('isUpdate', this.isUpdate);
              this.uploading = true;

              request(`${process.env.VUE_APP_API_BASE_URL}/Anp/UploadResource`, {
                  method: 'post',
                  data: formData,
              }).then(res => {
                if(res.state == 'success'){
                  this.$message.success(`${this.isUpdate ? '追加资源' : '上传资源'}成功啦~`);
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
  .ant-form-item{margin-bottom: 10px !important;}
  </style>
  