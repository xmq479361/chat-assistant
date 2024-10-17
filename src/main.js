import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'; // 更新此行
import './assets/reset.css'; // 引入清除 CSS

createApp(App).use(ElementPlus).mount('#app');
