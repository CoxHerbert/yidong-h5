import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { installGlobalPlugins } from './plugins/global';

import 'vant/lib/index.css';

const app = createApp(App);

installGlobalPlugins(app);

app.use(router);
app.use(store);

app.mount('#app');
