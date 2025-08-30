<template>
    <a-upload :file-list="fileList" :before-upload="beforeUpload" accept=".xlsx,.xls,.txt" @change="onSubmit">
        <a-button  ref="upload">
            <upload-outlined></upload-outlined>
            选择文件
        </a-button>
    </a-upload>
  </template>
  
  <script>
  import request from 'umi-request'

  export default {
    name:"add-resource",
    data () {
      return {
        desc:"请上传txt文本资源文件，重复号码将自动过滤",
        uploading:false,
        fileList:[],
        resourceType:2,
        form: { 
          mark:null,
          pwd:null,
        },
        rules:{
          mark:[
            { required: true, message: '请输入资源名称', trigger: 'blur' }
          ],
          pwd:[
            { required: true, message: '请输入资源池密码', trigger: 'blur' }
          ]
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
            let formData = new FormData();
            formData.append('files', this.fileList[0]);
            this.uploading = true;
            request(`${process.env.VUE_APP_API_BASE_URL}/Admin/UploadAllResource`, {
                method: 'post',
                data: formData,
            }).then(res => {
            if(res.state == 'success'){
                const { total,repCount } = res.data;
                this.$message.success(`上传资源成功啦,本次共计${total}条数据，过滤${repCount}条，实际录入${total - repCount}条`);
                this.fileList = [];
                this.uploading = false;
                this.$emit("success");
            }else{
                this.$message.error("资源添加失败");
                this.uploading = false;
            }
            })
        }
      },

      uploadClick:function(){
        this.$refs.upload.$el.click();
      },

      // 上传资源
      beforeUpload:function(file){
        this.fileList = [file];
        return false;
      }
    },
  }
  </script>
  
  <style scoped>
  .ant-form-item{margin-bottom: 10px !important;}
  </style>
  