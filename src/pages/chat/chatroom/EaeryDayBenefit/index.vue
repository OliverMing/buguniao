<template>
    <div>
        <a-button type="primary" class="mb-20" size="midden" @click="$refs.addMessage.open()">新增每日福利</a-button>
        <a-table 
        :dataSource="list" 
        :columns="columns" 
        :pagination="false" 
        bordered class="table-box"
        size="middle" align="center">

            <!-- <div slot="content" slot-scope="record" style="width: 100%;">{{ record.content }}</div> -->

            <div class="handler" slot="operation" slot-scope="text,record,index">
                <a-button type="link" style="margin-right: 10px;"
                @click="$refs.addMessage.open(record)" size="small">编辑</a-button>
                <a-button type="link" class="link-btn" style="color: #f10;" @click="handleDelete(index)"
                size="small">删除</a-button>
            </div>
        </a-table>

        <Model ref="addMessage" @refresh="queryList" :code="code"></Model>
    </div>
</template>

<script>
import api from '@/api'
import { Modal } from 'ant-design-vue'
import Model from './Model'

export default {
    name: 'EaeryDayBenefit',
    props: {
        code:String  
    },
    components:{
        Model
    },
    data(){
        return {
            list:[],
            columns: [
                { title: 'ID', dataIndex: 'id' },
                { title: '内容',dataIndex: 'content'  },
                { title: '创建时间', dataIndex: 'create_time' },
                { title: '操作', scopedSlots: { customRender: 'operation' } },
            ],
        }
    },
    created(){
        this.queryList();
    },
    methods:{

        queryList(){
            api.GetLiveRoomEaeryList(this.code).then(data => {
                this.list = data.sort((a,b) => b.id - a.id);
            })
        },

        // 删除确认操作
        handleDelete: function (index) {
            Modal.confirm({
                title: '删除每日福利',
                content: '确定要删除每日福利？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                // 调用删除
                api.DeleteLiveRoomEaery(this.list[index].id).then(() => {
                    this.$message.success('删除成功');
                    this.queryList();
                });
                }
            });
        }
    }
}
</script>