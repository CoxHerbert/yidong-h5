import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import installVant from './plugins/vant';
import 'vant/lib/index.css';
import './styles/global.scss';

const app = createApp(App);
app.use(createPinia());
app.use(router);
installVant(app);
app.mount('#app');
