<template>

   <div>
    <a-card style="margin-bottom: 15px;">
        <!-- 昵称搜索用户 -->
        <a-input-search style="width: 240px;" v-model="keywords" 
        placeholder="请输入昵称搜索用户" />
        <!-- 是否是订阅用户 -->
        <a-select v-model="isVip" style="width: 240px;margin-left: 10px;" placeholder="请选择是否是订阅用户">
            <a-select-option :value="false">全部用户</a-select-option>
            <a-select-option :value="true">已订阅用户</a-select-option>
        </a-select> 
        <a-button type="primary" class="ml-10" @click="resetList">搜索</a-button>
    </a-card>

    <a-card>
        <a-button type="primary" class="mb-20" size="midden" @click="$refs.model.init()">新增用户</a-button>
        <a-button type="primary" class="ml-10" size="midden" @click="openTemplateMessageModal">
            发送模板消息
            <span v-if="selectedRowKeys.length > 0">({{ selectedRowKeys.length }})</span>
        </a-button>
        <a-table 
            :dataSource="list" 
            :columns="columns" 
            :pagination="false" 
            bordered 
            class="table-box" 
            size="middle"
            align="center"
            :row-selection="{ 
                selectedRowKeys: selectedRowKeys, 
                onChange: onSelectChange,
                getCheckboxProps: getCheckboxProps
            }"
            :rowKey="record => record.id">
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
                <a-tag v-if="record.role_id" :color="getRoleColor(record.role_id)">{{ getRoleName(record.role_id)
                    }}</a-tag>
                <a-tag v-else color="#ccc">普通用户</a-tag>
            </div>

            <!-- vipStartTimeEndTime -->
            <div slot="vipStartTimeEndTime" slot-scope="text,record">
                <template v-if="record.vipStartTime && record.vipEndTime">
                    <div>{{ record.vipStartTime ? record.vipStartTime : '-' }}</div>
                    <div>{{ record.vipEndTime ? record.vipEndTime : '-' }}</div>
                </template>
                <template v-else>-</template>
            </div>

            <div class="handler" slot="operation" slot-scope="text,record">
                <a-button type="link" style="margin-right: 10px;" @click="$refs.model.init(record)"
                    size="small">编辑</a-button>
                <a-button type="link" style="margin-right: 10px;" @click="sendSigleMessage(record)"
                    size="small">发送私信</a-button>
                <a-button type="link" class="link-btn" :style="record.is_black == 1 ? '' : 'color: #f10;'"
                    @click="handleBlack(record)" size="small">
                    {{ record.is_black == 1 ? '解除黑名单' : '拉黑' }}
                </a-button>
            </div>
        </a-table>

        <div style="text-align: right;margin-top: 20px;margin-right: 0px;">
            <a-pagination :current="pageId" :pageSize="pageSize" :total="total" @change="changePageId($event, false)" />
        </div>

        <Model ref="model" @refresh="queryList" 
        :roleOptionsList="roleOptionsList"
        :vipChatRoomList="vipChatRoomList"></Model>

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
import Model from './Model'
import TemplateMessageModal from './TemplateMessageModal'

export default {
    components: {
        Model,
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
            selectedRowKeys: [], // 选中的行key
            selectedRows: [], // 选中的行数据
            columns: [
                { title: 'ID', dataIndex: 'id' },
                { title: '聊天编码', dataIndex: 'chat_id' },
                { title: 'OPENID', dataIndex: 'openid' },
                { title: '昵称', dataIndex: 'nickname' },
                { title: '头像', scopedSlots: { customRender: 'headimgurl' } },
                { title: '归属后台用户', dataIndex: 'parentId' },
                { title: '是否黑名单', scopedSlots: { customRender: 'is_black' } },
                { title: '角色', scopedSlots: { customRender: 'role_id' } },
                { title: 'VIP起止时间', scopedSlots: { customRender: 'vipStartTimeEndTime' } },
                { title: '创建时间', dataIndex: 'create_time' },
                { title: '操作', scopedSlots: { customRender: 'operation' } },
            ],
            roleOptionsList: [], // 角色列表
            vipChatRoomList:[], // 聊天室列表
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
        this.getLiveRoleList();
        this.getLiveRoomList();
    },
    methods: {

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

        // 获取聊天室列表
        getLiveRoomList: function () {
            api.GetVipLiveRoomList(this.$store.state.account.user.id).then(data => {
                this.vipChatRoomList = data;
            })
        },

        // 发送私信：先弹出输入框，输入完成后再请求 InsertSingleChat，请求未完成前不关闭弹窗
        sendSigleMessage(record) {
            const h = this.$createElement;
            let messageContent = '';

            this.$confirm({
                title: `发送私信给：${record.nickname || record.chat_id || record.id}`,
                content: h(
                    'a-textarea',
                    {
                        props: {
                            autoSize: { minRows: 3, maxRows: 5 },
                            placeholder: '请输入要发送的私信内容'
                        },
                        on: {
                            input: (e) => {
                                messageContent = e.target.value;
                            }
                        }
                    }
                ),
                okText: '发送',
                cancelText: '取消',
                // 返回 Promise，控制在请求完成前不关闭弹窗
                onOk: () => {
                    if (!messageContent || !messageContent.trim()) {
                        this.$message.error('请输入消息内容');
                        // 返回 reject 保持弹窗不关闭
                        return Promise.reject();
                    }

                    const params = {
                        formId: this.$store.state.account.user.id,
                        toId: record.id,
                        content: messageContent.trim()
                    };

                    return api.InsertSingleChat(params)
                        .then((data) => {
                            this.$message.success('私信发送成功');

                            // 如果存在 WebSocket，则同步推送一条单聊消息（可选）
                            if (window.ws && window.ws.readyState === WebSocket.OPEN) {
                                const payload = {
                                    ...data,
                                    type: 'single',
                                    userId: record.id
                                };
                                window.ws.send(JSON.stringify(payload));
                            }
                        })
                        .catch((err) => {
                            this.$message.error('私信发送失败，请稍后重试');
                            // 继续抛出错误，以便保持弹窗不自动关闭（交由用户决定是否重试）
                            return Promise.reject(err);
                        });
                }
            });
        },

        handleBlack: function (record) {
            this.$confirm({
                type: 'warning',
                title: record.is_black == 1 ? '确定要解除黑名单吗？' : '确定要拉黑该用户吗？',
                content: record.is_black == 1 ? '解除黑名单后该用户将可以进入聊天室，且可以发送消息' : '拉黑后该用户将无法进入聊天室，且无法发送消息',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    api.SetUserBlackStatus(record.chat_id, record.is_black == 1 ? 0 : 1).then(data => {
                        this.$message.success(record.is_black == 1 ? '解除黑名单成功' : '拉黑成功');
                        this.queryList();

                        // 发送实时消息拉入黑名单
                        if (record.is_black == 0) {
                            window.ws.send(JSON.stringify({
                                type: 'single',
                                userId: record.id,
                                fn: 'black',
                                data: 1
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
            api.GetLiveUserList({
                pageId:this.pageId, 
                pageSize:this.pageSize, 
                userId:this.$store.state.account.user.id,
                nickname:this.keywords,
                isVip:this.isVip,
            }).then(data => {
                const { total, records } = data;
                this.list = records;
                this.total = total;
                this.loading = false;
            });
        },
    }
}
</script>