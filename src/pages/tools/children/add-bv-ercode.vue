<template>
    <a-card :bordered="false">
      <a-form-model ref="ruleForm" @submit="onSubmit" :model="form" :rules="rules" @submit.native.prevent>

        <a-form-model-item label="二维码" prop="url">
            <a-upload :file-list="fileList"  :before-upload="beforeUpload" accept=".png,.jpg,.jpeg">
                <a-button>
                    <upload-outlined></upload-outlined>
                    {{ info ? '重新上传' : '选择文件' }}
                </a-button>
                <div style="margin-top:10px;font-size:12px;color:#888">仅支持.png/.jpg/.jpeg文件</div>
            </a-upload>
        </a-form-model-item>

        <a-form-model-item label="获客链接" prop="wxurl">
          <a-input placeholder="获客链接" v-model="form.wxurl" />
        </a-form-model-item>
        
        <a-form-model-item label="权重" prop="bv">
          <a-input placeholder="整数" v-model="form.bv" />
        </a-form-model-item>
 
        <a-form-model-item label="二维码名称" prop="name">
          <a-input placeholder="张老师" v-model="form.name" />
        </a-form-model-item>

        
        <a-form-model-item style="margin-top: 24px">
          <a-button type="primary" htmlType="submit" :loading="uploading">提交{{ info ? '修改' : '' }}</a-button>
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
        rules:{
          bv:[
            { required: true, message: '请输入权重', trigger: 'blur' }
          ],
          channel_id:[
            { required: true, message: '请选择渠道', trigger: 'blur' }
          ],
         // wxurl:{ required: true, message: '请输入链接', trigger: 'blur' }
        },
        form: {
          id:-1,
          channel_id:null,
          url:null,
          wxurl:null,
          bv:null,
          name:null
        }
      }
    },
    props:{
      info:Object,
      list:Array,
      channel:Object,
      channelId:String,
    },
    computed:{
      getSuperCount(){
        if(!this.list || this.list.length == 0) return 100;
        let list = this.list.map(e => e.bv);
        let count = list.reduce((a,b) => a + b);
        return 100 - count;
      },
    },
    created() {
      if(this.info){
        Object.keys(this.form).forEach(e => {
          this.form[e] = this.info[e];
        })
        this.fileList = [this.info.url];
      }
    },
    methods: {
      // 提交资源
      onSubmit:function(){
        if(this.fileList.length == 0 && !this.form.wxurl){
          this.$message.error("二维码或获客链接不能为空");
        }else{
          this.$refs.ruleForm.validate(valid => {
            if(valid){
              let formData = new FormData();
              this.form.channel_id = this.channelId;
              formData.append('files', this.fileList[0] || null);
              Object.keys(this.form).forEach(e => {
                formData.append(e, this.form[e]);
              });
              this.uploading = true;
              request(`${process.env.VUE_APP_API_BASE_URL}/Admin/UploadRatioErcode`, {
                  method: 'post',
                  data: formData,
              }).then(res => {
                if(res.state == 'success'){
                  this.$message.success(`${this.isUpdate ? '上传' : '修改'}成功啦~`);
                  this.fileList = [];
                  this.form = {
                    mark:null,
                    pwd:null
                  }
                  this.uploading = false;
                  this.$emit("success");
                }else{
                  this.$message.error("添加失败");
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
  