import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/singleplayer',
    name: 'Singleplayer',
    component: () => import('../views/Singleplayer.vue'),
  },
  {
    path: '/multiplayer',
    name: 'Multiplayer',
    component: () => import('../views/Multiplayer.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
