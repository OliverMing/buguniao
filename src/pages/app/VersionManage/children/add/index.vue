<template>
  <div class="form">
    <a-card :bordered="false">
      <a-form-model ref="ruleForm" @submit="onSubmit" :model="form" @submit.native.prevent>
        <a-form-model-item label="资源包（IOS可不上传）">
          <a-upload ref="upload" :fileList="fileInfo ? [fileInfo] : null" accept=".apk,.wgt" :before-upload="beforeUpload">
            <a-button style="margin-top:4px">
              <upload-outlined></upload-outlined>选择文件
            </a-button>
            <div style="margin-top:6px;font-size:12px;color:#888">仅支持apk/wgt文件</div>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item label="PLATFORM">
          <a-select v-model="form.platform" style="width: 120px">
            <a-select-option value="android">安卓</a-select-option>
            <a-select-option value="ios">IOS</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="版本号">
          <a-input placeholder="100" v-model="form.version_code" />
        </a-form-model-item>
        <a-form-model-item label="版本名称">
          <a-input placeholder="1.0.0" v-model="form.version_name" />
        </a-form-model-item>

        <a-form-model-item  label="是否强制更新">
          <a-switch v-model="form.force_update" />
        </a-form-model-item>

        <a-form-model-item label="新版本更新内容">
          <a-textarea v-model="form.content"
            placeholder="修复了..."
            :auto-size="{ minRows: 3, maxRows: 8 }" />
        </a-form-model-item>

        <a-form-model-item style="margin-top: 24px">
          <a-button type="primary" htmlType="submit" :loading="uploading">提交</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
import api from '@/api'

export default {
  data () {
    return {
      uploading:false,
      rules:[],
      fileInfo:null,
      form:{
        platform:"android",
        version_code:null,
        version_name:null,
        is_wgt:0,
        force_update:false,
        content:""
      }
    }
  },
  created() {
     
  },
  methods: {
      
      // 获取列表
      queryList:function(){
          api.GetVersionlist(this.form).then(({ data }) => {
              console.log(data);
          });
      },

      beforeUpload:function(file){
        this.fileInfo = file;
        return false;
      },

      // 提交APP
      onSubmit:function(){
        if(this.fileInfo) this.form.is_wgt = this.fileInfo.name.includes('wgt');
        this.form.is_wgt = Number(this.form.is_wgt);
        let formData = new FormData();
        formData.append('files', this.fileInfo);

        Object.keys(this.form).forEach(e => {
          formData.append(e,this.form[e]);
        });

        this.uploading = true;
        api.UploadAppPackage(formData).then(() => {
          this.uploading = false;
          this.$message.success(`上传成功~`);
          this.$emit("refresh");
        }).catch(() => {
          this.uploading = false;
        })
      },

  }
}  
</script>

<style lang="css" scoped>
.form >>> .ant-form-item{margin-bottom: 10px !important;}
.form {margin: -20px !important;}
.form >>> .ant-form-item-label{line-height: 25px;}
</style>