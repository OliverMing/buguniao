<template>
    <div>
      
      <a-card :bordered="false">
        <a-button type="primary" @click="showScrollUser = true" size="midden" style="margin-right:20px;background-color:chocolate;border-color: transparent;">滚动用户列表</a-button>
        <a-button type="primary" @click="showAddResource = true" size="midden" style="margin-bottom:20px">上传二维码</a-button>
        <a-table
          :dataSource="list"
          :columns="columns"
          :pagination="false"
          bordered
          size="middle">
              <div slot="url" slot-scope="e">
                <img :src="e.url" style="width:80px;height:80px" alt="">
              </div>
              <div class="handler" slot="operation" slot-scope="text,record,index">
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
      
    <!-- 新增二维码 -->
      <div v-if="showAddResource">
        <a-drawer
          title="新增二维码"
          :placement="'right'"
          :closable="false"
          width="40%"
          :visible="showAddResource"
          @close="showAddResource = false">
          <AddResource :pwd="addByPwd" :isUpdate="true" @success="refreshList" />
        </a-drawer>
      </div>
      <!-- 是否弹出滚动用户组件 -->
      <ScrollUser v-if="showScrollUser" @close="showScrollUser = false" />
    </div>
  </template>
  
  <script>
  import { Modal } from 'ant-design-vue'
  
  import { getErcodeList,deleteErcode } from '@/services/ercode'
  import AddResource from './children/add-ercode'
  import ScrollUser from './children/scroll-user'
  import { ercodeColumns } from './data'

  export default {
    name: 'User',
    data () {

      return {
        pageId:1, // 页码
        pageSize:10, // 页大小
        showAddResource:false, // 是否显示追加资源
        showScrollUser:false, // 是否显示滚动用户数据
        addByPwd:null, // 追加资源密码
        showResourceList:false, // 是否显示资源池手机号码列表
        listPwd:null,
        list:null, // 资源列表
        total:0, // 总数
        columns:ercodeColumns,
        desc:`二维码H5链接生成-> ${window.origin}/ercode/?v=专属码`
      }
    },
    components:{ AddResource,ScrollUser },
    created() {
      this.queryList();
    },
    methods: {
  
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
        getErcodeList({
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
          title: '删除二维码',
          content: '确定要删除该二维码？',
          okText: '确认',
          cancelText: '取消',
          onOk:() => {
            // 调用删除用户
            deleteErcode(this.list[index].id);
            this.list.splice(index,1);
          }
        });
      }

    }
  }
  </script>
  
<style lang="less" scoped>
  .steps{ max-width: 950px; margin: 16px auto;  }
  .handler{ display: flex;justify-content: center; align-items: center;flex-wrap: nowrap; }
  .title{font-weight: bold;margin-bottom: 14px;font-size: 18px;}
  .title span{padding: 0 10px;border-left: 6px solid seagreen;}
  </style>
  