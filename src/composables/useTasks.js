// src/composables/useTask.js
import { useQuery } from '@/composables/useQuery'
import { useMutation } from '@/composables/useMutation'
import { taskAPI } from '@/api/task.api'

// دریافت لیست تسک‌ها
export function useTasks(params = {}) {
    return useQuery(
        ['tasks', params],
        () => taskAPI.fetchTasks(params),
        {
            staleTime: 1000 * 60, // 1 دقیقه
        }
    )
}

// افزودن تسک
export function useAddTask() {
    return useMutation(
        (task) => taskAPI.addTask(task),
        {
            invalidate: ['tasks'],
        }
    )
}

// بروزرسانی تسک
export function useUpdateTask() {
    return useMutation(
        ({ id, updates }) => taskAPI.updateTask(id, updates),
        {
            invalidate: ['tasks'],
        }
    )
}

// حذف تسک
export function useDeleteTask() {
    return useMutation(
        (id) => taskAPI.deleteTask(id),
        {
            invalidate: ['tasks'],
        }
    )
}
