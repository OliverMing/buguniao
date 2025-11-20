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
          path: 'dashboard',
          name: 'Dashboard',
          meta: {
            icon: 'dashboard'
          },
          component: BlankView,
          children: [
            {
            path: 'workplace',
            name: '工作台',
            component: () => import('@/pages/dashboard/workplace/WorkPlace'),
          }
        ]
        },
        {
          path: 'form',
          name: '调度中心',
          meta: {
            icon: 'apartment',
            page: {
              cacheAble: false
            },
            authority: {
              permission: 'form'
            }
          },
          component: PageView,
          children: [
            {
              path: 'list',
              name: '资源池',
              component: () => import('@/pages/resource/list-all'),
              meta: {
                authority: {
                  permission: 'pool'
                }
              },
            },
            {
              path: 'record',
              name: '统计',
              component: () => import('@/pages/resource/record'),
              meta: {
                authority: {
                  permission: 'pool-statistics'
                }
              },
            },
          ]
        },
        {
          path: 'chat',
          name: '聊天室',
          meta: {
            icon: 'home',
            page: {
              cacheAble: false
            },
            authority: {
              permission: 'chat'
            }
          },
          component: PageView,
          children: [
            {
              path: 'chatroom',
              name: '聊天室管理',
              component: () => import('@/pages/chat/chatroom/index'),
              meta:{
                authority: {
                  permission: 'chatroom'
                }
              }
            },
            {
              path: 'chatroom-user',
              name: '聊天室用户管理',
              component: () => import('@/pages/chat/chatroom-user/index'),
              meta:{
                authority: {
                  permission: 'chatroom-user'
                }
              }
            },
            {
              path: 'chatroom-role',
              name: '聊天室角色管理',
              component: () => import('@/pages/chat/chatroom-role/index'),
              meta:{
                authority: {
                  permission: 'chatroom-role'
                }
              }
            }
          ]
        },
        {
          path: 'tools',
          name: '工具',
          meta: {
            icon: 'tool',
            page: {
              cacheAble: false
            },
            authority: {
              permission: 'tools'
            }
          },
          component: PageView,
          children: [
            {
              path: 'pic',
              name: '作图小工具',
              component: () => import('@/pages/tools/pic'),
              meta:{
                authority: {
                  permission: 'pic'
                }
              }
            },
            {
              path: 'share-content',
              name: '防微信文章分享',
              component: () => import('@/pages/tools/share-content'),
              meta:{
                authority: {
                  permission: 'share-content'
                }
              }
            },
            {
              path: 'more-ercode',
              name: '权重比例二维码',
              component: () => import('@/pages/tools/more-ercode'),
              meta:{
                authority: {
                  permission: 'more-ercode'
                }
              }
            },
            {
              path: 'workplace',
              name: '获客助手分享',
              component: () => import('@/pages/tools/share-link'),
              meta:{
                authority: {
                  permission: 'share-link'
                }
              }
            },
            // {
            //   path: 'ercode-url',
            //   name: '专属二维码生成器',
            //   component: () => import('@/pages/tools/ercode'),
            // },
            // {
            //   path: 'game',
            //   name: '客户小游戏',
            //   component: () => import('@/pages/tools/game'),
            // },
          ]
        },
        {
          path: 'user',
          name: '用户管理',
          meta: {
            icon: 'user',
            page: {
              cacheAble: false
            },
            authority: {
              permission: 'user'
            }
          },
          component: PageView,
          children: [
            {
              path: 'user-list',
              name: '用户列表',
              component: () => import('@/pages/user/list/index'),
              meta: {
                authority:{
                  permission:'user-list'
                }
              }
            },
            {
              path: 'department',
              name: '部门管理',
              component: () => import('@/pages/user/department'),
              meta: {
                authority:{
                  permission:'department'
                }
              }
            },
          ]
        }
      ]
    },
  ]
}

export default options
