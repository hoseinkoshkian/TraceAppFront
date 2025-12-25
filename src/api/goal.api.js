// src/api/task.api.js
import BaseAPI from './BaseAPI.js'
import { useQuery } from '@/composables/useQuery'
import { useMutation } from '@/composables/useMutation'

class GoalApi extends BaseAPI {
    constructor() {
        super() // ← دیگر نیاز به baseURL نیست، BaseAPI خودش BASE_URL رو می‌گیرد
    }

    fetchGoal() {
        return this.get('/api/v1/calendar/goals') // فقط مسیر endpoint
    }

    addTask(task) {
        return this.post('/api/v1/calendar/tasks/create/', task)
    }

    updateTask(id, updates) {
        return this.patch(`/api/v1/calendar/tasks/${id}/update/`, updates)
    }

    deleteTask(id) {
        return this.delete(`/tasks/${id}`)
    }
}

export const goalApi = new GoalApi()

export function useGoals() {
    return useQuery('goals', () => goalApi.fetchGoal(), { staleTime: 1000 * 60 })
}


export function useUpdateTask() {
    return useMutation(
        ({ id, updates }) => goalApi.updateTask(id, updates),
        { invalidate: ['tasks'] }
    )
}

export function useAddTask() {
    return useMutation(
        (task) => goalApi.addTask(task),
        {
            invalidate: ['tasks']
        }
    )
}