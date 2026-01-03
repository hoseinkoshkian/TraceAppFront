// src/api/taskPattern.api.js
import BaseAPI from './BaseAPI.js'

class TaskPatternApi extends BaseAPI {
    fetchTaskPatterns(params = {}) {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v != null && v !== '')
        )
        return this.get('/api/v1/calendar/task-patterns/', { params: cleanParams })
    }
    fetchTaskPatternsType() {

        return this.get('/api/v1/calendar/task-patterns/type')
    }

    createTaskPattern(pattern) {
        return this.post('/api/v1/calendar/task-patterns/create/', pattern)
    }

    fetchTaskPatternDetail(id) {
        if (!id) throw new Error('TaskPattern ID is required')
        return this.get(`/api/v1/calendar/task-patterns/${id}/`)
    }

    updateTaskPattern(id, updates) {
        return this.patch(`/api/v1/calendar/task-patterns/${id}/update/`, updates)
    }

    deleteTaskPattern(id) {
        return this.delete(`/api/v1/calendar/task-patterns/${id}/delete/`)
    }
}

export const taskPatternApi = new TaskPatternApi()
