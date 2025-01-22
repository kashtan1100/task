import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createBootstrap } from 'bootstrap-vue-next';

import App from './App.vue';
import router from './router';

// Add Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

// Add your custom CSS
import './assets/main.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(createBootstrap()); // Initialize Bootstrap Vue Next

app.mount('#app');
