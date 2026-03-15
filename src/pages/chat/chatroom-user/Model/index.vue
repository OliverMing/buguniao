<template>
  <a-modal :title="`${  form.chat_id ? '编辑' : '新增'}用户信息`" centered width="560px" 
  @ok="onSubmit"
  @cancel="close" 
  :visible="show"
  :confirm-loading="confirmLoading">
    <div class="form" v-if="show">
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

          <a-form-model-item label="风险提示" prop="risk_tips">
            <a-input placeholder="风险提示" v-model="form.risk_tips" />
          </a-form-model-item>

          <a-form-model-item label="VIP起止时间" prop="vipTime">
            <a-range-picker
            v-model="vipTime"
            style="width: 100%;"
            :show-time="{
              hideDisabledOptions: true,
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
            }"
            format="YYYY-MM-DD HH:mm:ss" />
          </a-form-model-item>

          <!-- 选择VIP进入房间 -->
          <a-form-model-item label="VIP房间" prop="vipRoomId">
            <a-select v-model="form.vipRoomId" placeholder="请匹配VIP房间" allowClear>
              <a-select-option v-for="item in vipChatRoomList" :key="item.id" :value="item.id">
                {{ item.room_name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <!-- 角色 -->
          <a-form-model-item label="角色" prop="role_id">
            <a-select v-model="form.role_id" placeholder="请选择角色" allowClear>
              <a-select-option v-for="item in roleOptionsList" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="消息上屏" prop="msg_screen">
            <a-select v-model="form.msg_screen" placeholder="请选择消息上屏" allowClear>
              <a-select-option :key="1" :value="1">是</a-select-option>
              <a-select-option :key="0" :value="0">否</a-select-option>
            </a-select>
          </a-form-model-item>
          
        </a-form-model>
      </a-card>
    </div>
  </a-modal>
</template>

<script>
import api from '@/api'
import moment from 'moment';

export default {
  props:{
    roleOptionsList:Array,
    vipChatRoomList:Array, // vip聊天室列表
  },
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      baseUrl: `${process.env.VUE_APP_API_BASE_URL}`,
      actionUrl: `${process.env.VUE_APP_API_BASE_URL}/Admin/UploadFile`,
      loading: false,
      confirmLoading:false,
      show: false,
      vipTime: null,
      initForm: {
        chat_id: null,
        headimgurl: null, //头像
        nickname: null, //昵称
        role_id: undefined, //角色
        vipStartTime: null, //vip开始时间
        vipEndTime: null, //vip结束时间
        vipRoomId: undefined, //vip房间
        msg_screen:0, // 消息上屏
        risk_tips: null, //风险提示
      },
      form: { },
      rules: {
        nickname:{ required: true, message: '请输入昵称' },
        //vipRoomId:{ required: true, message: '请选择VIP房间' }
        // role_id: [{ required: true, message: '请选择角色' }],
        // headimgurl: [{ required: true, message: '请上传头像' }]
      }
    }
  },
  methods: {
    moment,
    
    onChange(value) {
      this.params.department = value[value.length - 1];
    },

    async init(info) {
      this.form = Object.assign({}, this.initForm);
      if(info){
        Object.keys(this.form).forEach(e => {
          this.form[e] = info[e] || undefined;
        })
        if(info.vipStartTime && info.vipEndTime){
          this.vipTime = [moment(info.vipStartTime), moment(info.vipEndTime)];
        }
      }else{
        this.vipTime = null;
      }
      this.show = true;
    },

    

    // 提交资源
    onSubmit: function () {
      this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.confirmLoading = true;
            const params = JSON.parse(JSON.stringify(this.form));
            debugger;
            if(this.vipTime && this.vipTime[0] && this.vipTime[1]){
              params.vipStartTime = this.vipTime[0].format('YYYY-MM-DD HH:mm:ss');
              params.vipEndTime = this.vipTime[1].format('YYYY-MM-DD HH:mm:ss');
            }else{
              params.vipStartTime = null;
              params.vipEndTime = null;
            }
            api[this.form.chat_id ? 'UpdateLiveUser' : 'InsertLiveUser'](params).then(() => {
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
        this.form = Object.assign({}, this.initForm);
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