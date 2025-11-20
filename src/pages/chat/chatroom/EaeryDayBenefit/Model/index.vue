<template>
    <a-modal :title="`${form.id ? '编辑' : '新增'}每日福利`" centered width="500px" :visible="show" :confirm-loading="loading" @ok="onSubmit"
        @cancel="handleCancel">
        <div>
            <a-form-model layout="horizontal" ref="ruleForm" @submit="onSubmit" 
            :label-col="4" :wrapper-col="24" :model="form"
                :rules="rules" @submit.native.prevent>
                <a-form-model-item label="正文内容" prop="content">
                    <a-input type="textarea" placeholder="请输入正文内容" v-model="form.content" />
                </a-form-model-item>
            </a-form-model>
        </div>
    </a-modal>
</template>

<script>
import api from '@/api'

export default {
    props: {
        code:String  
    },
    data() {
        return {
            show: false,
            loading: false,
            userList: [],
            form: {
                id: null,
                content: null,
                code: null,
            },
            rules: {
                content: { required: true, message: '请输入消息正文', trigger: 'blur' },
            }
        }
    },
    methods: {

        open(info = null) {
            if(info){
                Object.keys(this.form).forEach(key => {
                    this.form[key] = info[key] || null
                })
            }
            this.show = true
        },

        handleCancel() {
            this.show = false;
            this.$refs.ruleForm.resetFields();
            this.loading = false;
        },

        onSubmit() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    this.form.code = this.code;
                    this.loading = true;
                    api[this.form.id ? 'UpdateLiveRoomEaery' : 'AddLiveRoomEaery'](this.form).then(() => {
                        this.$message.success('操作成功')
                        this.handleCancel();
                        this.$emit('refresh');
                    }).finally(() => {
                        this.loading = false;
                    })
                }
            });
        }

    }
}
</script>