<template>
    <div>
        <a-card :bordered="false">
           <div style="margin-bottom: 20px;">
            <!--  -->

            <a-modal
            title="微信扫码进入分享"
            :visible="showErcode"
            @ok="showErcode = false"
            @cancel="showErcode = fasle" >
              <div class="flex justify-center align-center">
                <img  src="@/assets/image/share-ercode-content1.png" style="width:120px;"  />
              </div>
            </a-modal>

            <a-button type="danger" @click="showErcode = !showErcode" size="midden" style="margin-right: 10px">微信扫码进入</a-button>

            <a-button type="primary" @click="openAdd(null)" size="midden">新增文章</a-button>
           </div>
            <a-table :dataSource="list" :columns="columns" :pagination="false" bordered size="middle">
                <div slot="shareCover" slot-scope="e">
                    <img :src="e.shareCover" style="width:60px;height:60px" alt="">
                </div>

                <div slot="only" slot-scope="e">
                    <a-switch :checked="e.only" @change="changeOnly($event,e)">
                        <!-- <a-icon slot="checkedChildren" type="check" />
                        <a-icon slot="unCheckedChildren" type="close" /> -->
                    </a-switch>
                </div>
                
                <div class="handler" slot="operation" slot-scope="text,record,index">
                    <a-button type="primary" @click="openAdd(index)" size="small" style="margin-right:10px">修改</a-button>
                    <a-button type="danger" @click="handleDelete(index)" size="small">删除</a-button>
                </div>
            </a-table>
        </a-card>

        <!-- 分页 -->
        <div style="text-align: right;margin-top: 20px;margin-right: 0px;">
            <a-pagination :current="pageId" :pageSize="pageSize" :total="total" @change="changePageId($event,false)" />
        </div>

        <!-- 新增二维码 -->
        <div v-if="showAdd">
            <a-drawer :title="updateInfo ? '修改文章' : '新增文章'" :placement="'right'" 
            :closable="false" width="50%" :visible="showAdd"
                @close="showAdd = false">
                <AddShare :type="1" :info="updateInfo" @success="refreshList" />
            </a-drawer>
        </div>
    </div>
</template>
  
<script>
import { Modal } from 'ant-design-vue'
import AddShare from './children/add-share'
import api from '@/api'

export default {
    name: 'User',
    data() {

        return {
            showErcode:false,
            showAdd: false, // 是否显示追加资源
            addByPwd: null, // 追加资源密码
            showResourceList: false, // 是否显示资源池手机号码列表
            listPwd: null,
            list: null, // 资源列表
            total: 0, // 总数
            desc:"手机端通过扫描下方二维码进行分享",
            updateInfo:null,
            pageId: 1,
            pageSize: 10,
            columns: [
                {
                    title: 'ID',
                    dataIndex: 'id',
                    align: 'center'
                },
                {
                    title: '分享标题',
                    dataIndex: 'content_title',
                    align: 'center',
                    width:200
                },
                
                {
                    title: '打开次数',
                    dataIndex: 'openCount',
                    align: 'center'
                },
                {
                    title: '分享Title',
                    dataIndex: 'shareTitle',
                    align: 'center',
                    width:200
                },
                {
                    title: '分享描述',
                    dataIndex: 'shareDesic',
                    align: 'center',
                    width:200
                },
                {
                    title: '操作',
                    scopedSlots: { customRender: 'operation' },
                    align: 'center'
                }
            ]
        }
    },
    components: { AddShare },
    created() {
        this.queryList();
    },
    methods: {

        openAdd:function(index){
            debugger;
            if(index == null) this.updateInfo = null;
            else this.updateInfo = this.list[index];
            this.showAdd = true;
        },

        changePageId: function (e,loading = false) {
            this.pageId = e;
            this.loading = loading;
            this.queryList();
        },

        // 刷新列表
        refreshList: function () {
            this.queryList();
            this.showAdd = false;
        },

        // 打开追加资源框
        showAddresBox: function (index) {
            this.addByPwd = this.list[index].pwd;
            this.showAdd = true;
        },

        // 打开手机列表框
        showPhoneList: function (index) {
            this.listPwd = this.list[index].pwd;
            this.showResourceList = true;
        },

        // 获取列表
        queryList: function () {
            api.GetCustomShareList(1,this.pageId,this.pageSize).then(data => {
                const { total, records } = data;
                records.forEach(e => {
                    e.only = Boolean(e.only)
                });
                this.list = records;
                this.total = total;
                this.loading = false;
            });
        },

        changeOnly:function(status,e){
            // e.only = status;
            api.setCustomOnly(e.id,Number(status)).then(() => {
                this.queryList();
            })
        },

        // 设置唯一


        // 删除确认操作
        handleDelete: function (index) {
            Modal.confirm({
                title: '删除链接',
                content: '确定要删除改链接？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    // 调用删除用户
                    api.delCustomShare(this.list[index].id).then(() => {
                        this.list.splice(index, 1);
                    })   
                }
            });
        }

    }
}
</script>
  
<style lang="less" scoped>
.steps {
    max-width: 950px;
    margin: 16px auto;
}

.handler {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
}

.title {
    font-weight: bold;
    margin-bottom: 14px;
    font-size: 18px;
}

.title span {
    padding: 0 10px;
    border-left: 6px solid seagreen;
}</style>
  