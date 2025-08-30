<template>
    <div>
      <div class="flex justify-start align-center" style="margin-bottom:20px">
        <a-button type="primary" @click="showAdd = true">添加新版本</a-button>
      </div>
      <a-card :bordered="false">
        <a-table
          :dataSource="list"
          :columns="columns"
          :pagination="false"
          bordered
          size="middle">
          <!-- slot-scope="" -->
            <div class="handler" slot="operation" slot-scope="text,record,index">
              <a-button type="danger" @click="handleDelete(index)" size="small" style="font-size:12px">删除</a-button>
            </div>
        </a-table>
        <div style="text-align: right;margin-top: 20px;margin-right: -8px;">
          <a-pagination
          :current="pageId"
          :pageSize="pageSize"
          :total="total" @change="changePageId" />
        </div>
    </a-card>
  
      <!-- 模糊搜索 -->
      <a-modal
      title="上传新的APP资源包"
      centered
      width="760px"
      :footer="null"
      @cancel="showAdd = false"
      :visible="showAdd">
        <Add  @refresh="refreshList" />
      </a-modal>
  
      
  
    </div>
  </template>
  
  <script>
  import api from '@/api'
  import Add from './children/add'
  import { columns } from './columns'
  import { Modal } from 'ant-design-vue'

  export default {
    name: 'User',
    data () {
      return {
        searchList:[],
        pageId:1, // 页码
        pageSize:10, // 页大小
        showAdd:false, // 是否显示新增版本
        listPwd:null,
        list:[], // 资源列表
        total:0, // 总数
        columns,
        desc:"APP版本管理中心"
      }
    },
    components:{ Add },
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
        this.showAdd = false;
        this.queryList();
      },
  
      // 获取列表
      queryList:function(){
        api.GetVersionlist({
          pageId:this.pageId,
          pageSize:this.pageSize,
        }).then(data => {
          const { total,records } = data;
          this.list = records;
          this.total = total;
        });
      },
  
      // 删除确认操作
      handleDelete:function(index){
        Modal.confirm({
          title: '删除提醒',
          content: '确定要删除该版本？',
          okText: '确认',
          cancelText: '取消',
          onOk:() => {
            api.DeleteVersion(this.list[index].id).then(data => {
               if(data){
                this.$message.success(`删除成功~`);
                this.queryList();
               }
            })
          }
        });
      },
    }
    
  }
  </script>
  
  <style lang="less" scoped>
    .steps{
      max-width: 950px;
      margin: 16px auto;
    }
  .handler{ display: flex;justify-content: center; align-items: center;flex-wrap: nowrap;}
  </style>
  