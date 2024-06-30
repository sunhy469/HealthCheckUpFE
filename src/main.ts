import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import Antd from 'ant-design-vue';
import router from './router';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api1'; // 设置默认基础URL
const app = createApp(App);
app.use(router);
app.use(Antd);
app.mount('#app');
app.config.globalProperties.$axios = axios;

