<template>
    <a-modal
      title="扫码客户列表"
      centered
      width="860px"
      :footer="null"
      @cancel="show = false"
      :visible="show">
         <!-- 表格数据 -->
          <a-table
          :scroll="{ y: '60vh' }" 
          :dataSource="list"
          height="300px"
          :columns="columns"
          :pagination="false"
          bordered
          size="small"
          :align="'center'">
             <div slot="headimgurl" slot-scope="text, record">
                <a-avatar shape="square" icon="user" :src="record.headimgurl" :size="35" />
              </div>
          </a-table>
      </a-modal>
</template>

<script>
import api from '@/api'

export default {
    data(){
        return {
            show: false,
            id:null,
            list:[],
            columns:[
                {  title: 'ID',  dataIndex: 'id',align: 'center',width:80},
                {  title: '渠道',  dataIndex: 'channel',align: 'center' },
                {  title: '昵称',  dataIndex: 'nickname',align: 'center' },
                {  title: '头像', scopedSlots: { customRender: 'headimgurl' },align: 'center'},
                {  title: '扫码时间',  dataIndex: 'create_time',align: 'center',width:200 }
            ]
        }
    },
    methods:{
        open(id){
            this.id = id;
            this.queryList();
            this.show = true;
        },

        queryList(){
            api.getRationErcodeUserList({
                id: this.id
            }).then(data => {
                this.list = data;
            })
        },
    }
}
</script>

<style>
</style>