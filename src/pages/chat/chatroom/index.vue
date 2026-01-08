<template>
  <div>

    <a-card :bordered="false">
      <div class="flex align-center" style="margin-bottom:20px">
         <!-- 获取store setting setSocketStatus的值: -->
         <div :class="['socket-status', socketStatus ? 'socket-status-online' : 'socket-status-offline']"></div>
        <a-button type="primary" @click="$refs.addChatRoom.open()" size="midden">新增聊天室</a-button>
      </div>

      <a-tabs v-model="groupCurrent" type="card" @change="callback">
        <a-tab-pane v-for="(item, index) in groupList" :key="index">
          <span slot="tab">
            <a-icon type="sketch" v-if="item.is_vip_room == 1" />
            {{ item.code }}<span v-if="item.room_name"> | {{ item.room_name }}</span>
            <span v-if="item.channel_id">{{ getChannelName(item.channel_id) }}</span>
          </span>
          <a-tabs style="margin-top: -10px;">
            <a-tab-pane key="1" tab="消息管理">
              <div>
                <!-- 新增消息 -->
                <a-button type="primary" class="mr-10" size="midden" @click="$refs.addMessage.open()">新增消息</a-button>
                <!-- 修改当前聊天室 -->
                <a-button type="primary" class="mr-10" size="midden" @click="$refs.addChatRoom.open(item)">修改聊天室</a-button>
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
                    <div class="content-text" v-html="record.content" v-else></div>
                  </div>

                  <div class="handler" slot="operation" slot-scope="text,record,index">
                    <a-button type="link" v-if="record.status == 0"
                      @click="audit(record)" size="small">审核通过</a-button>
                    <!-- 引用 -->
                    <a-button type="link" v-else @click="$refs.addMessage.open(record.content)" size="small">引用</a-button>
                    <!-- 删除 -->
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
    
    <template v-if="groupList.length > 0">
      <!-- 战绩回顾 -->
      <PerformanceModel ref="performanceModel" :roomId="groupList[groupCurrent].id" />
      <!-- 新增消息 -->
      <AddMessage ref="addMessage" :code="groupList[groupCurrent].code" @success="changePageId(1)"
        @send="sendMessage" />
    </template>

    <AddChatRoom ref="addChatRoom" 
    :channelListOptions="channelListOptions"
    @success="getLiveRoomList" />

  </div>
</template>

<script>
import { Modal } from 'ant-design-vue'
import api from '@/api'
import PerformanceModel from './PerformanceModel'
import AddMessage from './AddMessage'
import EaeryDayBenefit from './EaeryDayBenefit'
import { mapState } from 'vuex';
import AddChatRoom from './AddChatRoom'
import moment from 'moment';

export default {
  components: {
    PerformanceModel,
    AddMessage,
    EaeryDayBenefit,
    AddChatRoom
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
      visibleHandler: false,
      listPwd: null,
      list: null, // 列表
      total: 0, // 总数
      columns: [
        { title: 'ID', dataIndex: 'id' },
        { title: '房间号', dataIndex: 'code' },
        { title: '用户', dataIndex: 'openid' },
        { title: '内容', scopedSlots: { customRender: 'content' }},
        // { title: '审核',dataIndex: 'is_winnow' },
        { title: '审核状态', scopedSlots: { customRender: 'status' } },
        { title: '创建时间', dataIndex: 'create_time' },
        { title: '操作', scopedSlots: { customRender: 'operation' } },
      ],
      isBan: false,

      ws: null, // WebSocket
      onlineCountList: [],
      channelListOptions:[], // 归属渠道列表
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

    getChannelName() {
      return id => {
        let name = '';
        this.channelListOptions.forEach(item => {
          if (item.id == id) {
            name = `( ${item.channel} | ${item.title} )`;
          }
        })
        return name;
      }
    },

  },
  created() {
    this.getLiveRoomList();
    api.GetLiveShareConfigList().then(res => {
        this.channelListOptions = res;
    })

    this.initWebSocketListener(); // 初始化 WebSocket 监听
  },
  methods: {


    // 初始化 WebSocket 监听
    initWebSocketListener() {
      // 监听 WebSocket 消息
      this.wsMessageHandler = (event) => {
        this.handleWebSocketMessage(event)
      }
      
      // 如果 WebSocket 已存在，直接添加监听
      if (window.ws && window.ws.readyState === WebSocket.OPEN) {
        window.ws.addEventListener('message', this.wsMessageHandler)
      } else {
        // 等待 WebSocket 连接
        const checkWs = setInterval(() => {
          if (window.ws && window.ws.readyState === WebSocket.OPEN) {
            window.ws.addEventListener('message', this.wsMessageHandler)
            clearInterval(checkWs)
          }
        }, 500)
        
        // 10秒后停止检查
        setTimeout(() => {
          clearInterval(checkWs)
        }, 10000)
      }
    },

    // 处理 WebSocket 消息
    handleWebSocketMessage(event) {
      const payload = JSON.parse(event.data)
      // 处理单聊消息
      if (payload.type === 'single' && !payload.formId) {
        const code = payload.code;
        // 判断是否是当前聊天室的消息
        if (code == this.groupList[this.groupCurrent].code) {
          // 刷新列表
          this.changePageId(1);
        } else {
          // 切换到对应聊天室
          this.groupList.forEach((item, index) => {
            if (item.code == code) {
              this.groupCurrent = index;
            }
          })
        }
      }
    },

    // 发送群消息
    sendMessage(message) {
      if (window.ws && message) {
        window.ws.send(message);
      }
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
      api.getLiveRoomList(this.$store.state.account.user.id).then(data => {
        this.groupList = data;
        this.isBan = Number(this.groupList[this.groupCurrent].forbit_chat);
        this.queryList();
        this.getOnlineChatNumber();
      })
    },

    getOnlineChatNumber() {
      const code = this.groupList[this.groupCurrent].code;
      api.GetOnlineChatNumber(code).then(res => {
        this.onlineCountList = res.data;
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
    audit: function (e) {
      api.updateLiveChat({
        id: e.id,
        status: 1
      }).then(() => {
        this.$message.success('审核通过成功');
        this.queryList();
        // 发送群消息
        this.sendMessage(JSON.stringify({
            type:'group',
            code:e.code,
            userInfo:e.userInfo,
            content:e.content,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss') //格式需要调整YYYY-MM-DD HH:mm:ss, //格式需要调整YYYY-MM-DD HH:mm:ss
        }));
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

.content-text{
  max-height: 100px;
  width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  cursor: pointer;

  &:hover{
    color: #1890ff;
  }
}

.chatroom-list{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.chatroom-list-item{
  display: flex;
}

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