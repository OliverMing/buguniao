<template>
  <div class="chatroom-single-container">
    <a-card :bordered="false" class="chat-card">
      <div class="chat-layout">
        <!-- 左侧消息列表 -->
        <div class="chat-list-panel">
          <div class="panel-header">
            <h3>单聊列表</h3>
            <div :class="['socket-status', socketStatus ? 'socket-status-online' : 'socket-status-offline']"></div>
          </div>
          <div class="search-box">
            <a-input-search
              v-model="searchKeyword"
              placeholder="搜索昵称..."
              allow-clear
              @change="handleSearchChange"
              @search="handleSearch"
            >
              <a-icon slot="prefix" type="search" />
            </a-input-search>
          </div>
          <div class="chat-list-content">
            <a-list
              :dataSource="filteredConversationList"
              :loading="conversationLoading"
              item-layout="horizontal" >
              <a-list-item
                slot="renderItem"
                slot-scope="item"
                :class="['chat-list-item', { active: selectedConversation && selectedConversation.id === item.id }]"
                @click="selectConversation(item)"
              >
                <a-list-item-meta>
                  <a-avatar slot="avatar" :src="item.headimgurl" icon="user" />
                  <div slot="title" class="conversation-title">
                    <span>{{ item.nickname || item.name || '未知用户' }}</span>
                    <a-badge v-if="item.unreadCount > 0" :count="item.unreadCount" />
                  </div>
                  <div slot="description" class="conversation-desc">
                    <span class="last-message">{{ item.lastMessage || '暂无消息' }}</span>
                    <span class="last-time">{{ item.lastTime || '' }}</span>
                  </div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
        </div>

        <!-- 右侧消息内容 -->
        <div class="chat-content-panel">
          <div v-if="!selectedConversation" class="empty-chat">
            <a-empty description="请选择一个会话开始聊天" />
          </div>
          <div v-else class="chat-content-wrapper">
            <!-- 聊天头部 -->
            <div class="chat-header">
              <div class="chat-user-info">
                <a-avatar :src="selectedConversation.headimgurl" icon="user" />
                <div class="user-details">
                  <div class="user-name">{{ selectedConversation.nickname || selectedConversation.name || '未知用户' }}（{{ selectedConversation.chat_id }}）</div>
                  <!-- <div class="user-status">
                    <a-icon type="check-circle" :style="{ color: '#52c41a' }" />
                    <span>在线</span>
                  </div> -->
                </div>
              </div>
            </div>

            <!-- 消息列表 -->
            <div class="messages-container" ref="messagesContainer">
              <div
                v-for="(message, index) in messageList"
                :key="message.id || index"
                :class="['message-item', { 'message-sent': message.isSent, 'message-received': !message.isSent }]"
              >
                <div class="message-avatar">
                  <a-avatar
                    :src="message.isSent ? currentUserAvatar : (selectedConversation.headimgurl)"
                    icon="user"
                    :size="40"
                  />
                </div>
                <div class="message-content-wrapper">
                  <div class="message-info">
                    <span class="message-sender">{{ message.isSent ? '我' : (selectedConversation.nickname || '对方') }}</span>
                    <span class="message-time">{{ formatTime(message.create_time || message.time) }}</span>
                  </div>
                  <div class="message-bubble">
                    
                    <img v-if="isImageUrl(message.content)" :src="message.content" alt="图片" class="message-image" />
                    <video v-else-if="isVideoUrl(message.content)" :src="message.content" controls class="message-video"></video>
                    <div v-else class="message-text">{{ message.content }}</div>
                  </div>
                </div>
              </div>
              <div v-if="messageList.length === 0" class="empty-messages">
                <a-empty description="暂无消息" />
              </div>
            </div>

            <!-- 输入区域 -->
            <div class="chat-input-area">
              <!-- 表情工具栏 -->
              <div v-if="showEmojiPicker" class="emoji-picker">
                <div class="emoji-grid">
                  <span
                    v-for="emoji in emojiList"
                    :key="emoji"
                    class="emoji-item"
                    @click="insertEmoji(emoji)"
                  >{{ emoji }}</span>
                </div>
              </div>
              
              <div class="input-toolbar">
                <a-button
                  type="link"
                  icon="smile"
                  @click="toggleEmojiPicker"
                  :class="{ active: showEmojiPicker }"
                ></a-button>
                <a-upload
                  name="files"
                  :show-upload-list="false"
                  :action="actionUrl"
                  :before-upload="beforeImageUpload"
                  @change="handleImageChange"
                >
                  <a-button type="link" icon="picture"></a-button>
                </a-upload>
              </div>
              
              <div class="input-wrapper">
                <a-textarea
                  v-model="inputMessage"
                  placeholder="输入消息..."
                  :auto-size="{ minRows: 4, maxRows: 4 }"
                  @keydown.enter.exact.prevent="handleEnterKey"
                  @keydown.enter.shift.exact="handleShiftEnter"
                  ref="messageInput" />
                  <a-button
                  type="primary"
                  icon="message"
                  :loading="sending"
                  @click="sendMessage()"
                  :disabled="!inputMessage.trim()"
                  class="send-button">发送</a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import api from '@/api'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'ChatroomSingle',
  data() {
    return {
      conversationList: [],
      conversationLoading: false,
      selectedConversation: null,
      messageList: [],
      inputMessage: '',
      sending: false,
      showEmojiPicker: false,
      searchKeyword: '',
      actionUrl: `${process.env.VUE_APP_API_BASE_URL}/Admin/UploadFile`,
      baseUrl: `${process.env.VUE_APP_API_BASE_URL}`,
      currentUserAvatar: '',
      emojiList: [
        '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
        '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
        '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
        '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
        '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
        '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
        '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
        '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
        '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈',
        '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾',
        '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿',
        '😾'
      ]
    }
  },
  computed: {
    ...mapState({
      socketStatus: state => state.setting.socketStatus,
      user: state => state.account.user
    }),

    // 正则表达式来匹配图片链接
		isImageUrl(){
			return e => {
        const regex = /\.(jpeg|jpg|png|gif|bmp|svg|webp)$/i; // 可选的后缀名，忽略大小写  
			  return regex.test(e);  
      }
		},

		// 正则表达式来匹配视频链接
		isVideoUrl(){
			return e => {
        const regex = /\.(mp4|mov|avi|wmv|flv|mkv)$/i; // 可选的后缀名，忽略大小写  
			  return regex.test(e);  
      }
		},
    
    // 过滤后的会话列表
    filteredConversationList() {
      if (!this.searchKeyword || !this.searchKeyword.trim()) {
        return this.conversationList
      }
      
      const keyword = this.searchKeyword.trim().toLowerCase()
      return this.conversationList.filter(item => {
        const nickname = (item.nickname || item.name || '').toLowerCase()
        return nickname.includes(keyword)
      })
    }
  },
  created() {
    this.loadConversationList()
    this.initWebSocketListener()
  },
  mounted() {
    // 点击外部关闭表情选择器
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    this.removeWebSocketListener()
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {

    // 加载会话列表
    loadConversationList() {
      this.conversationLoading = true
      // 这里使用 GetLiveUserList 作为示例，实际应该调用单聊会话列表接口
      api.GetConversationList(this.user.id).then(data => {
        this.conversationList = data.map(item => ({
          id: item.userInfo.id,
          chat_id: item.userInfo.chat_id,
          nickname: item.userInfo.nickname,
          headimgurl: item.userInfo.headimgurl,
          name: item.userInfo.nickname,
          lastMessage: item.last_content,
          lastTime: item.last_time,
          unreadCount: item.toId == this.user.id ? item.no_read_count : 0
        }))
        this.conversationLoading = false
      }).catch(() => {
        this.conversationLoading = false
      })
    },

    // 选择会话
    selectConversation(conversation) {
      conversation.unreadCount = 0; // 清空未读消息数
      this.selectedConversation = conversation
      this.showEmojiPicker = false
      this.loadMessages(conversation.id)
    },

    // 加载消息列表
    loadMessages(userId) {
      if (!userId) return
      
      // 使用 IM API 获取消息列表
      api.GetSingleChatList({
        userId,
        pageNo: 1,
        pageSize: 100
      }).then(data => {
        // 倒叙排列消息列表
        data = data.reverse();
        this.messageList = data.map(msg => ({
          ...msg,
          isSent: msg.formId === this.user.id,
          type: msg.type || 'text'
        }))
        this.$nextTick(() => {
          setTimeout(() => {
            this.scrollToBottom()
          }, 800);
        })
      }).catch(() => {
        this.messageList = []
      })
    },

    // 发送消息
    sendMessage(content = null) {

      if(!content){
        if (!this.inputMessage.trim() || !this.selectedConversation) return
      }

      this.sending = true

      // 添加到消息列表
      api.InsertSingleChat({
        formId: this.user.id,
        toId: this.selectedConversation.id,
        content: content || this.inputMessage.trim()
      }).then(data => {
        this.messageList.push({
          ...data,
          isSent:true,
          type: data.type || 'text'
        })

        // 通过 WebSocket 发送消息
        if (window.ws && window.ws.readyState === WebSocket.OPEN) {
          const params = {
            ...data,
            type: 'single',
            userId: this.selectedConversation.id
          }
          window.ws.send(JSON.stringify(params))
        }

      })

      this.inputMessage = ''
      this.sending = false
      this.$nextTick(() => {
        setTimeout(() => {
          this.scrollToBottom()
        }, 800);
      })
    },

    // 滚动到底部
    scrollToBottom() {
      const container = this.$refs.messagesContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },

    // 格式化时间
    formatTime(time) {
      if (!time) return ''
      const now = moment()
      const msgTime = moment(time)
      if (now.diff(msgTime, 'days') === 0) {
        return msgTime.format('HH:mm')
      } else if (now.diff(msgTime, 'days') === 1) {
        return '昨天 ' + msgTime.format('HH:mm')
      } else if (now.diff(msgTime, 'days') < 7) {
        return msgTime.format('dddd HH:mm')
      } else {
        return msgTime.format('YYYY-MM-DD HH:mm')
      }
    },

    // 切换表情选择器
    toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker
    },

    // 插入表情
    insertEmoji(emoji) {
      this.inputMessage += emoji
      this.$refs.messageInput.focus()
    },

    // 处理回车键
    handleEnterKey() {
      if (!this.inputMessage.trim()) return
      this.sendMessage()
    },

    // 处理 Shift+Enter
    handleShiftEnter() {
      // Shift+Enter 换行，不做处理
    },


    // 图片上传前验证
    beforeImageUpload(file) {
      const isImage = file.type.indexOf('image/') === 0
      if (!isImage) {
        this.$message.error('只能上传图片文件!')
        return false
      }
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('图片大小不能超过 5MB!')
        return false
      }
      return true
    },

    // 图片上传变化
    handleImageChange(info) {
      if (info.file.status === 'uploading') {
        return
      }
      if (info.file.status === 'done') {
        debugger;
        const imageUrl = `${this.baseUrl}/${info.file.response.data}`
        this.sendMessage(imageUrl)
        this.$message.success('图片上传成功')
      } else if (info.file.status === 'error') {
        this.$message.error('图片上传失败')
      }
    },

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

    // 移除 WebSocket 监听
    removeWebSocketListener() {
      if (window.ws && this.wsMessageHandler) {
        window.ws.removeEventListener('message', this.wsMessageHandler)
      }
    },

    // 处理 WebSocket 消息
    handleWebSocketMessage(event) {
      try {
        const payload = JSON.parse(event.data)
        
        // 处理单聊消息
        if (payload.type === 'single' && payload.formId) {
          // 如果消息来自当前选中的会话，则添加到消息列表
          if (this.selectedConversation && (payload.formId == this.selectedConversation.id)) {
            this.messageList.push({
              id: payload.id,
              content: payload.content,
              type: 'text',
              isSent: false,
              create_time: payload.create_time,
              time: new Date().toISOString()
            })
            this.$nextTick(() => {
              setTimeout(() => {
                this.scrollToBottom()
              }, 800);
            })
          }
          // 如果会话中不存在该用户，则添加到会话列表
          else if (!this.conversationList.find((conversation) => conversation.id === payload.formId)) {
            this.conversationList.unshift({
              id: payload.formId,
              nickname: payload.userInfo.nickname,
              headimgurl: payload.userInfo.headimgurl,
              unreadCount: 1,
              lastMessage: payload.content,
              lastMessageTime: payload.create_time
            })
            this.$message.info(`收到来自 ${payload.userInfo.nickname} 的消息`)
          }
          // 如果消息来自其他会话，则更新会话列表中的未读消息数
          else {
            this.conversationList.forEach((conversation) => {
              if (conversation.id === payload.formId) {
                // 顺序提到第一个
                this.conversationList.splice(this.conversationList.indexOf(conversation), 1)
                this.conversationList.unshift(conversation)
                conversation.lastMessage = payload.content;
                conversation.lastMessageTime = payload.create_time;
                conversation.chat_id = payload.userInfo.chat_id;
                conversation.unreadCount++
              }
            })
          }
        }
      } catch (error) {
        // 非 JSON 消息，忽略
      }
    },

    // 处理点击外部关闭表情选择器
    handleClickOutside(event) {
      const emojiPicker = this.$el.querySelector('.emoji-picker')
      const emojiButton = this.$el.querySelector('.input-toolbar .ant-btn-link[icon="smile"]')
      
      if (emojiPicker && emojiButton) {
        if (!emojiPicker.contains(event.target) && !emojiButton.contains(event.target)) {
          this.showEmojiPicker = false
        }
      }
    },

    // 处理搜索
    handleSearch(value) {
      this.searchKeyword = value
    },

    // 处理搜索输入变化（实时搜索）
    handleSearchChange(e) {
      this.searchKeyword = e.target.value
    }
  }
}
</script>



<style lang="less" scoped>

.ant-spin-nested-loading {
  margin-top: 40px !important;
}

.chatroom-single-container {
  height: calc(100vh - 270px);
  
  .chat-card {
    height: 100%;
    
    /deep/ .ant-card-body {
      height: 100%;
      padding: 0;
      display: flex;
      flex-direction: column;
    }
  }
}

.chat-layout {
  display: flex;
  height: 100%;
  overflow: hidden;
}

// 左侧消息列表
.chat-list-panel {
  width: 320px;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  background: #fafafa;

  .panel-header {
    padding: 16px;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .search-box {
    padding: 12px 16px;
    border-bottom: 1px solid #e8e8e8;
    background: #fff;

    /deep/ .ant-input-search {
      .ant-input {
        border-radius: 4px;
      }
    }
  }

  .chat-list-content {
    flex: 1;
    overflow-y: auto;
    background: #fff;

    .chat-list-item {
      padding: 12px 16px;
      cursor: pointer;
      border-bottom: 1px solid #f0f0f0;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f5f5f5;
      }

      &.active {
        background-color: #e6f7ff;
        border-left: 3px solid #1890ff;
      }

      .conversation-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 500;
        margin-bottom: 4px;
      }

      .conversation-desc {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #999;

        .last-message {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 8px;
        }

        .last-time {
          flex-shrink: 0;
        }
      }
    }

    .empty-state {
      padding: 40px 20px;
      text-align: center;
    }
  }
}

// 右侧消息内容
.chat-content-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;

  .empty-chat {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chat-content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .chat-header {
    padding: 16px 20px;
    border-bottom: 1px solid #e8e8e8;
    background: #fff;

    .chat-user-info {
      display: flex;
      align-items: center;

      .user-details {
        margin-left: 12px;

        .user-name {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .user-status {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #999;

          span {
            margin-left: 4px;
          }
        }
      }
    }
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: #f5f5f5;

    .message-item {
      display: flex;
      margin-bottom: 16px;

      &.message-sent {
        flex-direction: row-reverse;

        .message-content-wrapper {
          align-items: flex-end;

          .message-bubble {
            background: #1890ff;
            color: #fff;
            border-radius: 12px 12px 4px 12px;
          }
        }
      }

      &.message-received {
        .message-content-wrapper {
          align-items: flex-start;

          .message-bubble {
            background: #fff;
            color: #333;
            border-radius: 12px 12px 12px 4px;
          }
        }
      }

      .message-avatar {
        margin: 0 12px;
      }

      .message-content-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        max-width: 60%;

        .message-info {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          font-size: 12px;
          color: #999;

          .message-sender {
            margin-right: 8px;
          }

          .message-time {
            font-size: 11px;
          }
        }

        .message-bubble {
          padding: 10px 14px;
          word-wrap: break-word;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

          .message-text {
            white-space: pre-wrap;
            line-height: 1.5;
          }

          .message-image {
            max-width: 300px;
            max-height: 300px;
            border-radius: 4px;
            cursor: pointer;
          }

          .message-video {
            max-width: 300px;
            max-height: 300px;
            border-radius: 4px;
          }
        }
      }
    }

    .empty-messages {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
  }

  .chat-input-area {
    border-top: 1px solid #e8e8e8;
    background: #fff;
    padding: 0 16px;
    height: 140px;

    .emoji-picker {
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      background: #fff;
      padding: 12px;
      margin-bottom: 12px;
      max-height: 200px;
      overflow-y: auto;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .emoji-grid {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        gap: 8px;

        .emoji-item {
          font-size: 24px;
          cursor: pointer;
          text-align: center;
          padding: 4px;
          border-radius: 4px;
          transition: background-color 0.2s;

          &:hover {
            background-color: #f0f0f0;
          }
        }
      }
    }

    .input-toolbar {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      gap: 8px;

      .ant-btn-link {
        padding: 4px 8px;
        color: #666;

        &:hover {
          color: #1890ff;
        }

        &.active {
          color: #1890ff;
        }
      }
    }

    .input-wrapper {
      display: flex;
      align-items: flex-end;
      gap: 12px;

      .ant-input {
        flex: 1;
      }

      .send-button {
        flex-shrink: 0;
        height: 95px;
        text-align: center;
      }
    }
  }
}

// Socket 状态指示器
.socket-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &-online {
    background-color: #52c41a;
    animation: online 1s infinite;
  }

  &-offline {
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

// 滚动条样式
.chat-list-content,
.messages-container {
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;

    &:hover {
      background: #a8a8a8;
    }
  }
}
</style>