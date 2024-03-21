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
        path: "/addFriend",
        name: "addFriend",
        component: () => import("../page/addFriend.vue"),
      },
      {
        path: "/chatroom",
        name: "chatroom",
        component: () => import("../page/chatroom.vue"),
      },
      {
        path: "/creatChatroom",
        name: "creatChatroom",
        component: () => import("../page/creatChatroom.vue"),
      },
      {
        path: "/friendApplication",
        name: "friendApplication",
        component: () => import("../page/friendApplication.vue"),
      },
      {
        path:"/base",
        name:"singleTalk",
        component: () => import("../page/singleTalk.vue"),
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
