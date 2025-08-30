<template>
  <a-form-model ref="ruleForm" @submit="onSubmit" :model="form" :rules="rules" @submit.native.prevent>

    <a-form-model-item label="日领取上限" prop="count" ref="count">
      <a-input placeholder="200" v-model="form.count" />
    </a-form-model-item>
    
    <a-form-model-item>
      <a-button type="primary" htmlType="submit" :loading="loading">提交</a-button>
    </a-form-model-item>
  </a-form-model>
  </template>
  
  <script>
  import api from '@/api'

  export default {
    data () {
      return {
        form: {
            count:null,
        },
        loading:false,
        rules: {
            count: [
                { required: true, message: '请输入日领取上限', trigger: 'blur' }
            ]
        },
        desc:"单日领取上线"
      }
    },
    created() {
        this.getSingle();
    },
    methods: {

        // 获取单日领取上线
        getSingle:function(){
          api.GetDailyReceiveMax().then(data => {
              this.form.count = Number(data);
          })
        },

        // 单日领取上限
        onSubmit:function(){
            this.$refs.ruleForm.validate(valid => {
                if(valid){
                    this.loading = true;
                    api.SetDailyReceiveMax(this.form.count).then(() => { 
                      this.$message.success('执行成功');
                      this.loading = false;
                      this.$emit('close');
                    }).catch(() => {
                      this.loading = false;
                    })
                }
            })
        },

    },
  }
  </script>
  
  <style scoped>
  
  </style>
  