<template>
  <div>
      <a-table
        :dataSource="list"
        :columns="columns"
        :pagination="false"
        bordered
        size="middle">
          <div class="handler" slot="operation" slot-scope="text,record,index">
            
            <!-- <a-button v-if="!text.is_recycle" type="primary" @click="showAddresBox(index)" size="small" style="font-size:12px">新增批次</a-button> -->
            <a-dropdown>
              <a-menu slot="overlay" @click="handleMenuClick">
                <a-menu-item :key="`8-${index}`">追加数据</a-menu-item>
                <a-menu-item :key="`3-${index}`">下载Excel</a-menu-item>
                <a-menu-item :key="`4-${index}`">资源详情</a-menu-item>
                <a-menu-item :key="`5-${index}`">资源{{ text.status ? '禁用' : '解禁' }}</a-menu-item>
                <a-menu-item :key="`7-${index}`">改批次名</a-menu-item>
                <a-menu-item :key="`6-${index}`">删除</a-menu-item>
              </a-menu>
              <a-button type="primary" size="small" style="margin-right: 10px;background-color: #d96502;border: none;font-size: 12px;">更多操作<a-icon type="down" /></a-button>
            </a-dropdown>

            <a-button type="primary" @click="showRecycleIndex = index" size="small" style="font-size:12px">标记统计与设置</a-button>
          </div>
      </a-table>
      <div style="text-align: right;margin-top: 20px;margin-right: 0px;">
        <a-pagination
        :current="pageId"
        :pageSize="pageSize"
        :total="total" @change="changePageId" />
      </div>

  <!-- 回收池列表 -->
  <div v-if="showRecycleIndex != null">
    <Recycle 
    :id="list[showRecycleIndex].id"
    :markStr="list[showRecycleIndex].recycle_get_mark"
    @refresh="queryList"
    @close="showRecycleIndex = null" />
  </div>
    
  <!-- 追加资源 -->
    <div v-if="showAddResource">
      <a-drawer
        title="追加资源"
        :placement="'right'"
        :closable="false"
        width="40%"
        :visible="showAddResource"
        @close="showAddResource = false">
        <AddResource :pwd="addByPwd"  @success="refreshList" />
      </a-drawer>
    </div>

    <div v-if="showResourceList">
      <a-drawer
        title="资源池号码列表"
        :placement="'right'"
        :closable="false"
        width="70%"
        :visible="showResourceList"
        @close="showResourceList = false">
        <PhoneList :id="listId" />
      </a-drawer>
    </div>

    <div style="opacity:0;position:fixed;left: -2000px;top: -200px;">
      <AddAllResource ref="addAll" />
    </div>

  <a-modal
  title="单个下载文件数量"
  centered
  width="460px"
  :zIndex="9999"
  :footer="null"
  :maskClosable="false"
  @cancel="showDownloadLimit = false"
  :visible="showDownloadLimit">
    <a-input placeholder="单个下载文件数量" v-model="downloadNumber" />
    <div>
      <a-button type="primary" style="margin-top:15px" :loading="downLoading" @click="downloadFile">立即下载</a-button>
    </div>
  </a-modal>


  <a-modal
  title="Excel列表"
  centered
  width="560px"
  :footer="null"
  :maskClosable="false"
  @cancel="showDownList = false"
  :visible="showDownList">
    <div class="download-main" v-if="downLoadList">
       <div class="list-box">
        <div>资源池</div>
        <div class="item flex justify-star align-center" v-for="(item,index) in downLoadList.pool" :key="index">
          <div class="flex-1">{{ item }}</div>
          <a-button type="primary" size="small" @click="downloadExcel(item)">Downlod</a-button>
        </div>
       </div>
    </div>
  </a-modal>

  <!-- 追加数据 -->
  <!-- showZhuijia -->

  <div class="upload">
    <a-upload ref="zhuijia" :file-list="fileList" :before-upload="customUpload" accept=".xlsx,.xls">
      <a-button id="add">
          <upload-outlined></upload-outlined>
          选择文件
      </a-button>
  </a-upload>
  </div>


  <!-- 修改资源名 -->
  <a-modal 
      zIndex="9999" 
      v-model="showUpdate"
      title="修改批次名"
      centered
      @ok="updateName"
    >
    <a-input v-if="updateInfo" placeholder="修改批次名"  v-model="updateInfo.batch_name" />
  </a-modal>

  </div>
</template>

<script>
import api from '@/api'

import AddResource from './add'
import AddAllResource from './all-resource-add'
import PhoneList from './children/phone-list.vue'
import Recycle from './recycle'


import { Modal } from 'ant-design-vue'
import request from 'umi-request'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '批次',
    dataIndex: 'batch_name',
  },
  {
    title: '资源池密码',
    dataIndex: 'pwd',
  },
  {
    title: '回收池密码',
    dataIndex: 'recycle_pwd',
  },
  {
    title: '本批次总数',
    dataIndex: 'count_all',
  },
  {
    title: '本批次资源池剩余',
    dataIndex: 'count_super',
  },
  {
    title: '本批次回收池剩余',
    dataIndex: 'count_huishou_super',
  },
  {
    title: '已添加数',
    dataIndex: 'count_add',
  },
  {
    title: '同意未添加数',
    dataIndex: 'count_argee',
  },
  {
    title: '上传时间',
    dataIndex: 'create_time',
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
      showRecycleIndex:null,
      fileList:null,
      handlerItem:null,

      pageId:1, // 页码
      pageSize:10, // 页大小
      showAddResource:false, // 是否显示追加资源
      addByPwd:null, // 追加资源密码
      showResourceList:false, // 是否显示资源池手机号码列表
      showDownloadLimit:false,
      downloadNumber:1000,
      isDownloadRecly:false, // 是否下载回收池资源
      downLoading:false,

      showDownList:false,
      downLoadList:null,
      listId:null,
      current:-1,

      updateInfo:null,
      showUpdate:false,
      updateLoading:false,
      list:null, // 资源列表
      total:0, // 总数
      columns,
      logFiled:[
        { title: '手机号码', dataIndex: 'phone_num' },
        { title: '用户姓名', dataIndex: 'phone_name'},
        { title: '隶属资源池',scopedSlots: { customRender: 'rescouce_type' }},
        { title: "领取用户",scopedSlots: { customRender: 'user_id' } },
        { title: "标记",scopedSlots: { customRender: 'mark_id' }, },
        { title: '批次', dataIndex: 'batch' },
        { title: '上传时间', dataIndex: 'create_time' },
        { title: '领取时间', dataIndex: 'get_time' },
        {
          title:"操作",
          scopedSlots:{ customRender:"handler" }
        }
      ],
      searchFiled: [
        {
          title: '手机号码',
          dataIndex: 'phone',
        },
        {
          title: '用户姓名',
          dataIndex: 'phone_name',
        },
        { title: '隶属资源池',scopedSlots: { customRender: 'pwd' }},
        { title: '批次', dataIndex: 'batch' },
        {
          title: '上传时间',
          dataIndex: 'create_time',
        },
        {
          title:"操作",
          scopedSlots:{ customRender:"handler" }
        }
      ],
      desc:"资源列表",
      resourceList:[],
      markList:[],
      userList:[]
    }
  },
  components:{ AddResource,PhoneList,AddAllResource,Recycle },
  computed:{

    // 获取名字
    getMarkNameById(){
        return id => {
            const item = this.markList.find(e => e.id == id);
            return item?.mark_name || '未标记';
        }
    },

    // 获取标识颜色
    getMarkColor(){
        return id => {
            const item = this.markList.find(e => e.id == id);
            return item?.bg_color || '';
        }
    },

     // 获取资源池
     getPoolByPwd(){
        return pwd => {
            const item = this.resourceList.find(e => e.pwd == pwd);
            return item?.mark || '未标记';
        }
    },

    // 获取用户姓名
    getUserName(){
        return id => {
            const item = this.userList.find(e => e.id == id);
            return item?.nick_name || id;
        }
    },

  },
  created() {
    this.queryPool();
    this.getMarkAllList();
    this.GetAllUserList();
    this.queryList();
  },
  methods: {

    // 追加资源
    customUpload:function(file){
      let formData = new FormData();
      formData.append('files', file);
      formData.append('batch_id',this.handlerItem.id);
      this.uploading = true;

      request(`${process.env.VUE_APP_API_BASE_URL}/Anp/ZhuiJiaResource`, {
          method: 'post',
          data: formData,
      }).then(res => {
        if(res.state == 'success'){
          this.$message.success(`追加资源成功啦~`);
          this.queryList();
        }
      })
      return false;
    },

    //获取资源池列表
    queryPool:function(){
        api.GetAllPool().then(data => {
          this.resourceList = data.reverse();
        })
    },

    GetAllUserList:function(){
      api.GetAllUserList().then(e => {
        this.userList = e;
      })
    },

    // 获取标签列表
    getMarkAllList:function(){
        api.GetMarkList().then(data => {
          this.markList = data
        })
    },

    onChange:function(e){
      this.isDownloadRecly = e.target.checked;
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
       this.listId = this.list[index].id;
       this.showResourceList = true;
    },

    handleMenuClick(e){
      let arr = e.key.split('-');
      const index = Number(arr[1]);

      this.handlerItem = this.list[index];

      switch(Number(arr[0])){
        case 1:this.$refs.addAll.uploadClick();break;
        case 3: this.showDownloadLimit = true;this.downloadPwd = this.list[index].pwd;break;
        case 4:this.showPhoneList(index);break;
        case 5:this.setStatus(index);break;
        case 6:this.handleDelete(index);break;
        case 7:this.updateResourceName(index);break;
        case 8:this.openAdd(index);break;
      }
    },

    // 追加数据
    openAdd:function() {
      document.getElementById("add").click();
    },

    // 修改资源名称
    updateResourceName:function(index){
      this.updateInfo = JSON.parse(JSON.stringify(this.list[index]));
      this.showUpdate = true;
    },

    // 修改资源池名
    updateName:function(){
      const { id,batch_name } = this.updateInfo;
      if(!batch_name){
        return this.$message.error("请输入名称");
      }
      debugger;
      var s = this.updateInfo;
      this.updateLoading = true;
      api.UpdateResourceName(id,batch_name).then(() => {
        this.updateLoading = false;
        this.showUpdate = false;
        this.updateInfo = null;
        this.$message.success("修改名称成功！");
        this.queryList();
      }).catch(() => {
        this.updateLoading = false;
      })
    },

    // 下载excel
    downloadFile:function(){
      this.downLoading = true;
      request(`${process.env.VUE_APP_API_BASE_URL}/Anp/DownloadFile?pwd=${this.downloadPwd}&count=${this.downloadNumber}`, {
          method: 'get',
      }).then(res => {
        this.downLoading = false;
        this.showDownloadLimit = false;
        this.showDownList = true;
        this.downLoadList = res.data;
      })
    },

    downloadExcel:function(e){
      let a = document.createElement('a');
      a.href = window.origin + '/' + e;
      a.setAttribute('target','_self');
      a.click();
    },

    // 获取列表
    queryList:function(){
      api.GetResourceList({
        pageId:this.pageId,
        pageSize:this.pageSize
      }).then(e => {
        const { total,records } = e;
        this.list = records;
        this.total = total;
      });
    },

    // 删除确认操作
    handleDelete:function(index){
      const id = this.list[index].id;
      alert(id);
      Modal.confirm({
        title: '删除资源',
        content: '确定要删除该资源？',
        okText: '确认',
        cancelText: '取消',
        onOk:() => {
          // 调用删除
          api.DeletePool(id).then(() => {
            this.$emit("refresh");
          });
          this.list.splice(index,1);
        }
      });
    },

    setStatus:function(index){
      api.UpdatePoolStatus(this.list[index].id).then(() => {
        this.list[index].status = this.list[index].status ? 0 : 1;
        this.$message.success('操作成功');
      });
    }
  }
  
}
</script>

<style lang="less" scoped>
.steps{ max-width: 950px; margin: 16px auto; }
.handler{ display: flex;justify-content: center; align-items: center;flex-wrap: nowrap;}
.download-main{height: 400px;overflow-y: auto;}
.download-main::-webkit-scrollbar{width: 0 !important;}
.list-box{margin-bottom: 20px;background-color: #f5f5f5;padding: 10px;}
.list-box>div:first-child{font-weight: bold;font-size: 14px;}
.item{margin: 10px 0;}

.history-list:not(:last-child){margin-bottom:20px;}
.history-list>div{margin-bottom: 5px;}

.upload{position: fixed;right: -2000px;opacity: 0;}
</style>

