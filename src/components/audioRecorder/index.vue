<template>
  <div class="audio-recorder">
    <div class="btn-group">
      <a-button
        type="primary"
        icon="audio"
        @click="handleRecord"
        :disabled="recording || uploading"
      >
        {{ recording ? '录音中...' : (hasAudio ? '重新录音' : '开始录音') }}
      </a-button>
      <a-button
        style="margin-left: 8px;"
        icon="stop"
        @click="handleStop"
        :disabled="!recording"
      >
        停止
      </a-button>
      <a-button
        style="margin-left: 8px;"
        icon="play-circle"
        @click="handlePlay"
        :disabled="!hasAudio || recording"
      >
        播放
      </a-button>
      <a-button
        type="primary"
        style="margin-left: 8px;"
        icon="cloud-upload"
        :loading="uploading"
        @click="handleUpload"
        :disabled="!blob || uploading"
      >
        {{ value ? '重新上传' : '上传' }}
      </a-button>
    </div>

    <div class="status-text">
      <span v-if="recording">正在录音：{{ duration }} 秒</span>
      <span v-else-if="hasAudio && !uploading">录音时长：{{ duration }} 秒</span>
      <span v-if="value && !uploading" class="url-text">
        已上传地址：
        <a :href="value" target="_blank">{{ value }}</a>
      </span>
    </div>
  </div>
</template>

<script>
import request from 'umi-request'

export default {
  name: 'AudioRecorder',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      mediaRecorder: null,
      chunks: [],
      blob: null,
      audioUrl: '',
      recording: false,
      uploading: false,
      duration: 0,
      timer: null
    }
  },
  computed: {
    hasAudio () {
      return !!this.blob || !!this.audioUrl
    }
  },
  beforeDestroy () {
    this.clearTimer()
    this.stopStream()
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl)
    }
  },
  methods: {
    // 开始/重新开始录音
    async handleRecord () {
      try {
        if (this.recording) return

        // 基础能力检测
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          this.$message.error('当前浏览器不支持录音，请使用最新版 Chrome，并在 https 或 localhost 环境下访问')
          return
        }

        // 重新录音时清理旧数据
        this.stopStream()
        this.blob = null
        if (this.audioUrl) {
          URL.revokeObjectURL(this.audioUrl)
          this.audioUrl = ''
        }
        this.chunks = []
        this.duration = 0

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const options = this.getRecorderOptions()
        const mediaRecorder = new MediaRecorder(stream, options)
        this.mediaRecorder = mediaRecorder

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            this.chunks.push(e.data)
          }
        }

        mediaRecorder.onstop = () => {
          if (this.chunks.length) {
            this.blob = new Blob(this.chunks, { type: mediaRecorder.mimeType || 'audio/webm' })
            this.audioUrl = URL.createObjectURL(this.blob)
          }
          this.recording = false
          this.clearTimer()
          this.stopStream()
        }

        mediaRecorder.start()
        this.recording = true
        this.startTimer()
      } catch (e) {
        console.error(e)
        // 根据不同错误类型给出更准确的提示
        const name = e && (e.name || e.code || '')
        if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
          this.$message.error('已拒绝麦克风权限，请点击地址栏右侧的小锁图标，允许本网站使用麦克风后刷新页面')
        } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
          this.$message.error('未检测到可用的麦克风设备，请检查系统声音设置后重试')
        } else if (name === 'NotReadableError') {
          this.$message.error('麦克风可能被其它程序占用，请关闭占用麦克风的程序后重试')
        } else if (name === 'SecurityError') {
          this.$message.error('录音功能需要在 https 或 localhost 环境下使用，请勿在 http 或 IP 地址直接访问')
        } else {
          this.$message.error('无法开始录音：' + (e.message || '请检查浏览器麦克风权限设置'))
        }
      }
    },

    // 获取录音配置（兼容不同浏览器）
    getRecorderOptions () {
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/ogg'
      ]
      for (let type of mimeTypes) {
        if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(type)) {
          return { mimeType: type }
        }
      }
      return {}
    },

    // 停止录音
    handleStop () {
      if (this.mediaRecorder && this.recording) {
        this.mediaRecorder.stop()
      }
    },

    // 本地播放录音
    handlePlay () {
      if (!this.audioUrl) return
      const audio = new Audio(this.audioUrl)
      audio.play()
    },

    // 上传录音文件
    async handleUpload () {
      if (!this.blob) {
        return this.$message.warning('请先录制语音')
      }
      this.uploading = true
      try {
        const formData = new FormData()
        // 统一使用 files 字段，和其他上传接口保持一致
        const fileName = `audio_${Date.now()}.webm`
        const file = new File([this.blob], fileName, { type: this.blob.type || 'audio/webm' })
        formData.append('files', file)

        const res = await request(`${process.env.VUE_APP_API_BASE_URL}/Admin/UploadFile`, {
          method: 'post',
          data: formData
        })

        const url = process.env.VUE_APP_API_BASE_URL + `/${res.data}`
        this.$emit('input', url)
        this.$emit('change', url)
        this.$message.success('语音上传成功')
      } catch (err) {
        console.error(err)
        this.$message.error(err.message || '语音上传失败')
      } finally {
        this.uploading = false
      }
    },

    // 计时器
    startTimer () {
      this.clearTimer()
      this.timer = setInterval(() => {
        this.duration += 1
      }, 1000)
    },
    clearTimer () {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },

    // 停止媒体流
    stopStream () {
      if (this.mediaRecorder && this.mediaRecorder.stream) {
        this.mediaRecorder.stream.getTracks().forEach(t => t.stop())
      }
    }
  }
}
</script>

<style scoped>
.audio-recorder {
  display: flex;
  flex-direction: column;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
}

.status-text {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  display: flex;
  flex-direction: column;
}

.url-text {
  margin-top: 4px;
  word-break: break-all;
}
</style>


