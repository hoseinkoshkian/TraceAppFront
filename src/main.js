import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/saga-blue/theme.css'  // تم دلخواه
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import './style.css'

createApp(App)
    .use(router)
    .use(PrimeVue)
    .mount('#app')