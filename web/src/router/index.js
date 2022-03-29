import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/menu1",
        name: "Menu1",
        component: () => import("../components/content/Menu1.vue"),
      },
      {
        path: "/menu2",
        name: "Menu2",
        component: () => import("../components/content/Menu2.vue"),
      },
      {
        path: "/menu3",
        name: "Menu3",
        component: () => import("../components/content/Menu3.vue"),
      },
      {
        path: "/menu4",
        name: "Menu4",
        component: () => import("../components/content/Menu4.vue"),
      },
      {
        path:"/base",
        name:"BaseMap",
        component: () => import("../components/BaseMap.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path:"/register",
    name:"register",
    component: () => import("../views/register.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
