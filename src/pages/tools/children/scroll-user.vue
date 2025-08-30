<template>
    <div class="layer-box" @click.stop="hiddenScroll">
        <div class="scroll-main" @click.stop="nullClick">
            <a-button type="primary" size="midden" style="margin-bottom:20px;" @click="showAdd = true">新增</a-button>
            <a-table :dataSource="list" :columns="scroll" :pagination="false" bordered size="middle">
                <div slot="head_url" slot-scope="e">
                    <img :src="`${baseUrl}/${e.head_url}`"
                        style="width:50px;height:50px;border-radius: 100%;object-fit: cover;border: 1px solid #f5f5f5;"
                        alt="">
                </div>
                <div class="handler" slot="operation" slot-scope="text,record,index">
                    <a-button type="danger" @click="handleDelete(index)" size="small">删除</a-button>
                </div>
            </a-table>
            <div style="text-align: right;margin-top: 20px;">
                <a-pagination :current="pageId" :pageSize="pageSize" :total="total" @change="changePageId" />
            </div>
        </div>

        <a-drawer
            title="新增滚动用户"
            :placement="'right'"
            :closable="false"
            width="40%"
            :visible="showAdd"
            @close="showAdd = false">
            <AddScrollUser @success="refreshList" />
        </a-drawer>

    </div>
</template>


<script>
import { scrollList } from '../data'
import { getErcodeScrollList,deleteScrollUser } from '@/services/ercode'
import AddScrollUser from './add-scrolluser'
import { Modal } from 'ant-design-vue'

export default {
    data() {
        return {
            showAdd:false,
            baseUrl:process.env.VUE_APP_API_BASE_URL,
            scroll: scrollList,
            list: null,
            pageId: 1, // 页码
            pageSize: 5, // 页大小
            total: 0, // 总数
        }
    },
    components:{ AddScrollUser },
    created() {
        this.queryList();
    },
    methods: {

        // 阻止冒泡

        nullClick: function () { },

        // 隐藏组件
        hiddenScroll: function () {
            this.$emit('close');
        },

        // 变更页码
        changePageId: function (e) {
            this.pageId = e;
            this.queryList();
        },

        // 刷新列表
        refreshList:function(){
            this.queryList();
            this.showAdd = false;
        },

        // 获取列表
        queryList: function () {
            getErcodeScrollList({
                pageId: this.pageId,
                pageSize: this.pageSize
            }).then(({ data }) => {
                const { total, records } = data.data;
                this.list = records;
                this.total = total;
            });
        },

        // 删除确认操作
        handleDelete:function(index){
            Modal.confirm({
            title: '删除滚动用户',
            content: '确定要删除该数据',
            okText: '确认',
            cancelText: '取消',
            onOk:() => {
                // 调用删除用户
                deleteScrollUser(this.list[index].id);
                this.list.splice(index,1);
            }
            });
        }

    },
}
</script>

<style scoped>
.layer-box{position: fixed;top: 0;left: 0;width: 100vw;height: 100vh;z-index: 99;background: rgba(0,0,0,.6);}
.scroll-main{position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);width: 60%;min-height: 400px;background: #fff;padding: 20px;border-radius: 6px;}
</style>