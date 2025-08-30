<template>
  <a-card :bordered="false">
    <div>
      <a-table
        :dataSource="list"
        :columns="columns"
        :pagination="false"
        bordered
        size="middle">
        <!-- slot-scope="" -->
          <div class="handler" slot="operation" slot-scope="text,record,index">
            <a-button type="primary" @click="handleUpdate(index)" size="small" style="margin-right:10px">修改</a-button>
            <a-button type="danger" @click="handleDelete(index)" size="small">删除</a-button>
          </div>
      </a-table>
      <div style="text-align: right;margin-top: 20px;margin-right: -8px;">
        <a-pagination
        show-size-changer
        :current="pageId"
        :pageSize="pageSize"
        :total="total"
        @showSizeChange="onShowSizeChange" />
      </div>
    </div>
  </a-card>
</template>

<script>
import { getUserList,deleteUser } from '@/services/user'
import { Modal } from 'ant-design-vue'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'NAME',
    dataIndex: 'account',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
  },
  {
    title: '今日资源领取数',
    dataIndex: 'today_resource_num',
  },
  {
    title: '隶属部门',
    dataIndex: 'department',
  },
  {
    title: '注册时间',
    dataIndex: 'create_time',
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
    width:180
  }
]

export default {
  name: 'User',
  data () {
    return {
      pageId:1,
      pageSize:10,
      list:null,
      total:0,
      columns
    }
  },
  computed: {
    desc() {
      return "用户管理，可对用户进行增加删除操作";
    }
  },
  created() {
    this.queryList();
  },
  methods: {
    onShowSizeChange:function(e){
      console.info(e);
    },
    // 获取用户列表
    queryList:function(){
      getUserList({
        pageId:this.pageId,
        pageSize:this.pageSize
      }).then(({ data }) => {
        const { total,records } = data.data;
        this.list = records;
        this.total = total;
      });
    },
    // 删除确认操作
    handleDelete:function(index){
      Modal.confirm({
        title: '删除用户',
        content: '确定要删除该用户吗？',
        okText: '确认',
        cancelText: '取消',
        onOk:() => {
          // 调用删除用户
          deleteUser({ id:this.list[index].id });
          this.list.splice(index,1);
        }
      });
    }
  }
  
}
</script>

<style lang="less" scoped>
  .steps{
    max-width: 950px;
    margin: 16px auto;
  }
.handler{ display: flex;justify-content: center; align-items: center;flex-wrap: nowrap; }
</style>
