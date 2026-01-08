<template>
    <a-modal title="新增角色" centered width="560px"
    @ok="handleSubmit"
    @cancel="close"
    :confirm-loading="confirmLoading"
    :visible="show">
        <a-form-model ref="ruleForm" :model="form" :rules="rules"
            :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="角色名称" prop="name">
                <a-input placeholder="角色名称" v-model="form.name" />
            </a-form-model-item>
            <a-form-model-item label="角色颜色" prop="color">
                <!-- <a-input placeholder="角色颜色" v-model="form.color" /> -->
                <!-- <a-color-picker v-model="form.color" /> -->
                <!-- 颜色选择器 -->
                 <input type="color" v-model="form.color" />
            </a-form-model-item>
            
            <!-- 角色类型 0:客户角色 1:系统管理角色 -->
            <a-form-model-item label="角色类型" prop="type">
                <a-radio-group v-model="form.type">
                    <a-radio :value="0">客户角色</a-radio>
                    <a-radio :value="1">系统管理角色</a-radio>
                </a-radio-group>
            </a-form-model-item>
        </a-form-model>
    </a-modal>
</template>

<script>
import api from '@/api';

export default {
    data() {
        return {
            show: false,
            form: {
                id: null,
                name: null, // 角色名称
                color: null, // 角色背景颜色
                type:0, // 角色类型 0:客户角色 1:系统管理角色
            },
            rules: {
                name: [{ required: true, message: '请输入角色名称' }],
                color: [{ required: true, message: '请选择角色背景颜色' }],
            },
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            confirmLoading: false
        }
    },
    methods: {
        init(info) {
            if(info){
                Object.keys(this.form).forEach(e => {
                    this.form[e] = info[e] || null;
                })
            }
            this.show = true;
        },

        close(){
            this.show = false;
            this.confirmLoading = false;
            this.form = {
                id: null,
                name: null, // 角色名称
                color: null, // 角色背景颜色
                type:0, // 角色类型 0:客户角色 1:系统管理角色
            };
            this.$refs.ruleForm.resetFields();
        },

        handleSubmit() {
            this.$refs.ruleForm.validate(valid => {
                if(valid){
                    this.confirmLoading = true;

                    api[this.form.id ? 'UpdateLiveRole' : 'AddLiveRole'](this.form).then(() => {
                        this.$message.success(this.form.id ? '修改成功' : '添加成功');
                        this.$emit('refresh');
                        this.confirmLoading = false;
                        this.close();
                    });
                }
            });
        },
    }
}
</script>