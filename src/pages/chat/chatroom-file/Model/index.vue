<template>
    <!-- 上传文件弹窗 -->
    <a-modal title="上传文件" :visible="uploadModalVisible" @ok="handleUploadConfirm" @cancel="handleUploadCancel"
        :confirm-loading="uploading" centered width="500px">
        <a-form-model :model="uploadForm" :rules="uploadRules" ref="uploadForm">
            <a-form-model-item label="选择聊天房间" prop="code">
                <a-select v-model="uploadForm.code" placeholder="请选择聊天房间" allowClear :loading="roomListLoading">
                    <a-select-option v-for="room in roomList" :key="room.id" :value="room.code">
                        {{ room.room_name || room.name || `房间 ${room.code}` }}
                    </a-select-option>
                </a-select>
            </a-form-model-item>

            <a-form-model-item label="文件名称" prop="file_name">
                <a-input v-model="uploadForm.file_name" placeholder="请输入文件名称（默认使用上传文件名）" :maxLength="200" />
            </a-form-model-item>
            <a-form-model-item label="选择文件" prop="url">
                <UploadFile v-model="uploadForm.url" />
            </a-form-model-item>
            <!-- <a-form-model-item label="文件大小">
          <span class="file-size-text" :class="{ 'loading': fileSizeLoading }">
            {{ fileSizeText }}
          </span>
        </a-form-model-item> -->
        </a-form-model>
    </a-modal>
</template>

<script>
import api from '@/api'

export default {
    name: 'UploadFileModel',
    props: {
        roomList: Array,
        roomListLoading: Boolean,
    },
    data() {
        return {
            uploadModalVisible: false,
            uploading: false,
            uploadForm: {
                code: undefined,
                uploader: this.$store?.state?.account?.user?.id,
                file_name: null,
                file_size: null,
                url: null,
            },
            uploadRules: {
                file_name: { required: true, message: '请输入文件名称', trigger: 'blur' },
                url: { required: true, message: '请选择文件', trigger: 'change' }
            },
            currentUploadFile: null,
            fileSize: 0, // 文件大小（字节）
            fileSizeLoading: false, // 获取文件大小中
            typeOptions: []
        }
    },
    watch: {
        // 监听文件URL变化，自动获取文件大小
        'uploadForm.url'(newUrl) {
            if (newUrl) {
                this.getFileSize(newUrl)
            } else {
                this.fileSize = 0
            }
        }
    },
    computed: {
        // 文件大小文本
        fileSizeText() {
            if (this.fileSizeLoading) {
                return '获取中...'
            }
            if (this.fileSize) {
                return this.formatFileSize(this.fileSize)
            }
            return '未选择文件'
        }
    },
    created() {
        this.getChatFileTypeList()
    },
    methods: {

        // 获取聊天文件类型列表
        getChatFileTypeList() {
            api.GetChatFileTypeList().then(res => {
                this.typeOptions = res || []
            })
                .catch(err => {
                    this.$message.error('获取聊天文件类型列表失败')
                })
        },

        // 确认上传
        handleUploadConfirm() {
            // 先检查文件是否已选择
            if (!this.uploadForm.url) {
                return this.$message.warning('请选择要上传的文件');
            }
            // 再验证表单
            this.$refs.uploadForm.validate(valid => {
                if (valid) {
                    //   console.info(this.uploadForm);
                    let params = JSON.parse(JSON.stringify(this.uploadForm));
                    params.file_size = this.fileSize ? this.fileSizeText : null;
                    api.AddChatFile(params).then(() => {
                        this.$message.success('上传成功')
                        this.uploadModalVisible = false
                        this.$emit('refresh');
                    })
                }
            })
        },

        // 取消上传
        handleUploadCancel() {
            this.uploadModalVisible = false
            this.uploadForm.url = null
            this.uploadForm.file_name = ''
        },

        // 显示上传弹窗
        open() {
            this.uploadModalVisible = true
            this.uploadForm.code = undefined
            this.uploadForm.url = null
            this.uploadForm.file_name = ''
            this.currentUploadFile = null
            this.fileSize = 0
            if (this.$refs.uploadForm) {
                this.$refs.uploadForm.resetFields()
            }
        },

        // 根据URL获取文件大小
        getFileSize(url) {
            if (!url) {
                this.fileSize = 0
                return
            }

            this.fileSizeLoading = true

            // 使用 fetch HEAD 请求获取文件大小
            fetch(url, { method: 'HEAD' })
                .then(response => {
                    const contentLength = response.headers.get('content-length')
                    if (contentLength) {
                        this.fileSize = parseInt(contentLength, 10)
                    } else {
                        // 如果 HEAD 请求没有返回大小，尝试 GET 请求（只获取部分数据）
                        this.getFileSizeByRange(url)
                    }
                    this.fileSizeLoading = false
                })
                .catch(() => {
                    // HEAD 请求失败，尝试使用 Range 请求
                    this.getFileSizeByRange(url)
                })
        },

        // 使用 Range 请求获取文件大小
        getFileSizeByRange(url) {
            fetch(url, {
                method: 'HEAD',
                headers: {
                    'Range': 'bytes=0-0'
                }
            })
                .then(response => {
                    const contentRange = response.headers.get('content-range')
                    if (contentRange) {
                        // Content-Range: bytes 0-0/1234567
                        const match = contentRange.match(/\/(\d+)/)
                        if (match) {
                            this.fileSize = parseInt(match[1], 10)
                        }
                    } else {
                        // 如果还是获取不到，尝试完整请求（不推荐，但作为备选方案）
                        this.getFileSizeByFullRequest(url)
                    }
                    this.fileSizeLoading = false
                })
                .catch(() => {
                    // 如果都失败，尝试完整请求
                    this.getFileSizeByFullRequest(url)
                })
        },

        // 完整请求获取文件大小（备选方案，可能较慢）
        getFileSizeByFullRequest(url) {
            fetch(url)
                .then(response => {
                    return response.blob()
                })
                .then(blob => {
                    this.fileSize = blob.size
                    this.fileSizeLoading = false
                })
                .catch(() => {
                    this.fileSize = 0
                    this.fileSizeLoading = false
                    this.$message.warning('无法获取文件大小')
                })
        },

        // 格式化文件大小
        formatFileSize(bytes) {
            if (!bytes || bytes === 0) return '0 B'
            const k = 1024
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
            const i = Math.floor(Math.log(bytes) / Math.log(k))
            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
        }


    }
}
</script>

<style scoped>
.ant-form-item {
    margin-bottom: 6px;
}
</style>