<template>
  <a-card :bordered="false">
    <a-form @submit="onSubmit" :form="form">
      <a-form-item
        label="账号"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}">
        <a-input placeholder="请输入用户账号" v-decorator="['name', {rules: [{ required: true, message: '请输入账户名', whitespace: true}]}]"/>
      </a-form-item>

      <a-form-item
        label="密码"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}">
        <a-input placeholder="密码" v-decorator="['password', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]" />
      </a-form-item>
      
      <a-form-item style="margin-top: 24px" :wrapperCol="{span: 10, offset: 7}">
        <a-button type="primary" htmlType="submit">提交</a-button>
        <!-- <a-button style="margin-left: 8px">保存</a-button> -->
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { addUser } from '@/services/user'
export default {
  name: 'BasicForm',
  data () {
    return {
      account:null,
      pwd:null,
      form: this.$form.createForm(this)
    }
  },
  computed: {
    desc() {
      return "用户";
    }
  },
  methods: {
    onSubmit:function(){
      debugger;
      this.form.validateFields(() => {
        const account = this.form.getFieldValue('name')
        const pwd = this.form.getFieldValue('password')
        addUser({
          account,
          pwd
        }).then(res => {
          console.info(res);
        })
      })
      
    },
  },
}
</script>

<style scoped>

</style>
