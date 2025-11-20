<template>
    <a-modal title="新增消息" centered width="500px" :visible="show" :confirm-loading="loading" @ok="onSubmit"
        @cancel="handleCancel">
        <div>
            <a-form-model layout="horizontal" ref="ruleForm" @submit="onSubmit" 
            :label-col="4" :wrapper-col="24" :model="form"
                :rules="rules" @submit.native.prevent>

                <!-- 文字内容、图片 -->
                <a-form-model-item label="消息类型" prop="type">
                    <a-radio-group v-model="type">
                        <a-radio value="text">文字</a-radio>
                        <a-radio value="image">图片</a-radio>
                        <a-radio value="video">视频</a-radio>
                    </a-radio-group>
                </a-form-model-item>

                <!-- :before-upload="beforeUpload" -->
                <a-form-model-item label="消息正文" prop="content">
                    <a-input v-if="type == 'text'" type="textarea" placeholder="请输入消息正文" v-model="form.content" />
                    <a-upload v-else name="files" :list-type="type == 'image' ? 'picture-card' : ''"
                        :show-upload-list="false" :action="actionUrl"
                        @change="handleChange">
                        <template v-if="type == 'image'">
                            <img v-if="form.content" :src="form.content" alt="avatar" style="width: 100%;height: 100%;" />
                            <div v-else>
                                <a-icon :type="loading ? 'loading' : 'plus'" />
                                <div class="ant-upload-text">Upload</div>
                            </div>
                        </template>
                        <template v-else-if="type == 'video'">
                            <a-button><a-icon :type="loading ? 'loading' : 'upload'" />上传视频</a-button>
                            <span v-if="form.content">{{ form.content }}</span>
                        </template>
                    </a-upload>
                </a-form-model-item>
                <!-- 有效期多少天 -->
                <a-form-model-item label="发送者" prop="openid" required>
                    <a-select style="width: 180px;" v-model="form.openid" placeholder="请选择发送者">
                        <a-select-option v-for="item in userList" :key="item.openid" :value="item.openid">
                            {{ item.nickname }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
            </a-form-model>
        </div>
    </a-modal>
</template>

<script>
import api from '@/api'
import moment from 'moment';

export default {
    props: {
        code: String
    },
    data() {
        return {
            show: false,
            loading: false,
            type: 'text',
            baseUrl: `${process.env.VUE_APP_API_BASE_URL}`,
            actionUrl: `${process.env.VUE_APP_API_BASE_URL}/Admin/UploadFile`,
            userList: [],
            form: {
                content: null,
                openid: undefined,
                code: null,
            },
            rules: {
                content: { required: true, message: '请输入消息正文', trigger: 'blur' },
                openid: { required: true, message: '请选择发送者', trigger: 'change' },
            }
        }
    },
    watch:{
        type(){
            this.form.content = null
        }
    },
    created() {
        api.GetRoleUserList().then(data => {
            this.userList = data;
        })
    },
    methods: {
        open() {
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
                    api.InsertMessage(this.form).then(() => {
                        // 群发消息
                        const userInfo = this.userList.find(item => item.openid == this.form.openid);
                        this.$emit('send',JSON.stringify({
                            type:'group',
                            code:this.code,
                            userInfo,
                            content:this.form.content,
                            create_time: moment().format('YYYY-MM-DD HH:mm:ss') //格式需要调整YYYY-MM-DD HH:mm:ss, //格式需要调整YYYY-MM-DD HH:mm:ss
                        }));


                        this.$message.success('添加成功')
                        this.handleCancel();
                        this.$emit('success');
                    }).finally(() => {
                        this.loading = false;
                    })
                }
            });
        },

        handleChange(info) {
            if (info.file.status === 'uploading') {
                this.loading = true;
                return;
            }
            if (info.file.status === 'done') {
                this.form.content = `${this.baseUrl}/${info.file.response.data}`;
                console.info('this.form.content',this.form.content);
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