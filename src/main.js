import './assets/main.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import router from '@/router'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-persistedstate-plugin'
import locale from 'element-plus/dist/locale/zh-cn'
const app = createApp(App)
app.use(ElementPlus, { locale })
app.use(router)
app.use(createPinia().use(createPersistedState()))
app.mount('#app')
