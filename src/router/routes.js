import Layout from '@/components/business/Layout/'

export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/index.vue'),
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
      },
    ],
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: () => import('../views/AboutView.vue'),
  // },
]
