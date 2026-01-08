<template>
    <!-- 上传文件弹窗 -->
    <a-modal title="上传文件" 
    :visible="uploadModalVisible" @ok="handleUploadConfirm" @cancel="handleUploadCancel"
        :confirm-loading="uploading" centered width="680px">
        <a-form-model :model="uploadForm" 
        :rules="uploadRules" ref="uploadForm">
            
            <a-form-model-item label="栏目类型" prop="type">
                <a-select v-model="uploadForm.type" placeholder="请选择栏目类型" allowClear>
                    <a-select-option 
                    v-for="item in typeOptions" 
                    :key="item.id" 
                    :value="item.id"
                    :disabled="item.id == 1">
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-form-model-item>

            <a-form-model-item label="标题" prop="title">
                <a-input v-model="uploadForm.title" placeholder="请输入文件名称（默认使用上传文件名）" :maxLength="200" />
            </a-form-model-item>

            <a-form-model-item label="作者" prop="author">
                <a-input v-model="uploadForm.author" placeholder="请输入作者名称" :maxLength="200" />
            </a-form-model-item>

            <a-form-model-item label="地址" prop="address">
                <a-input v-model="uploadForm.address" placeholder="地址（北京）" :maxLength="200" />
            </a-form-model-item>
            

            <a-form-model-item label="选择文件" prop="url" v-if="[2,5].includes(uploadForm.type)">
                <UploadFile v-model="uploadForm.url" />
                <div class="flex justify-between items-center" v-if="uploadForm.url">
                  <span>{{ uploadForm.url }}</span>
                  <!-- 删除按钮 -->
                  <a-button type="link" class="link-btn" @click="uploadForm.url = null">删除</a-button>
                </div>
            </a-form-model-item>

            <!-- 富文本文章详情 -->
            <a-form-model-item label="文章详情" prop="content" v-else>
              <quill-editor
              ref="msgEditor"
              class="msg-text-editor"
              v-model="uploadForm.content"
              :options="editorOption" />
            </a-form-model-item>

            <a-form-model-item label="选择聊天房间" prop="code">
                <a-select v-model="uploadForm.code" placeholder="请选择聊天房间" allowClear :loading="roomListLoading">
                    <a-select-option v-for="room in roomList" :key="room.id" :value="room.code">
                        {{ room.room_name || room.name || `房间 ${room.code}` }}
                    </a-select-option>
                </a-select>
            </a-form-model-item>

            <a-form-model-item label="封面" prop="cover">
              <UploadImage 
              v-model="uploadForm.cover" />
              <div style="margin-top: -20px;color: #999;font-size: 12px;">建议尺寸：880x440px [ 2:1 ]</div>
            </a-form-model-item>

            <!-- read_count -->
            <a-form-model-item label="阅读量">
                <a-input-number v-model="uploadForm.read_count" :min="0" />
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
import request from 'umi-request'

export default {
    name: 'UploadFileModel',
    props: {
        roomList: Array,
        roomListLoading: Boolean,
        typeOptions: Array,
    },
    data() {
        return {
            uploadModalVisible: false,
            uploading: false,
            uploadForm: { },
            uploadRules: {
                title: { required: true, message: '请输入文件名称', trigger: 'blur' },
                type: { required: true, message: '请选择文件类型', trigger: 'change' },
                url: { required: true, message: '请选择文件', trigger: 'change' },
            },
            currentUploadFile: null,
            fileSize: 0, // 文件大小（字节）
            fileSizeLoading: false, // 获取文件大小中
            // 富文本配置
            editorOption: {
                modules: {
                    toolbar: {
                        container: [
                            // 文字格式
                            ['bold', 'italic', 'underline', 'strike'],        // 加粗、斜体、下划线、删除线
                            // [{ 'size': ['10px', '12px', '14px', '16px', '18px', '20px'] }],  // 字体大小
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],      // 标题
                            // [{ 'font': [] }],                                 // 字体
                            // 列表
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],   // 有序列表、无序列表
                            // 颜色
                            [{ 'color': [] }, { 'background': [] }],         // 文字颜色、背景色
                            // 对齐方式
                            [{ 'align': [] }],                                // 左对齐、居中、右对齐、两端对齐
                            // 其他
                            ['blockquote', 'code-block'],                    // 引用、代码块
                            ['link', 'image', 'video'],                      // 链接、图片、视频
                            ['clean']                                        // 清除格式
                        ],
                        handlers: {
                            // 自定义图片上传处理器
                            image: () => {
                                this.handleImageUpload()
                            }
                        }
                    }
                },
                placeholder: '请输入文章详情内容...',
                theme: 'snow'  // 主题：snow 或 bubble
            }
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
    methods: {

        getInitialForm() {
            return {
              id:null,
              code: undefined,
              uploader: this.$store?.state?.account?.user?.id,
              title: null,
              file_size: null,
              type: undefined,
              url: null,
              cover:null,
              content:null,
              author:null,
              address:null,
              read_count:0
            }
        },

        // 确认上传
        handleUploadConfirm() {
            // 先检查文件是否已选择
            if (!this.uploadForm.url && this.uploadForm.type == 2) {
                return this.$message.warning('请选择要上传的文件');
            }
            // 再验证表单
            this.$refs.uploadForm.validate(valid => {
                if (valid) {
                    //   console.info(this.uploadForm);
                    let params = JSON.parse(JSON.stringify(this.uploadForm));
                    params.file_size = this.fileSize ? this.fileSizeText : null;
                    api[params.id ? 'UpdateVipCourse' : 'AddVipCourse'](params).then(() => {
                        this.$message.success('执行成功')
                        this.$emit('refresh');
                        this.uploadModalVisible = false
                    })
                }
            })
        },

        // 取消上传
        handleUploadCancel() {
            this.uploadModalVisible = false
            this.loading = false
            this.$nextTick(() => {
                if (this.$refs.uploadForm) {
                    this.$refs.uploadForm.resetFields()
                }
            })
        },

        // 显示上传弹窗
        open(record = null) {
            this.uploadModalVisible = true
            if (record) {
                this.uploadForm = { ...this.getInitialForm(), ...record }
            } else {
                this.uploadForm = this.getInitialForm()
            }

            if(!this.uploadForm.code) this.uploadForm.code = undefined;


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
        debugger;
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
      },

      // 处理图片上传
      handleImageUpload() {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()
        
        input.onchange = () => {
          const file = input.files[0]
          if (!file) return
          
          // 验证文件类型
          const isImage = file.type.startsWith('image/')
          if (!isImage) {
            this.$message.error('只能上传图片文件')
            return
          }
          
          // 验证文件大小（2MB）
          const isLt2M = file.size / 1024 / 1024 < 2
          if (!isLt2M) {
            this.$message.error('图片大小不能超过 2MB')
            return
          }
          
          // 上传文件
          const formData = new FormData()
          formData.append('files', file)
          
          const hide = this.$message.loading('图片上传中...', 0)
          
          request(`${process.env.VUE_APP_API_BASE_URL}/Admin/UploadFile`, {
            method: 'post',
            data: formData
          }).then(res => {
            hide()
            const baseUrl = `${process.env.VUE_APP_API_BASE_URL}`
            const imageUrl = res.data ? `${baseUrl}/${res.data}` : res.data
            
            // 获取编辑器实例并插入图片
            const editor = this.$refs.msgEditor
            if (editor && editor.quill) {
              const quill = editor.quill
              const range = quill.getSelection(true) || { index: 0, length: 0 }
              quill.insertEmbed(range.index, 'image', imageUrl)
              quill.setSelection(range.index + 1)
            }
            
            this.$message.success('图片上传成功')
          }).catch(err => {
            hide()
            this.$message.error('图片上传失败：' + (err.message || '未知错误'))
          })
        }
      }

    }
}
</script>

<style scoped>
.ant-form-item{
    margin-bottom: 6px;
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
  