<template>
    <div class="form" v-if="show">
      <a-card :bordered="false">
        <a-form :form="form">
          <a-form-item label="部门名称">
            <a-input placeholder="请输入部门名称" v-model="params.name" v-decorator="['name', { rules: [{ required: true, message: '请输入部门名称', whitespace: true }] }]" />
          </a-form-item>
          <!-- 隶属部门 -->
          <a-form-item label="隶属部门">
            <a-cascader
            :options="departmentList"
            placeholder="归属部门"
            change-on-select
            @change="onChange" />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" @click="onSubmit" :loading="loading">提交</a-button>
          </a-form-item>

        </a-form>
      </a-card>
    </div>
  </template>
    
<script>
import api from '@/api'
  
export default {
    data() {
      return {
        loading:false,
        params: {
          name: null, //昵称
          pid:0, //父级
        },
        departmentList:[],
        form: this.$form.createForm(this)
      }
    },
    props:{
      show:{
        type:Boolean,
        default:true
      },
      isTree:{
        type:Boolean,
        default:false
      }
    },
    created() {
        this.queryList();
    },
    methods: {
  
        onChange(value) {
          this.params.pid = value[value.length - 1];
        },

        // 获取列表
        queryList:function(){
            const backChildren = (list,res) => {
                list.forEach(e => {
                    e.children = [];
                    const id = this.isTree ? e.key : e.value;
                    const children = res.filter(c => c.pid == id);
                    if(children.length > 0){
                        children.forEach(c => {
                          const item = this.isTree 
                          ? { title:c.name, key:c.id } 
                          : { value:c.id, label:c.name };
                          e.children.push(item)
                        });
                        backChildren(e.children,res);
                    }
                })
            };

            api.GetAllDepartmentList().then(res => {
                let list = []
                let deparment = res.filter(e => e.pid == 0);
                deparment.forEach(e => {
                    const item = this.isTree 
                    ? { title:e.name, key:e.id }
                    : { value:e.id, label:e.name };
                    list.push(item)
                })
                backChildren(list,res);
                this.departmentList = list;
                this.total = res.length;
                this.$emit('update:list',list);
            });
        },

        onSubmit: function () {
            this.form.validateFields(err => {
                if (!err) {
                    this.loading = true;
                    api.AddDeparment(this.params).then(() => {
                      this.loading = false;
                      this.$emit('refresh');
                      this.$emit('update:show',false);
                    }).catch(() => {
                      this.loading = false;
                    })
                }
            })
        },
    },
}
</script>

<style lang="css" scoped>
.form >>> .ant-form-item{margin-bottom: 10px !important;}
.form {margin: -20px !important;}
.form >>> .ant-form-item-label{line-height: 25px;}
</style>
