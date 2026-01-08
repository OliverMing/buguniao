<template>
    <div class="chat-file-manage">
      <!-- 操作栏 -->
      <div class="action-bar">
        <a-button type="primary" @click="$refs.uploadFile.open()">
          <plus-outlined></plus-outlined>新增课程</a-button>
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
        <!-- type slot -->
        <template slot="type" slot-scope="text,record">
          {{ getType(record.type) }}
        </template>
        <template slot="cover" slot-scope="text,record">
          <img style="width:60px;height: 30px;object-fit: cover;"
          :src="record.cover" />
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <a-button type="link" size="small" @click="$refs.uploadFile.open(record)">编辑</a-button>
          <a-button type="link" class="link-btn" size="small" @click="handleDelete(index, record)">删除</a-button>
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
      <UploadFile ref="uploadFile" 
      :roomList="roomList" 
      :roomListLoading="roomListLoading" 
      :typeOptions="typeOptions" 
      @refresh="getFileList" />
    </div>
  </template>
  
  <script>
  import api from '@/api'
  import { Modal } from 'ant-design-vue'
  import UploadFile from './Model/index.vue'
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '归属房间',
      dataIndex: 'code',
      width: 120,
      scopedSlots: { customRender: 'code' },
    },
    {
      title: '栏目',
      dataIndex: 'type',
      width: 100,
      scopedSlots: { customRender: 'type' },
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '封面',
      dataIndex: 'cover',
      scopedSlots: { customRender: 'cover' },
    },
    {
      title: '文件地址',
      dataIndex: 'url',
      width: 170,
      scopedSlots: { customRender: 'url' },
    },
    {
      title: '文件大小',
      dataIndex: 'file_size',
      width: 120,
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
      width: 150,
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
        typeOptions:[],
        roomListLoading: false,
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
      getType() {
        return (type) => {
          return this.typeOptions.find(item => item.id == type)?.label || ''
        }
      }
    },
    created() {
      this.getFileList()
      this.getRoomList()
      this.getChatFileTypeList()
    },
    methods: {

      // 获取聊天文件类型列表
      getChatFileTypeList() {
          api.GetChatFileTypeList().then(res => {
              this.typeOptions = res || []
          }).catch(err => {
              this.$message.error('获取聊天文件类型列表失败')
          })
      },
  
      // 获取文件列表
      getFileList() {
        this.loading = true
        // 假设 API 接口路径，请根据实际情况修改
        api.GetVipCourseList({
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
            this.roomList = data.filter(item => item.is_vip_room == 1);
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
            api.DeleteVipCourse(record.id).then(() => {
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
  