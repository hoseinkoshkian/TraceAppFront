// src/api/task.api.js
import BaseAPI from './BaseAPI.js'
import { useQuery } from '@/composables/useQuery'
import { useMutation } from '@/composables/useMutation'

class TaskAPI extends BaseAPI {
    constructor() {
        super() // ← دیگر نیاز به baseURL نیست، BaseAPI خودش BASE_URL رو می‌گیرد
    }

    fetchTasks() {
        return this.get('/api/v1/calendar/tasks') // فقط مسیر endpoint
    }

    addTask(task) {
        return this.post('/tasks', task)
    }

    updateTask(id, updates) {
        return this.patch(`/api/v1/calendar/tasks/${id}/update/`, updates)
    }

    deleteTask(id) {
        return this.delete(`/tasks/${id}`)
    }
}

export const taskAPI = new TaskAPI()

export function useTasks() {
    return useQuery('tasks', () => taskAPI.fetchTasks(), { staleTime: 1000 * 60 })
}

export function useAddTask() {
    return useMutation((task) => taskAPI.addTask(task), { invalidate: ['tasks'] })
}

export function useUpdateTask() {
    return useMutation(
        ({ id, updates }) => taskAPI.updateTask(id, updates),
        { invalidate: ['tasks'] }
    )
}