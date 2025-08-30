<template>
    <div>
      <a-card style="margin-bottom:20px">
        <div class="flex justify-start align-center">
          <div class="flex-1">
            <a-input style="width:280px;margin-right:20px" placeholder="请输入手机号（模糊搜索）" v-model="content" />
            <a-button type="primary" @click="searchPhone">搜索手机号码</a-button>
            <a-button type="danger" @click="searchPhoneHistory" style="margin-left:10px">流转记录</a-button>
          </div>
          <a-button type="primary" @click="showLimit = true" style="margin-left:10px">单日领取上限</a-button>
        </div>
      </a-card>
      <a-card :bordered="false">
        <a-table
          :dataSource="list"
          :columns="columns"
          :pagination="false"
          bordered
          size="middle">
            <div class="handler" slot="operation" slot-scope="text,record,index">
              
              <a-button  type="primary" @click="showAddresBox(index)" size="small" style="font-size:12px">新增批次</a-button>
              <a-button  type="primary" @click="showList = true" size="small" style="font-size:12px;margin-left: 10px;">批次列表</a-button>

            </div>
        </a-table>

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
          <AddResource :pwd="addByPwd"  @success="refreshList" />
        </a-drawer>
      </div>

      <!-- 资源列表 -->
      <div v-if="showList">
        <a-drawer
          title="批次列表"
          :placement="'right'"
          :closable="false"
          width="calc(100% - 450px)"
          :visible="showList"
          @close="showList = false">
          <BatchList @refresh="queryList" />
        </a-drawer>
      </div>


      <div v-if="showLimit">
        <a-modal
        title="单日领取上线设置"
        centered
        width="560px"
        :footer="null"
        :maskClosable="false"
        @cancel="showLimit = false"
        :visible="showLimit">
            <SingleLimit @close="showLimit = false" />
        </a-modal>
      </div>
  
      <!-- <div v-if="showResourceList">
        <a-drawer
          title="资源池号码列表"
          :placement="'right'"
          :closable="false"
          width="50%"
          :visible="showResourceList"
          @close="showResourceList = false">
          <PhoneList :pwd="listId" />
        </a-drawer>
      </div> -->
  
      <!-- 模糊搜索 -->
      <a-modal
      title="搜索列表"
      centered
      width="960px"
      :footer="null"
      @cancel="showSearchList = false"
      :visible="showSearchList">
        <div style="padding:10px 0;font-size:12px;color:#888;margin-top: -20px;margin-bottom: 4px;">搜索数据较多时，只展示前10条信息</div>
        <a-table
          :dataSource="searchList"
          :columns="searchFiled"
          :pagination="false"
          bordered
          size="middle">
            <span slot="batch_id" slot-scope="text">{{ getBatchName(text.batch_id) }}</span>
            <div slot="handler" slot-scope="text">
              <a-button type="danger" size="small" @click="delPhone(text.phone_number)">删除</a-button>
            </div>
          </a-table>
      </a-modal>
  
    <a-modal
    title="单个下载文件数量"
    centered
    width="460px"
    :footer="null"
    :maskClosable="false"
    @cancel="showDownloadLimit = false"
    :visible="showDownloadLimit">
      <a-input placeholder="单个下载文件数量" v-model="downloadNumber" />
      <div style="margin:10px 0 20px 0">
        <a-checkbox @change="onChange">是否下载回收池资源</a-checkbox>
      </div>
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
  
         <div class="list-box">
          <div>每日回收池</div>
          <div class="item flex justify-star align-center" v-for="(item,index) in downLoadList.dayPool" :key="index">
            <div class="flex-1">{{ item }}</div>
            <a-button type="primary" size="small" @click="downloadExcel(item)">Downlod</a-button>
          </div>
         </div>
  
         <div class="list-box">
          <div>每周回收池</div>
          <div class="item flex justify-star align-center" v-for="(item,index) in downLoadList.weekPool" :key="index">
            <div class="flex-1">{{ item }}</div>
            <a-button type="primary" size="small" @click="downloadExcel(item)">Downlod</a-button>
          </div>
         </div>
      </div>
    </a-modal>
    
  
    <a-modal
    :title="historyTitle"
    centered
    width="600px"
    :footer="null"
    @cancel="showHistory = false"
    :visible="showHistory">
       <div class="history-list" v-for="(item,index) in historyList" :key="index">
          <div style="font-weight:bold">第{{ index+1 }}流转</div>
          <div>领取人员：{{ getUserName(item.user_id) }}</div>
          <div>领取时间：{{ item.get_time }}</div>
          <div>标记状态：<a-tag :color="getMarkColor(item.mark_id)">{{ getMarkNameById(item.mark_id) }}</a-tag></div>
       </div>
    </a-modal>
  
    </div>
  </template>
  
  <script>
  // import { 
  //   // deleteResource,
  //   // setResourceStatus,
  //   // searchPhoneNumber,
  //   // getMarkList
  // } from '@/services/resource'
  import api from '@/api'
  
  import AddResource from './add'
  import SingleLimit from './single-limit'

  import BatchList from './list'
  
  // import { Modal } from 'ant-design-vue'
  import request from 'umi-request'
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '资源池名称',
      dataIndex: 'name',
    },
    // {
    //   title: '资源池密码',
    //   dataIndex: 'pwd',
    // },
    {
      title: '资源总条数',
      dataIndex: 'count_all',
    },
    {
      title: '剩余总条数',
      dataIndex: 'count_super',
    },
    // {
    //   title: '上传时间',
    //   dataIndex: 'create_time',
    // },
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
        showList:false,
        batchList:[],
        showLimit:false,



        content:null,
        showSearchList:false,
        searchList:[],
        logList:[],
        pageId:1, // 页码
        pageSize:10, // 页大小
        showAddResource:false, // 是否显示追加资源
        addByPwd:null, // 追加资源密码
        showResourceList:false, // 是否显示资源池手机号码列表
        showDownloadLimit:false,
        downloadNumber:1000,
        isDownloadRecly:false, // 是否下载回收池资源
        downLoading:false,
        showHistory:false,
        showDownList:false,
        downLoadList:null,
        listId:null,
        current:-1,
        historyList:[],
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
            dataIndex: 'phone_number',
          },
          {
            title: '用户姓名',
            dataIndex: 'phone_name',
          },
          { title: '批次',scopedSlots: { customRender: 'batch_id' }},
          // {
          //   title: '上传时间',
          //   dataIndex: 'create_time',
          // },
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
    components:{
        AddResource,
        BatchList,
        SingleLimit
        // PhoneList
     },
    computed:{

      // 获取批次名
      getBatchName(){
        return id => {
          const item = this.batchList.find(e => e.id == id);
          return item?.batch_name || '';
        }
      },
  
      historyTitle(){
        return this.content + '历史流转详情';
      },
  
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
              return item?.account || id;
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
  
      //删除手机号码
      delPhone:function(phone){
        api.DelPhone(phone).then(() => {
           this.$message.success("删除号码成功");
           const index = this.searchList.findIndex(e => e.phone_number == phone);
           this.searchList.splice(index,1);
           this.queryList();
        })
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
  
      // // 打开手机列表框
      // showPhoneList:function(index){
      //    this.listId = this.list[index].pwd;
      //    this.showResourceList = true;
      // },
  
      // 搜索手机号
      searchPhone:function(){
        api.GetPhoneNumber(this.content || '').then(data => {
          this.searchList = data.slice(0,5);
          this.showSearchList = true;
        })
      },
  
      // 查询历史记录
      searchPhoneHistory:function(){
        if(!this.content) return false;
        api.GetHistoryRecord(this.content).then(res => {
          this.historyList = res;
          this.showHistory = true;
        })
      },
  
      
      // handleMenuClick(e){
      //   let arr = e.key.split('-');
      //   const index = Number(arr[1]);
      //   switch(Number(arr[0])){
      //     case 1:this.$refs.addAll.uploadClick();break;
      //     case 3: this.showDownloadLimit = true;this.downloadPwd = this.list[index].pwd;break;
      //     case 4:this.showPhoneList(index);break;
      //     case 5:this.setStatus(index);break;
      //     case 6:this.handleDelete(index);break;
      //     case 7:this.updateResourceName(index);break;
      //   }
      // },
  
      // 修改资源名称
      updateResourceName:function(index){
        this.updateInfo = JSON.parse(JSON.stringify(this.list[index]));
        this.showUpdate = true;
      },
  
      // 修改资源池名
      updateName:function(){
        const { id,mark } = this.updateInfo;
        if(!mark){
          return this.$message.error("请输入名称");
        }
        this.updateLoading = true;
        api.UpdateResourceName(id,mark).then(() => {
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
  
        // this.showDownloadLimit = false;
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
        api.GetAllResourceList().then(e => {
          const { records } = e;
          this.batchList = records;
          let count_all = 0,count_super = 0;
          if(records.length > 0){
            count_all = records.map(e => e.count_all).reduce((a,b) => a+ b);
            count_super = records.map(e => e.count_super).reduce((a,b) => a+ b);
          }
         
          this.list = [
            { 
                id:"NSM123458",
                count_all,
                count_super,
                name:"资源总池"
            }
          ];
          // this.total = total;
        });
      },
  
      // 删除确认操作
      // handleDelete:function(index){
      //   Modal.confirm({
      //     title: '删除资源',
      //     content: '确定要删除该资源？',
      //     okText: '确认',
      //     cancelText: '取消',
      //     onOk:() => {
      //       // 调用删除用户
      //       deleteResource({ id:this.list[index].id });
      //       this.list.splice(index,1);
      //     }
      //   });
      // },
  
      // setStatus:function(index){
      //   setResourceStatus(this.list[index].id).then(() => {
      //     this.list[index].status = this.list[index].status ? 0 : 1;
      //     this.$message.success('操作成功');
      //   });
      // }
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
  
  
  </style>
  
  