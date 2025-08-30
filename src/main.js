import Vue from 'vue'
import App from './App.vue'
import {initRouter} from './router'
import './theme/index.less'
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import '@/mock'
import store from './store'
import 'animate.css/source/animate.css'
import Plugins from '@/plugins'
import {initI18n} from '@/utils/i18n'
import bootstrap from '@/bootstrap'
import 'moment/locale/zh-cn'
import VueQuillEditor from 'vue-quill-editor'
// 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

const router = initRouter(store.state.setting.asyncRoutes)
const i18n = initI18n('CN', 'US')

Vue.use(Antd)
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Plugins)

import waterfall from 'vue-waterfall2'
Vue.use(waterfall)

bootstrap({router, store, i18n, message: Vue.prototype.$message})


Object.assign(Vue.prototype,{
  moment:require('./utils/moment').default
});

import UploadFile from '@/components/uploadFile'
Vue.component('UploadFile',UploadFile)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
