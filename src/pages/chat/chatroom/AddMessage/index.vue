<template>
    <a-modal title="新增消息" centered width="850px" :visible="show" :confirm-loading="loading" @ok="onSubmit"
        @cancel="handleCancel">
        <div>

            <div class="quote" v-if="form.quote" v-html="form.quote"></div>

            <a-form-model layout="horizontal" ref="ruleForm" @submit="onSubmit" 
            :label-col="4" :wrapper-col="24" :model="form"
                :rules="rules" @submit.native.prevent>

                <!-- 文字内容、图片 -->
                <a-form-model-item label="消息类型" prop="type">
                    <a-radio-group v-model="type">
                        <a-radio value="text">文字</a-radio>
                        <a-radio value="image">图片</a-radio>
                        <a-radio value="video">视频</a-radio>
                        <!-- 语音 -->
                        <a-radio value="audio">语音</a-radio>
                    </a-radio-group>
                </a-form-model-item>

                <!-- :before-upload="beforeUpload" -->
                <a-form-model-item label="消息正文" prop="content">
                    <!-- 文本类型使用富文本编辑器，但只允许输入文字 -->
                    <quill-editor
                        v-if="type == 'text'"
                        ref="msgEditor"
                        class="msg-text-editor"
                        v-model="form.content"
                        :options="editorOption"
                        @change="onEditorChange" />
                    <AudioRecorder v-else-if="type == 'audio'" v-model="form.content" />
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
import AudioRecorder from '@/components/audioRecorder'
import moment from 'moment';
import Quill from 'quill'

// 自定义字体大小：10px 12px 14px ...，默认显示效果为 14px
const fontSizeList = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']
if (Quill && Quill.imports && Quill.imports['attributors/style/size']) {
    Quill.imports['attributors/style/size'].whitelist = fontSizeList
    Quill.register(Quill.imports['attributors/style/size'], true)
}

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
                quote: null,
            },
            rules: {
                content: { required: true, message: '请输入消息正文', trigger: 'change' },
                openid: { required: true, message: '请选择发送者', trigger: 'change' },
            },
            // 富文本配置：只保留文字相关功能（样式、列表、颜色等），不提供图片/附件等功能
            editorOption: {
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline'],                        // 加粗 斜体 下划线
                        // [{ 'size': fontSizeList }],                             // 字体大小：10px 12px 14px ...
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],          // 有序 / 无序列表
                        [{ 'color': [] }, { 'background': [] }],                // 字体颜色 / 背景色
                        [{ 'align': [] }],                                      // 对齐方式
                    ]
                },
                placeholder: '请输入消息正文'
            }
        }
    },
    watch:{
        type(){
            this.form.content = null
        }
    },
    components: {
        AudioRecorder
    },
    created() {
        api.GetLiveRoleList().then(res => {
            res = res.filter(e => e.type == 1);
            const ids = res.map(e => e.id);
            api.GetRoleUserList().then(data => {
                this.userList = data.filter(e => ids.includes(e.role_id));
            })
        });
    },
    methods: {
        open(quote = null) {
            this.form.quote = quote;
            this.show = true
            // 打开弹窗时，默认将字号设置为 14px，让工具栏显示为 14px
            this.$nextTick(() => {
                const editor = this.$refs.msgEditor
                if (editor && editor.quill) {
                    const quill = editor.quill
                    const range = quill.getSelection() || { index: 0, length: 0 }
                    quill.format('size', '14px')
                    // 防止影响已有内容，只作为默认格式使用
                    quill.setSelection(range.index, range.length)
                }
            })
        },

        // 富文本内容变化时，保存带格式的 HTML，保留字体颜色、背景色等样式
        onEditorChange({ html }) {
            this.form.content = html || ''
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
                            quote:this.form.quote,
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

<style scoped>

.quote{
    background-color: #f8f8f8;
    padding: 12px;
    padding-bottom: 0px;
    margin-bottom: 12px;
    /* 两行省略 */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 12px;
}

</style>

<style>
.msg-text-editor >>> .ql-toolbar.ql-snow + .ql-container.ql-snow {
    border-top: 0;
}

.msg-text-editor >>> .ql-editor {
    font-size: 14px; /* 默认 14px */
    min-height: 200px; /* 富文本最小高度 */
}
</style>

<!-- Quill 字号下拉展示成 10px / 12px / 14px ... -->
<style>
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: '14px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='10px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='10px']::before {
    content: '10px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='12px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='12px']::before {
    content: '12px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='14px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='14px']::before {
    content: '14px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='16px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='16px']::before {
    content: '16px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='18px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='18px']::before {
    content: '18px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='20px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='20px']::before {
    content: '20px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='24px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='24px']::before {
    content: '24px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='28px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='28px']::before {
    content: '28px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='32px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='32px']::before {
    content: '32px';
}
</style>