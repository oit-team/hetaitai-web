import Layout from '@/components/business/Layout/'

export default [
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      keepAlive: false,
      requiresAuth: false,
    },
    component: () => import('../views/Login/index.vue'),
  },
  {
    path: '',
    component: Layout,
    meta: {
      keepAlive: true,
      requiresAuth: true,
    },
    redirect: '/serviceList',
    children: [
      {
        path: '/serviceList',
        name: 'ServiceList',
        meta: {
          title: '服务管理',
          keepAlive: false,
          requiresAuth: true,
        },
        component: () => import('../views/Service/ServiceList.vue'),
      },
      {
        path: '/userlist',
        name: 'UserList',
        meta: {
          title: '用户管理',
          keepAlive: true,
          requiresAuth: true,
        },
        component: () => import('../views/User/UserList.vue'),
      },
      {
        path: '/user/addUser',
        name: 'AddUser',
        meta: {
          title: '新增用户',
          keepAlive: false,
          requiresAuth: true,
        },
        component: () => import('../views/User/AddUser.vue'),
      },
      {
        path: '/escortlist',
        name: 'EscortList',
        meta: {
          title: '陪检员',
          keepAlive: false,
          requiresAuth: true,
        },
        component: () => import('../views/Escort/EscortList.vue'),
      },
      {
        path: '/orderlist',
        name: 'OrderList',
        meta: {
          title: '订单管理',
          keepAlive: false,
          requiresAuth: true,
        },
        component: () => import('../views/Order/OrderList.vue'),
      },
    ],
  },
]
