<template>
    <a-card>
        <a-button type="primary" style="margin-bottom: 15px;" @click="handleAdd">新增角色</a-button>
        <a-table bordered :columns="columns" size="small" :data-source="list">
            <template slot="color" slot-scope="text, record">
                <a-tag :color="record.color">{{ record.color }}</a-tag>
            </template>
            <template slot="operation" slot-scope="text, record">
                <a-button type="link" link @click="handleEdit(record)">编辑</a-button>
                <a-button type="link" class="link-btn" @click="handleDelete(record)">删除</a-button>
            </template>
        </a-table>

        <Model ref="model" @refresh="queryList"></Model>
    </a-card>
</template>

<script>
import api from '@/api';
import Model from './Model';

export default {
    components: {
        Model
    },
    data() {
        return {
            property: 'value',
            list: [],
            columns: [
                {
                    title: 'ID',
                    dataIndex: 'id',
                },
                {
                    title: '角色名称',
                    dataIndex: 'name',
                },
                {
                    title: '角色背景颜色',
                    scopedSlots: { customRender: 'color' },
                },
                {
                    title: '操作',
                    scopedSlots: { customRender: 'operation' },
                },
            ],
        };
    },
    created() {
        this.queryList();
    },
    methods: {

        queryList() {
            api.GetLiveRoleList().then(res => {
                this.list = res;
            });
        },

        handleEdit(record) {
            this.$refs.model.init(record);
        },

        handleDelete(record) {
            this.$confirm({
                title: '删除角色',
                content: '删除后，已关联该角色的用户自身角色将置空。确定删除该角色吗？',
                onOk:() => {
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