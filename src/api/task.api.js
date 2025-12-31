// src/api/task.api.js
// --------------------------
// ابتدا BaseAPI را import می‌کنیم
// --------------------------
import BaseAPI from './BaseAPI.js' // فرض بر اینکه BaseAPI default export است
import { useQuery } from '@/composables/useQuery'
import { useMutation } from '@/composables/useMutation'

// --------------------------
// کلاس TaskAPI
// --------------------------
class TaskAPI extends BaseAPI {
    constructor() {
        super() // BaseAPI خودش BASE_URL را می‌گیرد
    }

    // دریافت لیست تسک‌ها با فیلتر (مثلاً year, month)
    fetchTasks(params = {}) {
        return this.get('/api/v1/calendar/tasks/', { params })
    }

    // ایجاد تسک جدید
    addTask(task) {
        return this.post('/api/v1/calendar/tasks/create/', task)
    }

    // بروزرسانی جزئی تسک
    updateTask(id, updates) {
        return this.patch(`/api/v1/calendar/tasks/${id}/update/`, updates)
    }

    // حذف تسک
    deleteTask(id) {
        return this.delete(`/api/v1/calendar/tasks/${id}/delete/`)
    }
}

// --------------------------
// نمونه آماده استفاده
// --------------------------
export const taskAPI = new TaskAPI()

// --------------------------
// composableها برای Vue Query
// --------------------------

// دریافت لیست تسک‌ها
export function useTasks(params = {}) {
    return useQuery(
        ['tasks', params],
        () => taskAPI.fetchTasks(params),
        { staleTime: 1000 * 60 } // کش 1 دقیقه
    )
}

// افزودن تسک جدید
export function useAddTask() {
    return useMutation(
        (task) => taskAPI.addTask(task),
        { invalidate: ['tasks'] } // invalidate cache بعد از موفقیت
    )
}

// بروزرسانی تسک
export function useUpdateTask() {
    return useMutation(
        ({ id, updates }) => taskAPI.updateTask(id, updates),
        { invalidate: ['tasks'] }
    )
}

// حذف تسک
export function useDeleteTask() {
    return useMutation(
        (id) => taskAPI.deleteTask(id),
        { invalidate: ['tasks'] }
    )
}
