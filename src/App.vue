<template>
  <a-config-provider :locale="locale" :get-popup-container="popContainer">
    <router-view />
  </a-config-provider>
</template>

<script>
import { enquireScreen } from './utils/util'
import { mapState, mapMutations } from 'vuex'
import themeUtil from '@/utils/themeUtil';
import { getI18nKey } from '@/utils/routerUtil'
import WebSocketManager from '@/utils/websocket'

export default {
  name: 'App',
  data() {
    return {
      locale: {},
      wsManager: null,
    }
  },
  created() {
    this.setHtmlTitle()
    this.setLanguage(this.lang)
    enquireScreen(isMobile => this.setDevice(isMobile));
    this.$store.getters['account/user'];
    this.initWebSocket();
  },
  mounted() {
    this.setWeekModeTheme(this.weekMode)
  },
  beforeDestroy() {
    if (this.wsManager) {
      this.wsManager.close()
    }
  },
  watch: {
    weekMode(val) {
      this.setWeekModeTheme(val)
    },
    lang(val) {
      this.setLanguage(val)
      this.setHtmlTitle()
    },
    $route() {
      this.setHtmlTitle()
    },
    'theme.mode': function (val) {
      let closeMessage = this.$message.loading(`您选择了主题模式 ${val}, 正在切换...`)
      themeUtil.changeThemeColor(this.theme.color, val).then(closeMessage)
    },
    'theme.color': function (val) {
      let closeMessage = this.$message.loading(`您选择了主题色 ${val}, 正在切换...`)
      themeUtil.changeThemeColor(val, this.theme.mode).then(closeMessage)
    },
    'layout': function () {
      window.dispatchEvent(new Event('resize'))
    }
  },
  computed: {
    ...mapState('setting', ['layout', 'theme', 'weekMode', 'lang'])
  },
  methods: {
    ...mapMutations('setting', ['setDevice']),
    setWeekModeTheme(weekMode) {
      if (weekMode) {
        document.body.classList.add('week-mode')
      } else {
        document.body.classList.remove('week-mode')
      }
    },
    setLanguage(lang) {
      this.$i18n.locale = lang
      switch (lang) {
        case 'CN':
          this.locale = require('ant-design-vue/es/locale-provider/zh_CN').default
          break
        case 'HK':
          this.locale = require('ant-design-vue/es/locale-provider/zh_TW').default
          break
        case 'US':
        default:
          this.locale = require('ant-design-vue/es/locale-provider/en_US').default
          break
      }
    },
    setHtmlTitle() {
      const route = this.$route
      const key = route.path === '/' ? 'home.name' : getI18nKey(route.matched[route.matched.length - 1].path)
      document.title = process.env.VUE_APP_NAME + ' | ' + this.$t(key)
    },
    popContainer() {
      return document.getElementById("popContainer")
    },

    // 初始化WebSocket
    initWebSocket() {
      const userInfo = this.$store.getters['account/user'];
      if(userInfo && !window.wsManager){
        window.wsManager = new WebSocketManager({
          store: this.$store,
          onNotification: (config) => {
            this.$notification.open(config)
          },
          onMessage: (data) => {
            if (Array.isArray(this.messages)) {
              this.messages.push(data)
            }
          }
        })
        window.wsManager.initWebSocket()
      }
    },
  }
}
</script>

<style lang="less">
@import "flex.css";

.ql-container{
  max-height: 450px !important;
  overflow-y: auto !important;
}

.link-btn {
  color: #f10 !important;
}

.mr-10 {
  margin-right: 10px;
}

.ml-10 {
  margin-left: 10px;
}

.mt-10 {
  margin-top: 10px;
}

.mb-10 {
  margin-bottom: 10px;
}

.mr-20 {
  margin-right: 20px;
}

.ml-20 {
  margin-left: 20px;
}

.mt-20 {
  margin-top: 20px;
}

.mb-20 {
  margin-bottom: 20px;
}

.mr-30 {
  margin-right: 30px;
}

.ml-30 {
  margin-left: 30px;
}

.mt-30 {
  margin-top: 30px;
}

.mb-30 {
  margin-bottom: 30px;
}

.mr-40 {
  margin-right: 40px;
}

.ml-40 {
  margin-left: 40px;
}

.mt-40 {
  margin-top: 40px;
}

.mb-40 {
  margin-bottom: 40px;
}

.mr-50 {
  margin-right: 50px;
}

.ml-50 {
  margin-left: 50px;
}

.mt-50 {
  margin-top: 50px;
}

.mb-50 {
  margin-bottom: 50px;
}
</style>
