import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/workflow',
    component: () => import('../views/workflow/WorkflowLayout.vue'),
    children: [
      { path: '', redirect: '/workflow/workbench' },
      {
        path: 'workbench',
        name: 'workflow-workbench',
        component: () => import('../views/workflow/WorkbenchView.vue'),
      },
      {
        path: 'create',
        name: 'workflow-create',
        component: () => import('../views/workflow/CreateView.vue'),
      },
      {
        path: 'mine',
        name: 'workflow-mine',
        component: () => import('../views/workflow/MineView.vue'),
      },
      {
        path: 'warehouse',
        name: 'workflow-warehouse',
        component: () => import('../views/workflow/WarehouseView.vue'),
      },
      {
        path: 'form/start',
        name: 'workflow-form-start',
        component: () => import('../views/workflow/FormStartView.vue'),
      },
      {
        path: 'form/detail',
        name: 'workflow-form-detail',
        component: () => import('../views/workflow/FormDetailView.vue'),
      },
      {
        path: 'external/:formKey/start',
        name: 'workflow-external-start',
        component: () => import('../views/workflow/ExternalFormView.vue'),
      },
      {
        path: 'external/:formKey/detail',
        name: 'workflow-external-detail',
        component: () => import('../views/workflow/ExternalFormView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
