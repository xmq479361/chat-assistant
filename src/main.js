import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'; // 确保引入 Element Plus 的样式
import './assets/reset.css'; // 引入清除 CSS

const app = createApp(App);
app.use(ElementPlus);
app.mount('#app');
