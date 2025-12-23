// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/Dashboard.vue'
import CalendarView from '../views/Calender.vue'
import Login from "@/views/auth/Login.vue";  // ← اسم فایل رو درست کن!

const routes = [
    {
        path: '/',
        name : 'login' ,
        component: Login,
        meta: {
            title: 'ورود به سیستم',
            layout: 'blank'  // ← این خط جادویی!
        }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: {
            requiresAuth: true,
            title: 'داشبورد | هدف‌من'
        }
    },
    {
        path: '/calendar',
        name: 'Calendar',
        component: CalendarView,
        meta: {
            title: 'تقویم | هدف‌من',
            layout: 'blank'  // ← این خط جادویی!
        }
    },
    // {
    //   path: '/login',
    //   name: 'Login',
    //   component: () => import('@/views/Login.vue')
    // },
    {
        path: '/:catchAll(.*)',
        redirect: '/dashboard'
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // ← این بهتره تو Vite
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

// تغییر عنوان صفحه
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'هدف‌من - ایستگاه کنترل اهداف'
    next()
})

// گارد احراز هویت (فعلاً غیرفعال — بعداً فعالش کن)
router.beforeEach((to, from, next) => {
    // const isLoggedIn = localStorage.getItem('access_token') || localStorage.getItem('isLoggedIn') === 'true'
    // if (to.meta.requiresAuth && !isLoggedIn) {
    //   return next('/login')
    // }
    next() // فعلاً همه جا اجازه بده
})

export default router