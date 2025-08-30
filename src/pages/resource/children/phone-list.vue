<template>
  <div>
    <a-table :dataSource="list" :columns="columns" :pagination="false" bordered size="middle">
      <template slot="get_user" slot-scope="get_user">
        <a-tag :color="get_user ? '#108ee9' : 'rgba(0,0,0,.6)'">{{ get_user ? '已领取' : '未领取' }}</a-tag>
      </template>
      <template slot="mark_id" slot-scope="text">
        <a-tag :color="getMarkColor(text.mark_id) || '#FFF'">{{ getMarkNameById(text.mark_id) }}</a-tag>
      </template>
      <template slot="user_id" slot-scope="text">
        <span v-if="text.user_id != -1">{{ getUserName(text.user_id) }}</span>
        <span v-else style="font-size:12px;color:#888;padding:4px 8px;background:#f5f5f5">回收池数据</span>
      </template>
    </a-table>
    <div style="text-align: right;margin-top: 20px;">
      <a-pagination :current="pageId" :pageSize="pageSize" :total="total" @change="changePageId" />
    </div>
  </div>
</template>

<script>
import { columns } from './phone-list'
import api from '@/api';

export default {
  name: 'phone-list',
  data() {
    return {
      pageId: 1, // 页码
      pageSize: 10, // 页大小
      list: null, // 资源列表
      total: 0, // 总数
      markList: [],
      userList:[],
      columns
    }
  },
  props: {
    id: [String, Number]
  },
  computed: {
    // 获取名字
    getMarkNameById() {
      return id => {
        const item = this.markList.find(e => e.id == id);
        return item?.mark_name || '';
      }
    },

    // 获取标识颜色
    getMarkColor() {
      return id => {
        const item = this.markList.find(e => e.id == id);
        return item?.bg_color || '';
      }
    },

    // 获取用户姓名
    getUserName(){
      return id => {
        if(!id) return "";
        const item = this.userList.find(e => e.id == id);
        return item?.account || '';
      }
    }

  },
  created() {
    this.GetAllUserList();
    this.GetMarkList();
    this.queryList();
  },
  methods: {

    // 获取全部用户列表
    GetAllUserList: function () {
      api.GetAllUserList().then(res => {
        this.userList = res;
      })
    },

    // 获取标签列表
    GetMarkList: function () {
      api.GetMarkList().then(data => {
        this.markList = data;
      })
    },

    // 获取列表
    queryList: function () {
      api.GetBatchInfoList({
        pageId: this.pageId,
        pageSize: this.pageSize,
        id: this.id
      }).then(data => {
        const { total, records } = data;
        this.list = records;
        this.total = total;
      });
    },

    // 改变页码
    changePageId: function (e) {
      this.pageId = e;
      this.queryList();
    },
  }
}  
</script>