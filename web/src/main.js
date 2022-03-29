import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store'
import Viewer from 'v-viewer';
import {BASEURL ,SOCKET_BASEURL } from './network/config'
Vue.config.productionTip = false
Vue.prototype.BASEURL = BASEURL;
Vue.prototype.SOCKET_BASEURL = SOCKET_BASEURL;

Vue.use(ElementUI);
// 图片预览插件
import 'viewerjs/dist/viewer.css';
Vue.use(Viewer, {
  defaultOptions: {
    navbar: false,
    title: false,
    toolbar: {
      zoomIn: 1,
      zoomOut: 1,
      oneToOne: 4,
      reset: 4,
      prev: 0,
      next: 0,
      rotateLeft: 4,
      rotateRight: 4,
      flipHorizontal: 4,
      flipVertical: 4,
    },
  },
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

//事件总线
var EventBus = new Vue();
Object.defineProperties(Vue.prototype, {
    $bus: {
        get: function () {
            return EventBus
        }
    }
    
})
// router.beforeEach((to, from, next) => {
//   if (to.name == "Login")
//     next();
//   else {
//     if (localStorage.getItem('token')) { next() }
//     else {
//       next('login')
//     }
//   }
// })

