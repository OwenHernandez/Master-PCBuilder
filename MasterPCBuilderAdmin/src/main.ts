import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Asegúrate de que esta ruta sea correcta
import vuetify from './plugins/vuetify'; // Si estás usando Vuetify como un plugin

const app = createApp(App);

app.use(router);
app.use(vuetify);

app.mount('#app');
