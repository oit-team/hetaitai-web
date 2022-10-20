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
        path: '/servicelist/editService',
        name: 'EditService',
        meta: {
          title: '编辑服务',
          keepAlive: false,
          requiresAuth: true,
        },
        component: () => import('../views/Service/EditService.vue'),
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
        path: '/escortlist/addEscort',
        name: 'AddEscort',
        meta: {
          title: '新增陪检员',
          keepAlive: false,
          requiresAuth: true,
        },
        component: () => import('../views/Escort/AddEscort.vue'),
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
      {
        path: '/integralmessagelist',
        name: 'MessageBoard',
        meta: {
          title: '留言管理',
          keepAlive: false,
          requiresAuth: true,
        },
        component: () => import('../views/MessageBoard/index'),
      },
      {
        path: '/orderlist/checkOrder',
        name: 'CheckOrder',
        meta: {
          title: '订单详情',
          keepAlive: false,
          requiresAuth: true,
        },
        component: () => import('../views/Order/CheckOrder.vue'),
      },
      {
        path: '/integralGoodsList',
        name: 'IntegralGoodsList',
        meta: {
          title: '积分商品',
          keepAlive: false,
          requiresAuth: true,
        },
        component: () => import('../views/Integral/IntegralGoodsList.vue'),
      },
      {
        path: '/integralGoodsRecord',
        name: 'IntegralGoodsRecord',
        meta: {
          title: '积分商品兑换记录',
          keepAlive: false,
          requiresAuth: true,
        },
        component: () => import('../views/Integral/IntegralGoodsRecord.vue'),
      },
      {
        path: '/trainingList/addTrain',
        name: 'AddTrain',
        meta: {
          title: '新增培训计划',
          keepAlive: false,
          requiresAuth: true,
        },
        component: () => import('../views/Training/AddTrain.vue'),
      },
      {
        path: '/trainingList',
        name: 'TrainingList',
        meta: {
          title: '培训管理',
          keepAlive: false,
          requiresAuth: true,
        },
        component: () => import('../views/Training/TrainingList.vue'),
      },
    ],
  },
]
