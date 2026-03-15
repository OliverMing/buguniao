<template>

    <div>
     <!-- <a-card style="margin-bottom: 15px;">
         <a-input-search style="width: 240px;" v-model="keywords" 
         placeholder="请输入昵称搜索用户" />
         <a-select v-model="isVip" style="width: 240px;margin-left: 10px;" placeholder="请选择是否是订阅用户">
             <a-select-option :value="false">全部用户</a-select-option>
             <a-select-option :value="true">已订阅用户</a-select-option>
         </a-select> 
         <a-select v-model="isBlack" 
         style="width: 240px;margin-left: 10px;" 
         placeholder="请选择是否是黑名单用户">
             <a-select-option :value="false">全部用户</a-select-option>
             <a-select-option :value="true">黑名单用户</a-select-option>
         </a-select> 
         <a-button type="primary" class="ml-10" @click="resetList">搜索</a-button>
         <a-button class="ml-10" @click="reset">重置</a-button>
     </a-card> -->
 
     <a-card>
         <a-button type="primary" class="mb-20" size="midden" @click="openTemplateMessageModal">
             发送模板消息
             <span v-if="selectedRowKeys.length > 0">({{ selectedRowKeys.length }})</span>
         </a-button>
         <a-table 
             :dataSource="list" 
             :columns="columns" 
             :pagination="false" 
             bordered 
             :loading="loading"
             class="table-box" 
             size="middle"
             align="center"
             :row-selection="{ 
                 selectedRowKeys: selectedRowKeys, 
                 onChange: onSelectChange,
                 getCheckboxProps: getCheckboxProps
             }"
             :rowKey="record => record.id">
         </a-table>
 
         <div style="text-align: right;margin-top: 20px;margin-right: 0px;">
             <a-pagination :current="pageId" :pageSize="pageSize" :total="total" @change="changePageId($event, false)" />
         </div>
 
         <!-- 模板消息弹窗 -->
         <TemplateMessageModal 
             ref="templateMessageModal" 
             @success="onTemplateMessageSuccess" 
             @remove-user="onRemoveUser"
         />
     </a-card>
    </div>
 </template>
 
 <script>
 import api from '@/api';
 import TemplateMessageModal from './TemplateMessageModal'
 
 export default {
     components: {
         TemplateMessageModal
     },
     data() {
         return {
             list: null, // 列表
             total: 0, // 总数
             pageId: 1,
             pageSize: 10,
             keywords: '',
             isVip:undefined,
             isBlack:undefined,
             selectedRowKeys: [], // 选中的行key
             selectedRows: [], // 选中的行数据
             columns: [
                 { title: 'OPENID', dataIndex: 'openid' },
             ],
             roleOptionsList: [], // 角色列表
             vipChatRoomList:[], // 聊天室列表
             loading:false,
         }
     },
     computed: {
         getRoleName() {
             return function (id) {
                 let name = '';
                 this.roleOptionsList.forEach(item => {
                     if (item.id == id) {
                         name = item.name;
                     }
                 });
                 return name;
             }
         },
         getRoleColor() {
             return function (id) {
                 let color = '';
                 this.roleOptionsList.forEach(item => {
                     if (item.id == id) {
                         color = item.color;
                     }
                 });
                 return color;
             }
         },
     },
     created() {
         this.queryList();
     },
     methods: {
 
         reset() {
             this.keywords = '';
             this.isVip = undefined;
             this.isBlack = undefined;
             this.pageId = 1;
             this.queryList();
         },
 
         // 表格选择变化
         onSelectChange(selectedRowKeys, selectedRows) {
             this.selectedRowKeys = selectedRowKeys;
             this.selectedRows = selectedRows;
         },
 
         // 获取复选框属性
         getCheckboxProps(record) {
             return {
                 props: {
                     disabled: false,
                     name: record.id
                 }
             };
         },
 
         // 打开模板消息弹窗
         openTemplateMessageModal() {
             if (this.selectedRows.length === 0) {
                 this.$message.warning('请先选择要发送模板消息的用户');
                 return;
             }
             this.$refs.templateMessageModal.init(this.selectedRows);
         },
 
         // 模板消息发送成功回调
         onTemplateMessageSuccess() {
             // 清空选中状态
             this.selectedRowKeys = [];
             this.selectedRows = [];
         },
 
         // 从弹窗中移除用户时同步更新父组件选中状态
         onRemoveUser(userId) {
             const keyIndex = this.selectedRowKeys.indexOf(userId);
             if (keyIndex > -1) {
                 this.selectedRowKeys.splice(keyIndex, 1);
             }
             const rowIndex = this.selectedRows.findIndex(row => row.id === userId);
             if (rowIndex > -1) {
                 this.selectedRows.splice(rowIndex, 1);
             }
         },

         // 切换分页
         changePageId: function (e, loading = false) {
             this.pageId = e;
             this.loading = loading;
             this.queryList();
         },
 
         resetList(){
             this.pageId = 1;
             this.queryList();
         },
 
         // 获取列表
         queryList: function () {
            this.loading = true;
             api.getAllWeChatUsersAsync().then(data => {
                 if(data.data){
                    let list = [];
                    data.data.openid.forEach(item => {
                        list.push({
                            openid: item
                        });
                    });
                    this.list = list;
                 }
                 this.total = data.total;
                 this.loading = false;
             }).final(() => {
                this.loading = false;
             })
         },
     }
 }
 </script>