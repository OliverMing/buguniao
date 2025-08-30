<template>
    <div>
      
      <a-card :bordered="false">
        <div style="margin-bottom:20px" v-if="!visibleHandler">
          <a-button type="primary" @click="showScrollUser = true" size="midden" style="margin-right:20px;background-color:chocolate;border-color: transparent;">滚动用户列表</a-button>
          <!-- <a-button type="primary" @click="showGroup = true" size="midden" style="margin-right:10px">新增分组</a-button> -->
          <a-button type="primary" @click="showAddResource = true" size="midden">新增二维码</a-button>
          <!-- <span class="super-tips" v-if="getGroupListCount">分组剩余可分配权重：<b>{{ getGroupListCount }}</b>，务必分配满100%</span> -->
        </div>
        
        
        <!-- @edit="delGroup"  (${item.bv}%)-->
        <a-tabs v-model="groupCurrent" type="card" @change="callback">
          <a-tab-pane v-for="(item,index) in groupList" :key="index" :tab="`${item.name}`">
          </a-tab-pane>
        </a-tabs>

        <div style="margin-bottom:15px">
          渠道链接： <span style="text-decoration:underline">ercode.ecwwa.cn/?key={{ groupList[groupCurrent].channel_id }}</span>
        </div>
        
        <div style="margin-top:0px">
         
          <!-- <div class="super-tips" style="padding-bottom:15px" v-if="getSuperCount">剩余未配置权重：<b>{{ getSuperCount }}</b>，务必分配满100%，否则会出现获取不到二维码不情况</div> -->
          <a-table
          :dataSource="list"
          :columns="columns"
          :pagination="false"
          bordered
          class="table-box"
          size="middle"
          align="center">
              <div slot="url" slot-scope="e">
                <img v-if="e.url" :src="`${baseUrl}/${e.url}`" style="width:80px;height:80px">
              </div>
              <div slot="wxurl"  slot-scope="e">
                {{ e.wxurl && e.wxurl != 'null' ? e.wxurl : '-' }}
              </div>
              <div slot="customer" slot-scope="e">
                <a-button type="link"  @click="openCustomList(e.id)" size="small">点击查看列表</a-button>
              </div>
              <div slot="status" slot-scope="e" style="font-size: 12px;">
                <a-tag :color="e.status == 1 ? '#03a9f4' : '#ccc'">{{ e.status == 0 ? '禁用' : '启用' }}</a-tag>
              </div>
              <div v-if="!visibleHandler" class="handler" slot="operation" slot-scope="text,record,index">
                <a-button type="primary"  @click="edit(index)" size="small">编辑</a-button>
                <a-button style="margin:0 10px" :type="text.status == 0 ? 'primary':'danger'" @click="forbit(index)" size="small">{{ text.status == 0 ? '启用' : '禁用' }}</a-button>
                <a-button type="danger" @click="handleDelete(index)" size="small">删除</a-button>
              </div>
          </a-table>
        </div>
        
    </a-card>
      
    <!-- 新增二维码 -->
    <div>
      <a-drawer
        title="新增二维码"
        :placement="'right'"
        :closable="false"
        width="40%"
        :visible="showAddResource"
        @close="close">
        <AddBvErcode 
        v-if="showAddResource" 
        :info="info" 
        @success="refreshList" 
        :list="list"
        :channel="groupList[groupCurrent]"
        :channelId="groupList[groupCurrent].channel_id"/>
      </a-drawer>
    </div>

    <!-- 新增或者修改分组 -->
    <a-modal
    title="分组管理"
    centered
    width="460px"
    :footer="null"
    @cancel="showGroup = false"
    :visible="showGroup">
      <div>
        <a-form-model ref="ruleForm" @submit="onSubmit" :model="groupForm" :rules="rules" @submit.native.prevent>
          <a-form-model-item label="分组名称" prop="name">
            <a-input placeholder="请输入分组名称" v-model="groupForm.name" />
          </a-form-model-item>
        </a-form-model>
        <!-- <a-form-model ref="ruleForm" @submit="onSubmit" :model="groupForm" :rules="rules" @submit.native.prevent>
          <a-form-model-item label="分组权重" prop="name">
            <a-input type="number" placeholder="请输入分组权重" v-model="groupForm.bv" />
          </a-form-model-item>
        </a-form-model> -->
        <a-form-model-item style="margin-top: 24px">
          <a-button type="primary" htmlType="submit" :loading="uploading">提交</a-button>
        </a-form-model-item>
      </div>
    </a-modal>

    <!-- 是否弹出滚动用户组件 -->
    <ScrollUser v-if="showScrollUser" @close="showScrollUser = false" />
    <!--  -->
    <CustomListModel ref="customListModel" />
  </div>
</template>
  
<script>
import { Modal } from 'ant-design-vue'
import AddBvErcode from './children/add-bv-ercode'
import { ercodeColumns } from './data/ercode'
import ScrollUser from './children/scroll-user'
import api from '@/api'
import CustomListModel from './CustomListModel'


export default {
  name: 'User',
  data () {

    return {
      pageId:1, // 页码
      pageSize:10, // 页大小
      showAddResource:false, // 是否显示追加资源
      info:null,
      showScrollUser:false,
      groupList:[],
      groupCurrent:0,
      showGroup:false,
      baseUrl:process.env.VUE_APP_API_BASE_URL,
      groupForm:{
        name:null,
        bv:null,
      },
      visibleHandler:false,
      rules:{
        name:[
          { required: true, message: '请输入渠道名称' },
          // { required: true, message: '请输入渠道权重' }
        ]
      },
      showResourceList:false, // 是否显示资源池手机号码列表
      listPwd:null,
      list:null, // 资源列表
      total:0, // 总数
      columns:ercodeColumns,
      desc:`二维码H5链接生成见下方`
      // ?action=bvcode
    }
  },
  components:{ 
    AddBvErcode,
    ScrollUser,
    CustomListModel
  },
  computed:{
    getSuperCount(){
      if(!this.list || this.list.length == 0) return 100;
      let list = this.list.map(e => e.bv);
      let count = list.reduce((a,b) => a + b);
      return 100 - count;
    },
    getGroupListCount(){
      if(!this.groupList || this.groupList.length == 0) return 100;
      let list = this.groupList.map(e => e.bv);
      let count = list.reduce((a,b) => a + b);
      return 100 - count;
    }
  },
  watch:{
    groupCurrent(){
      this.queryList();
    }
  },
  created() {
    this.getGroupList();
  },
  methods: {

    openCustomList(id){
      this.$refs.customListModel.open(id);
    },

    onSubmit:function(){
      this.$refs.ruleForm.validate(valid => {
        if(valid){
          alert(123)
        }
      })
    },

    changePageId: function (e) {
      this.pageId = e;
      this.queryList();
    },


    forbit(index){
      api.forbitErcode(this.list[index].id).then(() => {
        this.refreshList();
      })
    },

    // 刷新列表
    refreshList:function(){
      this.queryList();
      this.showAddResource = false;
    },

    // 打开追加资源框
    showAddresBox:function(){
      this.info = null;
      this.showAddResource = true;
    },

    close:function(){
        this.showAddResource = false;
        this.info = null;
    },

    // 修改编辑
    edit:function(index){
      this.info = this.list[index];
      this.showAddResource = true;
    },

    // 打开手机列表框
    showPhoneList:function(index){
        this.listPwd = this.list[index].pwd;
        this.showResourceList = true;
    },

    // 获取分组列表
    getGroupList:function(){
      api.GetGroupList().then(data => {
        let user = localStorage.getItem('admin.user');
        user = JSON.parse(user);
        if(user.account == 'data'){
          data = data.slice(2,data.length);
          this.visibleHandler = true;
        }
        this.groupList = data;
        this.queryList();
      })
    },

    // 获取列表
    queryList:function(){
      api.GetRatioErcodeList(this.groupList[this.groupCurrent].channel_id).then(data => {
        this.list = data;
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
          api.DeleteRationErcode(this.list[index].id);
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
.super-tips{font-size: 13px;color: #f10;text-decoration: underline;}

// .table-box{margin-top: -5px;}

</style>
  