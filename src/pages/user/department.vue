<template>
  <div>
    <div class="flex justify-start align-center" style="margin-bottom:20px">
      <a-button type="primary" @click="showAdd = true">添加部门</a-button>
    </div>
    <a-card :bordered="false">
      <div>
        <a-table
          :dataSource="list"
          :columns="columns"
          :pagination="false"
          bordered
          size="middle">
            <span slot="pid"  slot-scope="text">{{ getDepartmentName(text.pid) }}</span>
            <div class="handler" slot="operation" slot-scope="text,record,index">
              <a-button type="primary" @click="openLimit(index)" size="small" style="margin:0 10px">权限设置</a-button>
              <a-button type="danger" @click="handleDelete(index)" size="small">删除</a-button>
            </div>
        </a-table>
      </div>
    </a-card>

    <a-modal
    title="新增部门"
    centered
    width="760px"
    :footer="null"
    @cancel="showAdd = false"
    :visible="showAdd">
      <Add  @refresh="queryList" :show.sync="showAdd" />
    </a-modal>

    <a-modal
    title="权限设置"
    centered
    width="460px"
    :footer="null"
    @cancel="showLimit = false"
    :visible="showLimit">
      <Limit v-if="showLimit" :type="0" :id="`department-${chooseId}`" :departmentList="departmentList" />
    </a-modal>

    <!-- 获取部门列表 -->
    <Department :show="false" :isTree="true" :list.sync="departmentList" />

  </div>
</template>
  
<script>
import Add from './children/add-department'
import Limit from './children/limit'
import Department from './children/add-department'

import api from '@/api'
import { Modal } from 'ant-design-vue'

export default {
  name: 'User',
  data () {
    return {
      pageId:1,
      pageSize:10,
      showAdd:false,
      showLimit:false,
      list:[],
      departmentList:[], //部门列表
      chooseId:null,
      total:0,
      columns:[
        { title: 'ID', dataIndex: 'id' },
        { title: '父级部门', scopedSlots: { customRender: 'pid' } },
        { title: '部门名称', dataIndex: 'name' },
        { title: '注册时间',dataIndex: 'create_time'},
        { title: '操作', scopedSlots: { customRender: 'operation' }, align: 'center', width:180 }
      ]
    }
  },
  components:{ Add,Limit,Department },
  computed:{
    getDepartmentName(){
      return id => {
        if(!id) return '一级部门';
        const item = this.list.find(e => e.id == id);
        return item?.name || '未知';
      }
    }
  },
  created() {
    this.queryList();
  },
  methods: {

    onShowSizeChange:function(e){
      console.info(e);
    },

    changePageId: function (e) {
      this.pageId = e;
      this.queryList();
    },

    // 打开权限设置
    openLimit:function(index){
      this.chooseId = this.list[index].id;
      this.showLimit = true;
    },

    // 获取列表
    queryList:function(){
      api.GetAllDepartmentList().then(res => {
        this.list = res;
        this.total = res.length;
      });
    },

    // 删除确认操作
    handleDelete:function(index){
      Modal.confirm({
        title: '删除部门',
        content: '确定要删除该部门吗？',
        okText: '确认',
        cancelText: '取消',
        onOk:() => {
          // 调用删除用户
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