import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      children: [
        {
          path: '/',
          name: 'Posts', // Уникальное имя для дочернего маршрута
          component: () => import('@/views/PostPage.vue'),
        },
        // {
        //   path: 'foto',
        //   name: 'Foto',
        //   component: () => import('@/components/views/WeekContent.vue'),
        // },
        // {
        //   path: 'task',
        //   name: 'Task',
        //   component: () => import('@/components/views/WeekContent.vue'),
        // },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'Home' }, // Редирект на "Home"
    },
  ],
});

export default router;