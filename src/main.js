import { createApp } from "vue";
import App from "./App.vue";
import "./assets/reset.css"; // 引入清除 CSS
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/dist/index.css"; // 确保引入 Element Plus 的样式

import * as ElementPlusIconsVue from "@element-plus/icons-vue";
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(ElementPlus);
app.mount("#app");
