// src/api/task.api.js
import BaseAPI from './baseApi.js'

class TaskAPI extends BaseAPI {
    constructor() {
        super()
    }

    fetchTasks(params = {}) {
        return this.get('/api/v1/calendar/tasks/', { params })
    }

    addTask(task) {
        return this.post('/api/v1/calendar/tasks/create/', task)
    }

    updateTask(id, updates) {
        return this.patch(`/api/v1/calendar/tasks/${id}/update/`, updates)
    }

    deleteTask(id) {
        return this.delete(`/api/v1/calendar/tasks/${id}/delete/`)
    }
}

export const taskAPI = new TaskAPI()
