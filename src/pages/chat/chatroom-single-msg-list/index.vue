<template>
    <a-card>
        <a-table bordered :columns="columns" :pagination="false" size="small" :data-source="list">
            <template slot="sender" slot-scope="text, record">
                <div :set="data = getFormNickname(record)">
                    <a-avatar :size="32" icon="user" :src="data.headimgurl || data.head_img" />
                    <span style="padding-left: 10px;">{{ data.nick_name || data.nickname }}</span>
                </div>
            </template>
            <template slot="receiver" slot-scope="text, record">
                <div :set="data = getToNickname(record)">
                    <a-avatar :size="32" icon="user" :src="data.headimgurl || data.head_img" />
                    <span style="padding-left: 10px;">{{ data.nick_name || data.nickname }}</span>
                </div>
            </template>
        </a-table>
        <div style="text-align: right;margin-top: 20px;margin-right: -8px;">
            <a-pagination :current="pageId" :pageSize="pageSize" :total="total" @change="changePageId" />
        </div>
    </a-card>
</template>

<script>
import api from '@/api';

export default {
    data() {
        return {
            list: [],
            pageId: 1, // 页码
            pageSize: 20, // 页大小
            total: 0,
            columns: [
                { title: 'ID', dataIndex: 'id' },
                { title: '发送人', scopedSlots: { customRender: 'sender' } },
                { title: '接收人', scopedSlots: { customRender: 'receiver' } },
                { title: '消息内容', dataIndex: 'content' },
                { title: '发送时间', dataIndex: 'create_time' }
            ],
            userList: [],
        };
    },
    computed: {
        getFormNickname() {
            return info => {
                const user = this.userList.find(item => item.id == info.formId);
                return user || info.formUserInfo;
            }
        },
        getToNickname() {
            return info => {
                const user = this.userList.find(item => item.id == info.toId);
                return user || info.toUserInfo;
            }
        }
    },
    created() {
        this.queryList();
        api.GetUserList({
            pageId: 1,
            pageSize: 999
        }).then(data => {
            const { total, records } = data;
            this.userList = records;
            this.total = total;
        });
    },
    methods: {

        changePageId: function (e) {
            this.pageId = e;
            this.queryList();
        },

        queryList() {
            api.GetAllSingleChatList({
                pageId: this.pageId,
                pageSize: this.pageSize
            }).then(data => {
                const { total, records } = data;
                this.list = records;
                this.total = total;
            });
        },

        handleEdit(record) {
            this.$refs.model.init(record);
        },

        handleDelete(record) {
            this.$confirm({
                title: '删除角色',
                content: '删除后，已关联该角色的用户自身角色将置空。确定删除该角色吗？',
                onOk: () => {
                    api.DeleteLiveRole(record.id).then(() => {
                        this.$message.success('删除成功');
                        this.queryList();
                    });
                }
            });
        },

        handleAdd() {
            this.$refs.model.init();
        },
    }
}
</script>