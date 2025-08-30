<template>
    <a-card :bordered="false">
        <div class="flex justify-start">
            <iframe src="http://m.yudrbzt.cn?action=game" frameborder="0" style="width:310px;height:600px;overflow-y: auto;"></iframe>
            <div class="flex-1" style="margin-left:20px">
                <div class="game-title">游戏数据统计</div>
                <a-table
                :dataSource="list"
                :columns="columns"
                :pagination="false"
                bordered
                size="middle">
                    <!-- <div class="handler" slot="operation" slot-scope="text,record,index">
                        <a-button type="primary" @click="showAddresBox(index)" size="small">追加资源</a-button>
                        <a-button type="primary" @click="showPhoneList(index)" size="small" style="margin:0 10px;background-color: slategrey;border-color: slategray;">详情</a-button>
                        <a-button type="danger" @click="handleDelete(index)" size="small">删除</a-button>
                    </div> -->
                </a-table>
                <div style="text-align: right;margin-top: 20px;">
                    <a-pagination
                    :current="pageId"
                    :pageSize="pageSize"
                    :total="total" @change="changePageId" />
                </div>
            </div>
        </div>
    </a-card>
</template>

<script>
import { getGameRecordList } from '@/services/game'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '用户手机号码',
    dataIndex: 'phone',
  },
  {
    title: '抽奖次数',
    dataIndex: 'draw_count',
  },
  {
    title: '抽中奖品',
    dataIndex: 'draw_goods',
  },
  {
    title: '最后一次抽奖时间',
    dataIndex: 'last_time',
  }
]

export default {
  name: 'game',
  data () {
    return {
      pageId:1, // 页码
      pageSize:10, // 页大小
      list:null, // 资源列表
      total:20, // 总数
      columns,
    //   desc:"资源列表"
    }
  },
  created() {
    debugger;
    this.queryList();
  },
  methods: {
    changePageId: function (e) {
      this.pageId = e;
      this.queryList();
    },

    // 获取列表
    queryList:function(){
      getGameRecordList({
        pageId:this.pageId,
        pageSize:this.pageSize
      }).then(({ data }) => {
        const { total,records } = data.data;
        this.list = records;
        this.total = total;
      });
    },

  }
}
</script>

<style scoped>
.game-title{margin-bottom: 20px;font-weight: bold;font-size: 16px;}
</style>