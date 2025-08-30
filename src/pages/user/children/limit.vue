<template>
    <div class="form">
        <a-card :bordered="false">
            <a-form :form="form">

                <a-tabs type="card" @change="callback">
                    <a-tab-pane key="APP" tab="移动端权限">
                        <a-form-item label="是否禁止聊天">
                            <a-switch v-model="params.is_no_chat" />
                        </a-form-item>

                        <a-form-item label="可见部门">
                            <a-tree checkable v-model="params.visible_list" :auto-expand-parent="true"
                                :tree-data="departmentList" />
                        </a-form-item>
                    </a-tab-pane>
                    <a-tab-pane key="WEB" tab="WEB端权限">
                        <a-form-item label="菜单可见权限">
                            <!-- <div :style="{ borderBottom: '1px solid #E9E9E9','marginBottom':'10px' }">
                                <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">全选</a-checkbox>
                            </div>
                            <a-checkbox-group v-model="params.menu_list" name="checkboxgroup" :options="options"
                            :default-value="[2]" @change="onChange" /> -->
                            <a-tree v-model="params.menu_list" checkable :expanded-keys="expandedKeys"
                                :auto-expand-parent="autoExpandParent" :selected-keys="selectedKeys" :tree-data="treeData"
                                @expand="onExpand" @select="onSelect" />

                        </a-form-item>
                    </a-tab-pane>
                </a-tabs>

                <a-form-item>
                    <div class="flex justify-end">
                        <a-button type="primary" @click="onSubmit" :loading="loading">提交</a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-card>

    </div>
</template>
    
<script>
import api from '@/api'
const treeData = [
    {
        title: '调度中心',
        key: 'form',
        children: [
            { title: '资源池', key: 'form-list' },
            { title: '统计', key: 'form-record' },
        ],
    },
    {
        title: '工具',
        key: 'tools',
        children: [
            { title: '获客助手', key: 'tools-workplace' },
            { title: '短线精选策略', key: 'tools-stubline' },
            { title: '防微信文章分享', key: 'tools-share-content' },
            { title: '制图助手', key: 'tools-pic' },
            { title: '专属二维码生成器', key: 'tools-ercode-url' },
            { title: '权重比例二维码', key: 'tools-more-ercode' },
            { title: '客户小游戏', key: 'tools-game' },

        ],
    },
    {
        title: '用户管理',
        key: 'user',
        children: [
            { title: '用户列表', key: 'user-list' },
            { title: '部门管理', key: 'user-department' },
        ],
    },
]


export default {
    data() {
        return {
            loading: false,
            params: {
                visible_list: [], //昵称
                menu_list: [], // 菜单权限
                is_no_chat: false, //账号
            },
            indeterminate: false,
            checkAll: false,
            form: this.$form.createForm(this),
            expandedKeys: [],
            autoExpandParent: true,
            selectedKeys: [],
            treeData,
        }
    },
    props: {
        id: String,
        departmentList: Array
    },
    created() {
        this.getlimitList();
    },
    methods: {

        onExpand(expandedKeys) {
            console.log('onExpand', expandedKeys);
            // if not set autoExpandParent to false, if children expanded, parent can not collapse.
            // or, you can remove all expanded children keys.
            this.expandedKeys = expandedKeys;
            this.autoExpandParent = false;
        },
        onCheck(checkedKeys) {
            console.log('onCheck', checkedKeys);
            this.params.menu_list = checkedKeys;
        },
        onSelect(selectedKeys, info) {
            console.log('onSelect', info);
            this.selectedKeys = selectedKeys;
        },


        changeSwitch: function (e) {
            console.log(e);
        },

        // 获取权限列表
        getlimitList: function () {
            api.GetLimitById(this.id).then(data => {
                if (data) {
                    const { is_no_chat, visible_list, menu_list } = data;
                    this.params.is_no_chat = Number(is_no_chat);
                    if (visible_list) {
                        let list = visible_list.split(',');
                        list.forEach((e, index) => {
                            list[index] = Number(e);
                        })
                        this.params.visible_list = list;
                    }

                    if (menu_list) {
                        this.params.menu_list = menu_list.split(',');
                    }
                }
            })
        },

        onSubmit: function () {
            this.loading = true;
            let params = JSON.parse(JSON.stringify(this.params));
            const { visible_list, is_no_chat, menu_list } = params;
            params.limit_id = this.id;
            params.is_no_chat = Number(is_no_chat);
            if (visible_list && visible_list.length > 0) {
                params.visible_list = visible_list.join(',');
            } else params.visible_list = null;

            if (menu_list && menu_list.length > 0) {
                params.menu_list = menu_list.join(',');
            } else params.menu_list = null;

            api.SetLimitById(params).then(() => {
                this.loading = false;
                this.$message.success("权限设置成功");
            }).catch(() => {
                this.loading = false;
            })
        },
    },
}
</script>
    
<style lang="css">
.ant-modal-body {
    padding: 0 !important;
}

.ant-card-body {
    padding: 0;
}

.ant-modal-header {
    border-bottom: none !important;
}

.ant-form-item {
    padding: 0 20px;
}

.form>>>.ant-form-item {
    margin-bottom: 10px !important;
}

/* .form {
    margin: -20px !important;
} */

.form>>>.ant-form-item-label {
    line-height: 25px;
}
</style>
    