import './styles/main.scss'
import './assets/fonts/fonts.scss'
// https://github.com/KingSora/OverlayScrollbars/blob/master/packages/overlayscrollbars-vue/README.md#usage
import 'overlayscrollbars/overlayscrollbars.css'
// Customize scrollbar styles
import './styles/components/os-scroll.css'
// OverlayScrollbars plugins
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import router from './router'
import App from './App.vue'

import i18n from '@/includes/i18n'

// https://github.com/KingSora/OverlayScrollbars?tab=readme-ov-file#consuming-plugins
OverlayScrollbars.plugin(ClickScrollPlugin)

const app = createApp(App)

app.use(i18n)
app.use(createPinia())
app.use(router)

app.mount('#app')
