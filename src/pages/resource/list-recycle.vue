<template>
    <div>
      <a-card :bordered="false">
        <a-table
          :dataSource="list"
          :columns="columns"
          :pagination="false"
          bordered
          size="middle">
          <!-- slot-scope="" -->
            <div slot="is_recycle" slot-scope="text">
               <a-tag v-if="text.is_recycle" color="#f50">回收池</a-tag>
               <a-tag v-else color="#108ee9">上传池</a-tag>
            </div>
            <div class="handler" slot="operation" slot-scope="text,record,index">
              <!-- <a-button v-if="!text.is_recycle" type="primary" @click="showAddresBox(index)" size="small">追加资源</a-button> -->
              <a-button type="primary" @click="showPhoneList(index)" size="small" style="margin:0 10px;background-color: slategrey;border-color: slategray;">详情</a-button>
              <a-button :type="text.status ? 'danger' : 'dashed'" @click="setRecycleStatus(index)" size="small" style="margin-right:10px">{{ text.status ? '禁用' : '解禁' }}</a-button>
              <a-button type="danger" @click="handleDelete(index)" size="small">删除</a-button>
            </div>
        </a-table>
        <div style="text-align: right;margin-top: 20px;margin-right: -8px;">
          <a-pagination
          :current="pageId"
          :pageSize="pageSize"
          :total="total" @change="changePageId" />
        </div>
    </a-card>
      
    <!-- 追加资源 -->
      <div v-if="showAddResource">
        <a-drawer
          title="追加资源"
          :placement="'right'"
          :closable="false"
          width="40%"
          :visible="showAddResource"
          @close="showAddResource = false">
          <AddResource :pwd="addByPwd" :isUpdate="true" @success="refreshList" />
        </a-drawer>
      </div>
  
      <div v-if="showResourceList">
        <a-drawer
          title="资源池号码列表"
          :placement="'right'"
          :closable="false"
          width="50%"
          :visible="showResourceList"
          @close="showResourceList = false">
          <PhoneList :pwd="listPwd" />
        </a-drawer>
      </div>
    </div>
  </template>
  
  <script>
  import { getResourceList,deleteResource,setResourceStatus } from '@/services/resource'
  import AddResource from './add'
  import PhoneList from './children/phone-list.vue'
  
  import { Modal } from 'ant-design-vue'
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '资源池名',
      dataIndex: 'mark',
    },
    {
      title: '资源池密码',
      dataIndex: 'pwd',
    },
    {
      title: '资源池总数',
      dataIndex: 'count',
    },
    {
      title: '剩余',
      dataIndex: 'super_count',
    },
    {
      title: '资源池类型',
      scopedSlots: { customRender: 'is_recycle' },
      align: 'center',
      width:280
    },
    {
      title: '上传时间',
      dataIndex: 'creator_time',
    },
    {
      title: '操作',
      scopedSlots: { customRender: 'operation' },
      align: 'center',
      width:280
    }
  ]
  
  export default {
    name: 'User',
    data () {
      return {
        pageId:1, // 页码
        pageSize:10, // 页大小
        showAddResource:false, // 是否显示追加资源
        addByPwd:null, // 追加资源密码
        showResourceList:false, // 是否显示资源池手机号码列表
        listPwd:null,
        list:null, // 资源列表
        total:0, // 总数
        columns,
        desc:"资源列表"
      }
    },
    components:{ AddResource,PhoneList },
    created() {
      this.queryList();
    },
    methods: {

      setRecycleStatus:function(index){
        setResourceStatus(this.list[index].id).then(() => {
          this.list[index].status = this.list[index].status ? 0 : 1;
          this.$message.success('操作成功');
        });
      },
  
      changePageId: function (e) {
        this.pageId = e;
        this.queryList();
      },
  
      // 刷新列表
      refreshList:function(){
        this.queryList();
        this.showAddResource = false;
      },
  
      // 打开追加资源框
      showAddresBox:function(index){
         this.addByPwd = this.list[index].pwd;
         this.showAddResource = true;
      },
  
      // 打开手机列表框
      showPhoneList:function(index){
         this.listPwd = this.list[index].pwd;
         this.showResourceList = true;
      },
      
  
      // 获取列表
      queryList:function(){
        getResourceList({
          pageId:this.pageId,
          pageSize:this.pageSize,
          type:1
        }).then(({ data }) => {
          const { total,records } = data.data;
          this.list = records;
          this.total = total;
        });
      },
  
      // 删除确认操作
      handleDelete:function(index){
        Modal.confirm({
          title: '删除资源',
          content: '确定要删除该资源？',
          okText: '确认',
          cancelText: '取消',
          onOk:() => {
            // 调用删除用户
            deleteResource({ id:this.list[index].id });
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
  