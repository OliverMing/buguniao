<template>
  <a-modal :title="`${  form.chat_id ? '编辑' : '新增'}用户信息`" centered width="560px" 
  @ok="onSubmit"
  @cancel="close" 
  :visible="show"
  :confirm-loading="confirmLoading">
    <div class="form">
      <a-card :bordered="false">
        <a-form-model ref="ruleForm" :model="form" :rules="rules"
          :label-col="labelCol" :wrapper-col="wrapperCol">

          <a-form-model-item label="头像" prop="headimgurl">
            <a-upload name="files" list-type="picture-card" class="avatar-uploader" :show-upload-list="false"
              :action="actionUrl" :before-upload="beforeUpload" @change="handleChange">
              <img style="width: 100%;height: 100%;" v-if="form.headimgurl" :src="form.headimgurl" alt="avatar" />
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </a-form-model-item>

          <a-form-model-item label="昵称" prop="nickname">
            <a-input placeholder="昵称" v-model="form.nickname" />
          </a-form-model-item>

          <!-- 角色 -->
          <a-form-model-item label="角色" prop="role_id">
            <a-select v-model="form.role_id" placeholder="请选择角色" allowClear>
              <a-select-option v-for="item in roleOptionsList" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </a-card>
    </div>
  </a-modal>
</template>

<script>
import api from '@/api'

export default {
  props:{
    roleOptionsList:Array
  },
  data() {
    return {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
      baseUrl: `${process.env.VUE_APP_API_BASE_URL}`,
      actionUrl: `${process.env.VUE_APP_API_BASE_URL}/Admin/UploadFile`,
      loading: false,
      confirmLoading:false,
      show: false,
      form: {
        chat_id: null,
        headimgurl: null, //头像
        nickname: null, //昵称
        role_id: undefined, //角色
      },
      rules: {
        nickname: [{ required: true, message: '请输入昵称' }],
        // role_id: [{ required: true, message: '请选择角色' }],
        // headimgurl: [{ required: true, message: '请上传头像' }]
      }
    }
  },
  methods: {

    onChange(value) {
      this.params.department = value[value.length - 1];
    },

    init(info) {
      if(info){
        Object.keys(this.form).forEach(e => {
          this.form[e] = info[e] || undefined;
        })
      }
      this.show = true;
    },

    // 提交资源
    onSubmit: function () {
      this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.confirmLoading = true;
            api[this.form.chat_id ? 'UpdateLiveUser' : 'InsertLiveUser'](this.form).then(() => {
              this.$message.success(this.form.chat_id ? '修改成功' : '添加成功');
              this.$emit('refresh');
              this.confirmLoading = false;
              this.close();
            })
          }
        })
    },

    close(){
        this.show = false;
        this.confirmLoading = false;
        this.form = {
          chat_id: null,
          headimgurl: null, //头像
          nickname: null, //昵称
          role_id: undefined, //角色
        };
        this.$refs.ruleForm.resetFields();
    },

    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        this.form.headimgurl = `${this.baseUrl}/${info.file.response.data}`;
        console.info('this.form.headimgurl',this.form.headimgurl);
        this.loading = false;
      }
    },

    // 上传资源
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
  }
}
</script>