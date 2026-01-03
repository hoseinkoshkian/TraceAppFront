import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'  // تم مدرن و زیبا، RTL-friendly
// import Lara from '@primevue/themes/lara'  // گزینه دیگه

import 'primeicons/primeicons.css'

import './style.css'
import { VueQueryPlugin } from '@tanstack/vue-query'
const app = createApp(App)
import {createPinia} from "pinia";


import Vue3PersianDatetimePicker from 'vue3-persian-datetime-picker'
import {useAuthStore} from "@/store/auth.js";
const pinia = createPinia()



app.use(router)
app.use(pinia)
app.use(PrimeVue, {
    theme: {
        preset: Aura ,
        options: {
            darkModeSelector: 'none'  
        }
    }
})
app.use(VueQueryPlugin, {
    queryClientConfig: {
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60,        // 1 دقیقه
                cacheTime: 1000 * 60 * 5,     // 5 دقیقه
                retry: 1,
                refetchOnWindowFocus: false,
            },
        },
    },
})
app.component('PersianDatePicker', Vue3PersianDatetimePicker)
const auth = useAuthStore(pinia)

auth.init()
app.mount('#app')