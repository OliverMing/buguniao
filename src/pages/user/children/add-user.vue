<template>
  <div class="form">
    <a-card :bordered="false">
      <a-form :form="form">
        <a-form-item label="登录账号">
          <a-input :disabled="params.id != null" placeholder="请输入用户登录账号" v-model="params.account" />
        </a-form-item>
        <a-form-item label="密码">
          <a-input placeholder="密码" v-model="params.pwd" />
        </a-form-item>

        <!-- 隶属部门 -->
        <a-form-item label="隶属部门">
            <a-cascader
            :default-value="params.department"
            :options="departmentList"
            placeholder="账号归属部门"
            change-on-select
            @change="onChange" />
        </a-form-item>     

        <a-form-item label="姓名">
          <a-input placeholder="姓名（非必填）" v-model="params.nick_name" />
        </a-form-item>

        <a-form-item label="手机号码">
          <a-input placeholder="手机号码（非必填）" v-model="params.phone" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" @click="onSubmit" :loading="loading">提交</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <!-- 获取部门列表 -->
    <Department :show="false" :list.sync="departmentList" />
  </div>
</template>
  
<script>
// import { addUser } from '@/services/user'
// import clientInfo from './clientInfo'
import Department from './add-department'
// import im from '@/api/im'
import api from '@/api'

export default {
  data() {
    return {
      loading:false,
      params: {
        nick_name: null, //昵称
        account: null, //账号
        pwd: null, //密码
        department:null, //部门
        phone: null, //手机号
        id:null,
      },
      departmentList:[],
      form: this.$form.createForm(this)
    }
  },
  components:{ Department },
  methods: {

    onChange(value) {
      this.params.department = value[value.length - 1];
    },

    init(info) {
      Object.keys(this.params).forEach(e => {
        this.params[e] = info[e];
      })
    },
    
    onSubmit: function () {
       if(!this.params.account){
        this.$message.error('请输入账号');
       }else if(!this.params.pwd){
        this.$message.error('请输入密码');
       }else {
          this.loading = true;
          let params = JSON.parse(JSON.stringify(this.params));
          if(!params.nick_name) params.nick_name = params.account;
            api.insertUser(params).then(data => {
              this.loading = false;
              this.$message.success(`${params.id ? '修改' : '添加'}成功`);
              this.$emit('refresh');
              this.form.resetFields();
            })
       }
    },
  },
}
</script>
  
  <style lang="css" scoped>
  .form >>> .ant-form-item{margin-bottom: 10px !important;}
  .form {margin: -20px !important;}
  .form >>> .ant-form-item-label{line-height: 25px;}
  </style>
  