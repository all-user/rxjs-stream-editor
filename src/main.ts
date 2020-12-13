import { createApp, h } from 'vue';
import App from './App.vue';
import { store, key } from './store';

const app = createApp({
  render() {
    return h(App);
  },
});

app.use(store, key);
app.mount('#app');
