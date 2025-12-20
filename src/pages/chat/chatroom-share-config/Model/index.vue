<template>
    <a-modal
        :title="`${form.id ? '编辑' : '新增'}分享配置`"
        centered
        width="560px"
        :visible="show"
        :confirm-loading="loading"
        @ok="onSubmit"
        @cancel="handleCancel">
        <a-form-model
            layout="horizontal"
            ref="ruleForm"
            @submit="onSubmit"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 18 }"
            :model="form"
            :rules="rules"
            @submit.native.prevent>

            <a-form-model-item label="渠道" prop="channel">
                <a-input v-model="form.channel" placeholder="请输入渠道标识" />
            </a-form-model-item>

            <a-form-model-item label="分享链接" prop="link">
                <a-input v-model="form.link" placeholder="请输入分享链接" />
            </a-form-model-item>

            <a-form-model-item label="标题" prop="title">
                <a-input v-model="form.title" placeholder="请输入标题" />
            </a-form-model-item>

            <a-form-model-item label="描述" prop="desc">
                <a-textarea v-model="form.desc" :rows="3" placeholder="请输入描述" />
            </a-form-model-item>

            <a-form-model-item label="图片地址" prop="imgUrl">
                <UploadImage v-model="form.imgUrl" style="margin-top: 10px;margin-bottom: -20px;" />
            </a-form-model-item>
        </a-form-model>
    </a-modal>
</template>

<script>
import api from '@/api'

export default {
    data() {
        return {
            show: false,
            loading: false,
            form: this.getInitialForm(),
            rules: {
                channel: { required: true, message: '请输入渠道', trigger: 'blur' },
                link: { required: true, message: '请输入分享链接', trigger: 'blur' },
                title: { required: true, message: '请输入标题', trigger: 'blur' },
                desc: { required: true, message: '请输入描述', trigger: 'blur' },
                imgUrl: { required: true, message: '请输入图片地址', trigger: 'blur' }
            }
        }
    },
    methods: {
        getInitialForm() {
            return {
                id: null,
                channel: '',
                link: '',
                title: '',
                desc: '',
                imgUrl: ''
            }
        },
        open(record = null) {
            this.show = true
            if (record) {
                this.form = { ...this.getInitialForm(), ...record }
            } else {
                this.form = this.getInitialForm()
            }
        },
        handleCancel() {
            this.show = false
            this.loading = false
            this.$nextTick(() => {
                if (this.$refs.ruleForm) {
                    this.$refs.ruleForm.resetFields()
                }
            })
        },
        onSubmit() {
            this.$refs.ruleForm.validate(valid => {
                if (!valid) return
                this.loading = true
                const apiFn = this.form.id ? api.UpdateLiveShareConfig : api.AddLiveShareConfig
                apiFn(this.form)
                    .then(() => {
                        this.$message.success(this.form.id ? '编辑成功' : '新增成功')
                        this.handleCancel()
                        this.$emit('success')
                    })
                    .finally(() => {
                        this.loading = false
                    })
            })
        }
    }
}
</script>