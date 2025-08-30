import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      children: [
        {
          path: 'form',
          name: '调度中心',
          meta: {
            icon: 'apartment',
            page: {
              cacheAble: false
            }
          },
          component: PageView,
          children: [
            {
              path: 'list',
              name: '资源池',
              component: () => import('@/pages/resource/list-all'),
            },
            {
              path: 'record',
              name: '统计',
              component: () => import('@/pages/resource/record'),
            },
          ]
        },
        {
          path: 'tools',
          name: '工具',
          meta: {
            icon: 'tool',
            page: {
              cacheAble: false
            }
          },
          component: PageView,
          children: [
            {
              path: 'workplace',
              name: '获客助手分享',
              component: () => import('@/pages/tools/share-link'),
            },
            {
              path: 'share-content',
              name: '防微信文章分享',
              component: () => import('@/pages/tools/share-content'),
            },
            {
              path: 'ercode-url',
              name: '专属二维码生成器',
              component: () => import('@/pages/tools/ercode'),
            },
            {
              path: 'more-ercode',
              name: '权重比例二维码',
              component: () => import('@/pages/tools/more-ercode'),
            },
            {
              path: 'game',
              name: '客户小游戏',
              component: () => import('@/pages/tools/game'),
            },
          ]
        },
        {
          path: 'user',
          name: '用户管理',
          meta: {
            icon: 'user',
            page: {
              cacheAble: false
            }
          },
          component: PageView,
          children: [
            {
              path: 'user-list',
              name: '用户列表',
              component: () => import('@/pages/user/list'),
            },
            {
              path: 'department',
              name: '部门管理',
              component: () => import('@/pages/user/department'),
            },
          ]
        }
      ]
    },
  ]
}

export default options
