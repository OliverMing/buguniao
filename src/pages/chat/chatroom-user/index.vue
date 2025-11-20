<template>
    <a-card>
        <a-button type="primary" class="mb-20" size="midden" @click="$refs.model.init()">新增用户</a-button>

        <a-table
          :dataSource="list"
          :columns="columns"
          :pagination="false"
          bordered
          class="table-box"
          size="middle"
          align="center">
               <!-- 如果是一个图片链接则显示图片 -->
              <div slot="headimgurl" slot-scope="text,record">
                <a-avatar :size="38" icon="user" :src="record.headimgurl" />
              </div>

              <!-- 黑名单 -->
              <div slot="is_black" slot-scope="text,record">
                <a-tag :color="record.is_black == 1 ? '#f10' : '#ccc'">{{ record.is_black == 1 ? '是' : '否' }}</a-tag>
              </div>

              <!-- role_id -->
              <div slot="role_id" slot-scope="text,record">
                <a-tag v-if="record.role_id" :color="getRoleColor(record.role_id)">{{ getRoleName(record.role_id) }}</a-tag> 
                <a-tag v-else color="#ccc">普通用户</a-tag>
              </div>

              <div class="handler" slot="operation" slot-scope="text,record">
                <a-button type="link" style="margin-right: 10px;"
                @click="$refs.model.init(record)" size="small">编辑</a-button>
                <a-button type="link" class="link-btn" :style="record.is_black == 1 ? '' : 'color: #f10;'" @click="handleBlack(record)" size="small">
                    {{ record.is_black == 1 ? '解除黑名单' : '拉黑' }}
                </a-button>
              </div>
          </a-table>

          <div style="text-align: right;margin-top: 20px;margin-right: 0px;">
            <a-pagination :current="pageId" :pageSize="pageSize" :total="total" @change="changePageId($event,false)" />
        </div>

        <Model ref="model" @refresh="queryList" :roleOptionsList="roleOptionsList"></Model>
    </a-card>
</template>

<script>
import api from '@/api';
import Model from './Model'

export default {
    components: {
        Model
    },
    data() {
        return {
            list:null, // 列表
            total:0, // 总数
            pageId: 1,
            pageSize: 10,
            columns:[
                { title: 'ID',dataIndex: 'id' },
                { title: '聊天编码',dataIndex: 'chat_id' },
                { title: 'OPENID',dataIndex: 'openid' },
                { title: '昵称',dataIndex: 'nickname' },
                { title: '头像',scopedSlots: { customRender: 'headimgurl' } },
                { title: '是否黑名单',scopedSlots: { customRender: 'is_black' } },
                { title: '角色',scopedSlots: { customRender: 'role_id' } },
                { title: '创建时间',dataIndex: 'create_time' },
                { title: '操作',scopedSlots: { customRender: 'operation' } },
            ],
            roleOptionsList:[], // 角色列表
       }
    },
    computed:{
        getRoleName(){
            return function (id) {
                let name = '';
                this.roleOptionsList.forEach(item => {
                    if(item.id == id){
                        name = item.name;
                    }
                });
                return name;
            }
        },
        getRoleColor(){
            return function (id) {
                let color = '';
                this.roleOptionsList.forEach(item => {
                    if(item.id == id){
                        color = item.color;
                    }
                });
                return color;
            }
        },
    },
    created() {
        this.queryList();
        this.getLiveRoleList();
    },
    methods: {

        handleBlack: function (record) {
            this.$confirm( {
                type: 'warning',
                title: record.is_black == 1 ? '确定要解除黑名单吗？' : '确定要拉黑该用户吗？',
                content: record.is_black == 1 ? '解除黑名单后该用户将可以进入聊天室，且可以发送消息' : '拉黑后该用户将无法进入聊天室，且无法发送消息',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    api.SetUserBlackStatus(record.chat_id,record.is_black == 1 ? 0 : 1).then(data => {
                        this.$message.success(record.is_black == 1 ? '解除黑名单成功' : '拉黑成功');
                        this.queryList();
                        
                        // 发送实时消息拉入黑名单
                        if(record.is_black == 0) {
                            window.ws.send(JSON.stringify({
                                type:'single',
                                userId:record.id,
                                fn:'black',
                                data:1
                            }));  
                        }
                    });
                }
            });
        },

        getLiveRoleList() {
            api.GetLiveRoleList().then(res => {
                this.roleOptionsList = res;
            });
        },

        // 切换分页
        changePageId: function (e,loading = false) {
            this.pageId = e;
            this.loading = loading;
            this.queryList();
        },

         // 获取列表
         queryList: function () {
            api.GetLiveUserList(this.pageId,this.pageSize).then(data => {
                const { total, records } = data;
                this.list = records;
                this.total = total;
                this.loading = false;
            });
        },
    }
}
</script>