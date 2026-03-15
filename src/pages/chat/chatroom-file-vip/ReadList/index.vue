<template>
  <!-- 阅读量列表弹窗 -->
  <a-modal 
    title="阅读量列表" 
    :visible="modalVisible" 
    @cancel="handleCancel"
    :footer="null"
    centered 
    width="900px">
    <a-table
      :dataSource="readList"
      :columns="columns"
      :pagination="false"
      :loading="loading"
      bordered
      size="middle"
      rowKey="id">
      <template slot="nickname" slot-scope="text,record">
        <span>{{ record.userInfo.nickname }}</span>
      </template>
      <template slot="avatar" slot-scope="text,record">
        <img :src="record.userInfo.headimgurl" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
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
  </a-modal>
</template>

<script>
import api from '@/api'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
    align: 'center',
  },
  {
    title: '用户ID',
    dataIndex: 'user_id',
    width: 120,
    align: 'center',
  },
  {
    title: '用户昵称',
    dataIndex: 'nickname',
    align: 'center',
    scopedSlots: { customRender: 'nickname' },
  },
  {
    title: '用户头像',
    dataIndex: 'avatar',
    width: 100,
    align: 'center',
    scopedSlots: { customRender: 'avatar' },
  },
  {
    title: '阅读次数',
    dataIndex: 'count',
    align: 'center',
  },
  {
    title: '最新阅读时间',
    dataIndex: 'create_time',
    width: 180,
    align: 'center',
  },
]

export default {
  name: 'ReadList',
  data() {
    return {
      modalVisible: false,
      readList: [],
      loading: false,
      pageId: 1,
      pageSize: 10,
      total: 0,
      courseId: null,
      columns,
    }
  },
  methods: {
    // 打开弹窗
    open(record) {
      this.modalVisible = true
      this.courseId = record.id
      this.pageId = 1
      this.getReadList()
    },

    // 关闭弹窗
    handleCancel() {
      this.modalVisible = false
      this.readList = []
      this.total = 0
      this.courseId = null
    },

    // 获取阅读量列表
    getReadList() {
      if (!this.courseId) return
      
      this.loading = true
      api.GetVipFileReadList({
        courseId: this.courseId,
        pageId: this.pageId,
        pageSize: this.pageSize
      }).then(res => {
        const { total, records, list } = res
        this.readList = records || list || []
        this.total = total || 0
        this.loading = false
      }).catch(err => {
        this.$message.error('获取阅读量列表失败')
        this.loading = false
      })
    },

    // 分页改变
    changePage(page) {
      this.pageId = page
      this.getReadList()
    },

    // 每页条数改变
    onShowSizeChange(current, size) {
      this.pageId = 1
      this.pageSize = size
      this.getReadList()
    },
  }
}
</script>

<style lang="less" scoped>
.pagination-wrapper {
  margin-top: 20px;
  text-align: right;
}
</style>

