import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'index',
    //   component: () => import('../views/IndexView.vue'),
    // },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/test-message',
      name: 'testMessage',
      component: () => import('../views/test-message.vue'),
    },
    // {
    //   path: '/mhkub9',
    //   name: 'gd1',
    //   component: () => import('../views/GuangDongView1.vue'),
    // },
    // {
    //   path: '/3hsvuk',
    //   name: 'gd2',
    //   component: () => import('../views/GuangDongView2.vue'),
    // },
    // {
    //   path: '/1ex5vw',
    //   name: 'hn1',
    //   component: () => import('../views/HeNanView1.vue'),
    // },
    // {
    //   path: '/e618gn',
    //   name: 'hb',
    //   component: () => import('../views/HuBeiView.vue'),
    // },
    // {
    //   path: '/a8wv05',
    //   name: 'ln',
    //   component: () => import('../views/LiaoNingView.vue'),
    // },
    // {
    //   path: '/ezz1jo',
    //   name: 'sx',
    //   component: () => import('../views/ShanXiView.vue'),
    // },
    // {
    //   path: '/g9uj5j',
    //   name: 'gd3',
    //   component: () => import('../views/GuangDongView3.vue'),
    // },
    // {
    //   path: '/rf5uwy',
    //   name: 'qh',
    //   component: () => import('../views/QingHaiView.vue'),
    // },
    // {
    //   path: '/4rpxjs',
    //   name: 'gs',
    //   component: () => import('../views/GanSuView.vue'),
    // },
    // {
    //   path: '/sqg1rj',
    //   name: 'hn2',
    //   component: () => import('../views/HeNanView2.vue'),
    // },
    // {
    //   path: '/bgwbxz',
    //   name: 'zj',
    //   component: () => import('../views/ZheJiangView.vue'),
    // },
  ],
})

export default router
