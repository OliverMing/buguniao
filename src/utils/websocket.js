/**
 * WebSocket 管理类
 */
class WebSocketManager {
  constructor(options = {}) {
    this.store = options.store
    this.onNotification = options.onNotification || (() => {})
    this.onMessage = options.onMessage || (() => {})
    this.heartbeatTimer = null
    this.heartbeatInterval = options.heartbeatInterval || 24000
    this.reconnectTimer = null
    this.reconnectDelay = options.reconnectDelay || 5000
  }

  /**
   * 初始化WebSocket
   */
  initWebSocket() {
    const user = this.store.getters['account/user']

    if (window.ws) {
      window.ws.close()
    }
    window.ws = new WebSocket(`${process.env.VUE_APP_WS_BASE_URL}/?userId=${user.id}&nickname=${user.nick_name}&code=0`)

    window.ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)

        if (payload) {
          if (payload.type === 'pong') {
            return console.info("收到心跳响应")
          }

          if (payload.type == 'user_status') {
            this.onNotification({
              message: '用户状态通知',
              type: payload.eventType == 'online' ? 'success' : 'warning',
              description: `用户【${payload.nickname} | ${payload.userId}】${payload.eventType == 'online' ? '已上线' : '已下线'},房间号:${payload.code}`,
              placement: 'BottomRight',
            })
            return false
          }else{
            this.onNotification({
              message: '用户新消息待审核',
              type: 'success',
              description: `用户【${payload.userInfo.nickname}】 在房间 ${payload.code}中发了一条消息：${payload.content}`,
              placement: 'BottomRight',
            })
          }
        }
      } catch (error) {
        // 非 JSON 消息直接透传
      }

      // 调用消息回调
      this.onMessage(event.data)
    }

    window.ws.onopen = () => {
      console.log('Connection opened')
      this.store.commit('setting/setSocketStatus', true)
      this.startHeartbeat()
      this.clearReconnect()
    }

    window.ws.onclose = () => {
      console.log('Connection closed')
      this.store.commit('setting/setSocketStatus', false)
      this.stopHeartbeat()
      this.scheduleReconnect()
    }

    window.ws.onerror = (error) => {
      this.store.commit('setting/setSocketStatus', false)
      this.stopHeartbeat()
      this.scheduleReconnect()
    }
  }

  /**
   * 开始心跳
   */
  startHeartbeat() {
    const user = this.store.getters['account/user']
    this.stopHeartbeat()
    this.heartbeatTimer = setInterval(() => {
      if (!window.ws || window.ws.readyState !== WebSocket.OPEN) {
        this.scheduleReconnect()
        return
      }
      window.ws.send(JSON.stringify({ type: 'ping', id:user.id, nickName: user.nick_name, timestamp: Date.now() }))
    }, this.heartbeatInterval)
  }

  /**
   * 停止心跳
   */
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * 安排重连
   */
  scheduleReconnect() {
    if (this.reconnectTimer) {
      return
    }
    this.reconnectTimer = setTimeout(() => {
      this.clearReconnect()
      this.initWebSocket()
    }, this.reconnectDelay)
  }

  /**
   * 清除重连定时器
   */
  clearReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  /**
   * 关闭WebSocket连接
   */
  close() {
    this.stopHeartbeat()
    this.clearReconnect()
    if (window.ws) {
      window.ws.close()
    }
  }
}

export default WebSocketManager

