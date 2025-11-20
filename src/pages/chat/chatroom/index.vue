<template>
  <div>

    <a-card :bordered="false">
      <div class="flex align-center" style="margin-bottom:20px">
         <!-- 获取store setting setSocketStatus的值: -->
         <div :class="['socket-status', socketStatus ? 'socket-status-online' : 'socket-status-offline']"></div>
        <a-button type="primary" @click="showAddResource = true" size="midden">新增聊天室</a-button>
      </div>

      <a-tabs v-model="groupCurrent" type="card" @change="callback">
        <a-tab-pane v-for="(item, index) in groupList" :key="index" :tab="`${item.code}`">
          <a-tabs style="margin-top: -10px;">
            <a-tab-pane key="1" tab="消息管理">
              <div>
                <!-- 新增消息 -->
                <a-button type="primary" class="mr-10" size="midden" @click="$refs.addMessage.open()">新增消息</a-button>
                <!-- 修改当前聊天室 -->
                <a-button type="primary" class="mr-10" size="midden" @click="updateRoom(item)">修改聊天室</a-button>
                <!-- 战绩回顾 -->
                <a-button type="primary" class="mr-10" size="midden"
                  @click="$refs.performanceModel.open()">战绩回顾</a-button>
                <a-button type="danger" class="mr-10" style=" opacity: .7;" @click="deleteChatRoom"
                  size="midden">删除聊天室</a-button>
                
                <!-- onlineCount -->

                <!-- 点击可以查看在线人员列表 -->
                <a-popconfirm placement="right" class="mr-10" ok-text="确认" cancel-text="取消">
                    <a-icon slot="icon" type="user" />
                    <template slot="title">
                       <div style="max-height: 400px;overflow-y: auto;">
                          <!-- 循环 onlineCountList 里面有头像：headimgurl，nickname-->
                          <div class="mb-10" v-for="(item, index) in onlineCountList" :key="index">
                            <img :src="item.headimgurl" alt="" style="width: 30px; height: 30px; border-radius: 50%;">
                            <span style="margin-left: 5px;">{{ item.nickname }}</span>
                        </div>
                      </div>
                    </template>
                    <a-button>查看在线人员列表：{{ onlineCountList.length }}人</a-button>
                  </a-popconfirm>

                  <!-- 是否禁止发言 -->
                <span style="font-size: 12px; color: #555">是否禁止发言</span>:
                <a-switch v-model="isBan" @change="changeForbitStatus" style="margin-left: 10px; opacity: .7;" />
              </div>

              <div style="margin-top:20px">
                <a-table :dataSource="list" :columns="columns" :pagination="false" bordered class="table-box"
                  size="middle" align="center">
                  <div slot="status" slot-scope="e">
                    <a-tag :color="e.status == 1 ? '#03a9f4' : '#ccc'">{{ e.status == 0 ? '审核中' : '已审核' }}</a-tag>
                  </div>

                  <!-- content -->
                  <!-- 如果是一个图片链接则显示图片 -->
                  <div slot="content" slot-scope="text,record">
                    <img v-if="isImageOrVideoOrText(record.content) == 'image'" :src="record.content" alt=""
                      style="width: 60px; height: 60px;">
                    <video v-else-if="isImageOrVideoOrText(record.content) == 'video'" controls :src="record.content"
                      style="width: 200px; height: 100px;"></video>
                    <div v-else>{{ record.content }}</div>
                  </div>

                  <div class="handler" slot="operation" slot-scope="text,record,index">
                    <a-button type="link" v-if="record.status == 0"
                      @click="audit(record.id)" size="small">审核通过</a-button>
                    <a-button type="link" class="link-btn" style="color: #f10;" @click="handleDelete(index)"
                      size="small">删除</a-button>
                  </div>
                </a-table>
              </div>

              <!-- 分页 -->
              <div style="text-align: right;margin-top: 20px;margin-right: -8px;">
                <a-pagination :current="pageId" :pageSize="pageSize" :total="total" @change="changePageId" />
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="每日推送福利">
              <EaeryDayBenefit :code="groupList[groupCurrent].code" />
            </a-tab-pane>
          </a-tabs>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 新增或者修改聊天室 -->
    <a-modal :title="`${chatRoomForm.id ? '修改' : '新增'}聊天室`" centered width="460px" :footer="null"
      @cancel="showAddResource = false" :visible="showAddResource">
      <div>
        <a-form-model ref="ruleForm" @submit="onSubmit" :model="chatRoomForm" :rules="rules" @submit.native.prevent>
          <a-form-model-item label="房间号" prop="code">
            <a-input :disabled="chatRoomForm.id != null" placeholder="请输入房间号(如：123456)" v-model="chatRoomForm.code"
              maxlength="6" />
          </a-form-model-item>
        </a-form-model>
        <!-- 有效期多少天 -->
        <a-form-model-item label="有效期多少天" prop="validity">
          <a-input placeholder="请输入有效期多少天" v-model="chatRoomForm.validity" maxlength="3" />
        </a-form-model-item>
        <!-- 通知 -->
        <a-form-model-item label="通知公告" prop="notice_message">
          <a-input placeholder="请输入通知公告" v-model="chatRoomForm.notice_message" />
        </a-form-model-item>
        <a-form-model-item style="margin-top: 24px">
          <a-button type="primary" htmlType="submit" :loading="uploading" @click="onSubmit">提交</a-button>
        </a-form-model-item>
      </div>
    </a-modal>

    <template v-if="groupList.length > 0">
      <!-- 战绩回顾 -->
      <PerformanceModel ref="performanceModel" :roomId="groupList[groupCurrent].id" />
      <!-- 新增消息 -->
      <AddMessage ref="addMessage" :code="groupList[groupCurrent].code" @success="changePageId(1)"
        @send="sendMessage" />
    </template>




  </div>
</template>

<script>
import { Modal } from 'ant-design-vue'
import api from '@/api'
import PerformanceModel from './PerformanceModel'
import AddMessage from './AddMessage'
import EaeryDayBenefit from './EaeryDayBenefit'
import { mapState } from 'vuex';

export default {
  components: {
    PerformanceModel,
    AddMessage,
    EaeryDayBenefit
  },
  data() {

    return {
      pageId: 1, // 页码
      pageSize: 20, // 页大小
      showAddResource: false, // 是否显示追加资源
      info: null,
      showScrollUser: false,
      groupList: [],
      groupCurrent: 0,
      showGroup: false,
      chatRoomForm: {
        id: null,
        code: null,
        validity: null,
        notice_message: null,
      },
      visibleHandler: false,
      rules: {
        code: { required: true, message: '请输入房间号' },
        notice_message: { required: true, message: '请输入通知公告' },
        validity: { required: true, message: '请输入有效期多少天' },
      },
      listPwd: null,
      list: null, // 列表
      total: 0, // 总数
      columns: [
        { title: 'ID', dataIndex: 'id' },
        { title: '房间号', dataIndex: 'code' },
        { title: '用户', dataIndex: 'openid' },
        { title: '内容', scopedSlots: { customRender: 'content' } },
        // { title: '审核',dataIndex: 'is_winnow' },
        { title: '审核状态', scopedSlots: { customRender: 'status' } },
        { title: '创建时间', dataIndex: 'create_time' },
        { title: '操作', scopedSlots: { customRender: 'operation' } },
      ],
      isBan: false,

      ws: null, // WebSocket
      onlineCountList: [],
    }
  },
  watch: {
    groupCurrent() {
      this.list = [];
      this.pageId = 1;
      this.onlineCountList = [];
      this.getOnlineChatNumber();
      this.queryList();
      this.isBan = Number(this.groupList[this.groupCurrent].forbit_chat);
    }
  },
  computed: {

    //  获取 setting的socketStatus
    ...mapState({
      socketStatus: state => state.setting.socketStatus,
    }),

    // 传入一个字符串判断是图片还是视频还是文本
    isImageOrVideoOrText() {
      return (content) => {
        if (content.indexOf('//') != -1) {
          if (/\.(mp4|mov|avi|flv|m4v)$/i.test(content)) {
            return 'video'
          } else if (/\.(jpeg|jpg|png|gif|bmp|svg|webp)$/i.test(content)) {
            return 'image'
          } else {
            return 'text'
          }
        } else {
          return 'text'
        }
      }
    },
  },

  created() {
    this.getLiveRoomList();
  },
  methods: {

    // 发送群消息
    sendMessage(message) {
      if (window.ws && message) {
        window.ws.send(message);
      }
    },

    updateRoom(item) {
      Object.keys(this.chatRoomForm).forEach(key => {
        this.chatRoomForm[key] = item[key];
      });
      this.showAddResource = true;
    },


    // 禁止、允许发言
    changeForbitStatus(index) {
      api.changeForbitStatus({
        id: this.groupList[this.groupCurrent].id,
        forbit_chat: Number(this.isBan)
      }).then(() => {
        this.$message.success('操作成功');

        // 全员禁言与打开
        this.sendMessage(JSON.stringify({
          type: 'group',
          code: this.groupList[this.groupCurrent].code,
          fn: 'forbit_chat',
          data: Number(this.isBan)
        }));
      })
    },

    openCustomList(id) {
      this.$refs.customListModel.open(id);
    },

    onSubmit: function () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          api[this.chatRoomForm.id ? 'UpdateLiveRoom' : 'AddLiveRoom'](this.chatRoomForm).then(() => {
            this.$message.success('执行成功');
            this.showAddResource = false;
            this.chatRoomForm = {
              id: null,
              code: null,
              validity: null,
              notice_message: null,
            }
            this.getLiveRoomList();
          })
        }
      })
    },

    changePageId: function (e) {
      this.pageId = e;
      this.queryList();
    },

    // 刷新列表
    refreshList: function () {
      this.queryList();
      this.showAddResource = false;
    },

    // 打开追加资源框
    showAddresBox: function () {
      this.info = null;
      this.showAddResource = true;
    },

    close: function () {
      this.showAddResource = false;
      this.info = null;
    },

    // 修改编辑
    edit: function (index) {
      this.info = this.list[index];
      this.showAddResource = true;
    },


    // 获取聊天室列表
    getLiveRoomList: function () {
      api.getLiveRoomList().then(data => {
        this.groupList = data;
        this.isBan = Number(this.groupList[this.groupCurrent].forbit_chat);
        this.queryList();
        this.getOnlineChatNumber();
      })
    },

    getOnlineChatNumber() {
      api.GetOnlineChatNumber(this.groupList[this.groupCurrent].code).then(res => {
        this.onlineCountList = res;
      })
    },

    // 获取列表
    queryList: function () {
      api.getliveChatList({
        code: this.groupList[this.groupCurrent].code,
        pageId: this.pageId,
        pageSize: this.pageSize
      }).then(data => {
        const { total, records } = data;
        this.list = records;
        this.total = total;
      });
    },

    // 审核通过
    audit: function (id) {
      api.updateLiveChat({
        id: id,
        status: 1
      }).then(() => {
        this.$message.success('审核通过成功');
        this.queryList();
      })
    },

    deleteChatRoom: function () {
      Modal.confirm({
        title: '删除聊天室',
        content: '确定要删除该聊天室吗？删除后所有聊天记录将一并删除',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          api.deleteLiveRoom(this.groupList[this.groupCurrent].code).then(() => {
            this.$message.success('删除成功');
            this.list = [];
            this.groupCurrent = 0;
            this.getLiveRoomList();
          })
        }
      });
    },

    // 删除确认操作
    handleDelete: function (index) {
      Modal.confirm({
        title: '删除聊天记录',
        content: '确定要删除该聊天记录？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          // 调用删除
          api.deleteLiveChat(this.list[index].id).then(() => {
            this.$message.success('删除成功');
            this.queryList();
          });
        }
      });
    }

  }
}
</script>

<style lang="less" scoped>

.socket-status{
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 20px;

  &-online{
    background-color: #52c41a;
    // 动画效果
    animation: online 1s infinite;
  }
  
  &-offline{
    background-color: #f5222d;
  }
}

@keyframes online {
    0% {
      box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(82, 196, 26, 0);
  }
}

.steps {
  max-width: 950px;
  margin: 16px auto;
}

.handler {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  width: 150px;
}

.title {
  font-weight: bold;
  margin-bottom: 14px;
  font-size: 18px;
}

.title span {
  padding: 0 10px;
  border-left: 6px solid seagreen;
}

.super-tips {
  font-size: 13px;
  color: #f10;
  text-decoration: underline;
}

// .table-box{margin-top: -5px;}</style>