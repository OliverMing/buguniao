<template>
  <div>
    <div class="flex justify-start align-center" style="margin-bottom:20px">
      <a-button type="primary" @click="showAdd = true">添加用户</a-button>
    </div>
    <a-card :bordered="false">
      <div>
        <a-table :dataSource="list" :columns="columns" :pagination="false" bordered size="middle">
          <span slot="department" slot-scope="text">{{ getDepartment(text.department) }}</span>
          <div class="handler" slot="operation" slot-scope="text,record,index" v-if="text.grade != 1">
            <a-button type="primary" @click="openLimit(index)" size="small">权限设置</a-button>
            <a-button type="primary" @click="update(index)" size="small" style="margin:0 10px">修改</a-button>
            <a-button type="danger" @click="handleDelete(index)" size="small">删除</a-button>
          </div>
        </a-table>
        <div style="text-align: right;margin-top: 20px;margin-right: -8px;">
          <a-pagination :current="pageId" :pageSize="pageSize" :total="total" @change="changePageId" />
        </div>
      </div>
    </a-card>

    <a-modal title="添加新用户" centered width="760px" :footer="null" @cancel="showAdd = false" :visible="showAdd">
      <Add ref="add" @refresh="refresh" />
    </a-modal>

    <a-modal title="权限设置" centered width="460px" :footer="null" @cancel="showLimit = false" :visible="showLimit">
      <Limit v-if="showLimit" :id="`user-${chooseId}`" :departmentList="departmentList" />
    </a-modal>

    <!-- 获取部门列表 -->
    <Department :show="false" :isTree="true" :list.sync="departmentList" />

  </div>
</template>
  
<script>
// import { getUserList, deleteUser } from '@/services/user'

import api from '@/api'

import Add from './children/add-user'
import Department from './children/add-department'
import Limit from './children/limit'
import { Modal } from 'ant-design-vue'
// import im from '@/api/im'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '账号',
    dataIndex: 'account',
  },
  {
    title: '姓名',
    dataIndex: 'nick_name',
  },
  {
    title: '隶属部门',
    scopedSlots: { customRender: 'department' },
  },
  // {
  //   title: 'im系统编号',
  //   dataIndex: 'im_id',
  // },
  {
    title: '今日资源领取数',
    dataIndex: 'today_resource_num',
  },
  {
    title: '总领取数',
    dataIndex: 'all_resource_num',
  },
  {
    title: '已添加',
    dataIndex: 'add_count',
  },
  {
    title: '客户同意但未添加',
    dataIndex: 'add_nocount',
  },
  {
    title: '注册时间',
    dataIndex: 'create_time',
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
    width: 180
  }
]

export default {
  name: 'User',
  data() {
    return {
      pageId: 1, //页码
      pageSize: 10, //页大小
      chooseId: null, //选择的用户ID
      showAdd: false, //是否显示添加用户弹窗
      list: [], //用户列表
      showLimit: false, // 是否显示权限设置
      departmentList: [],//部门列表
      total: 0, //总数
      columns, // filed
    }
  },
  components: {
    Add,
    Department,
    Limit
  },
  computed: {
    getDepartment() {
      return id => {
        let name = '';
        if (id) {
          const flatArr = this.departmentList.map(e => e.children).flat();
          const item = [...this.departmentList,...flatArr].find(e => e.key == id);
          name = item ? item.title : '';
        }
        return name;
      }
    }
  },
  created() {
    this.queryList();
  },
  methods: {

    refresh(){
      this.showAdd = false;
      this.pageId = 1;
      this.queryList();
    },

    update(index) {
      this.showAdd = true;
      this.$nextTick(() => {
        this.$refs.add.init(this.list[index]);
      })
    },

    onShowSizeChange: function (e) {
      console.info(e);
    },
    changePageId: function (e) {
      this.pageId = e;
      this.queryList();
    },

    // 打开权限设置
    openLimit: function (index) {
      this.chooseId = this.list[index].id;
      this.showLimit = true;
    },

    // 获取用户列表
    queryList: function () {
      api.GetUserList({
        pageId: this.pageId,
        pageSize: this.pageSize
      }).then(data => {
        const { total, records } = data;
        this.list = records;
        this.total = total;
      });
    },
    // 删除确认操作
    handleDelete: function (index) {
      Modal.confirm({
        title: '删除用户',
        content: '确定要删除该用户吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          // 调用删除用户
          const { id } = this.list[index];
          await api.deleteUser({ id });
          this.queryList();
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
</style>
  