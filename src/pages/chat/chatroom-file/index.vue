<template>
  <div class="chat-file-manage">
    <!-- 操作栏 -->
    <div class="action-bar">
      <a-button type="primary" @click="$refs.uploadFile.open()">
        <upload-outlined></upload-outlined>
        上传文件
      </a-button>
    </div>

    <!-- 文件列表表格 -->
    <a-table
      :dataSource="fileList"
      :columns="columns"
      :pagination="false"
      :loading="loading"
      bordered
      size="middle"
      rowKey="id">
      <template slot="url" slot-scope="text">
        <a :href="text" target="_blank">{{ text }}</a>
      </template>
      <template slot="file_type" slot-scope="text,record">
        {{ getFileType(record.url) }}
      </template>
      <template slot="code" slot-scope="text">
        {{ text || '公共文件' }}
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <a-button type="danger" size="small" @click="handleDelete(index, record)">
          删除
        </a-button>
      </template>
    </a-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <a-pagination
        :current="pageId"
        :pageSize="pageSize"
        :total="total"
        :showTotal="(total) => `共 ${total} 条记录`"
        @change="changePage"
        @showSizeChange="onShowSizeChange" />
    </div>

    <!-- 上传文件弹窗 -->
    <UploadFile ref="uploadFile" :roomList="roomList" :roomListLoading="roomListLoading" @refresh="getFileList" />
  </div>
</template>

<script>
import api from '@/api'
import { Modal } from 'ant-design-vue'
import UploadFile from './Model/index.vue'

const columns = [
//   {
//     title: 'ID',
//     dataIndex: 'id',
//     width: 80,
//   },
  {
    title: '归属房间',
    dataIndex: 'code',
    scopedSlots: { customRender: 'code' },
  },
  {
    title: '文件名称',
    dataIndex: 'file_name',
  },
  {
    title: '文件地址',
    dataIndex: 'url',
    scopedSlots: { customRender: 'url' },
  },
  {
    title: '文件大小',
    dataIndex: 'file_size',
  },
  {
    title: '文件类型',
    dataIndex: 'file_type',
    scopedSlots: { customRender: 'file_type' },
    width: 120,
  },
  {
    title: '上传时间',
    dataIndex: 'create_time',
    width: 180,
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
    width: 100,
  }
]

export default {
  name: 'ChatFileManage',
  components: {
    UploadFile
  },
  data() {
    return {
      fileList: [],
      columns,
      loading: false,
      pageId: 1,
      pageSize: 10,
      total: 0,
      roomList: [],
      roomListLoading: false,
    }
  },
  
  created() {
    this.getFileList()
    this.getRoomList()
  },
  methods: {

    // 获取文件列表
    getFileList() {
      this.loading = true
      // 假设 API 接口路径，请根据实际情况修改
      api.GetChatFileList({
        pageId: this.pageId,
        pageSize: this.pageSize
      }).then(res => {
        const { total, records, list } = res
        this.fileList = records || list || []
        this.total = total || 0
        this.loading = false
      }).catch(err => {
        this.$message.error('获取文件列表失败')
        this.loading = false
      })
    },

    // 获取聊天房间列表
    getRoomList() {
      this.roomListLoading = true
      const userId = this.$store?.state?.account?.user?.id
      if (userId) {
        api.getLiveRoomListAll().then(data => {
          this.roomList = data || []
          this.roomListLoading = false
        })
      }
    },

    // 删除文件
    handleDelete(index, record) {
      Modal.confirm({
        title: '删除文件',
        content: `确定要删除文件 "${record.file_name}" 吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          api.DeleteChatFile(record.id).then(() => {
            this.$message.success('删除成功')
            this.getFileList()
          }).catch(() => {
            this.$message.error('删除失败')
          })
        }
      })
    },

    // 分页改变
    changePage(page) {
      this.pageId = page
      this.getFileList()
    },

    // 每页条数改变
    onShowSizeChange(current, size) {
      this.pageId = 1
      this.pageSize = size
      this.getFileList()
    },

    // 获取文件URL
    getFileUrl(url) {
      if (!url) return ''
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
      }
      return `${process.env.VUE_APP_API_BASE_URL}/${url}`
    },


    // 获取文件类型
    getFileType(fileName) {
      if (!fileName) return ''
      const ext = fileName.split('.').pop().toLowerCase()
      return ext || 'other'
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

<style lang="less" scoped>
.chat-file-manage {
  padding: 24px;
  background-color: #fff;

  .action-bar {
    margin-bottom: 16px;
    display: flex;
    justify-content: flex-start;
  }

  .pagination-wrapper {
    margin-top: 20px;
    text-align: right;
  }

  .file-size-text {
    color: #666;
    
    &.loading {
      color: #1890ff;
      font-style: italic;
    }
  }
}
</style>
