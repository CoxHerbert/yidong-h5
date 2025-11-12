import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'workbench',
    component: () => import('../views/workbench/WorkbenchView.vue'),
    meta: { title: '工作台' }
  },
  {
    path: '/mine',
    name: 'mine',
    component: () => import('../views/mine/MineView.vue'),
    meta: { title: '我的流程' }
  },
  {
    path: '/create',
    name: 'create',
    component: () => import('../views/create/CreateView.vue'),
    meta: { title: '发起流程' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = String(to.meta.title);
  }
});

export default router;
