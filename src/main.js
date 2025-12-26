import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'  // تم مدرن و زیبا، RTL-friendly
// import Lara from '@primevue/themes/lara'  // گزینه دیگه

import 'primeicons/primeicons.css'

import './style.css'

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura ,
        options: {
            darkModeSelector: 'none'  
        }
    }
})

app.mount('#app')