// src/api/goal.api.js
import BaseAPI from './BaseAPI.js'

class GoalApi extends BaseAPI {
    fetchGoals(params = {}) {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v != null && v !== '')
        )
        return this.get('/api/v1/calendar/goals/', { params: cleanParams })
    }

    createGoal(goal) {
        return this.post('/api/v1/calendar/goals/create/', goal)
    }

    updateGoal(id, updates) {
        return this.patch(`/api/v1/calendar/goals/${id}/update/`, updates)
    }

    deleteGoal(id) {
        return this.delete(`/api/v1/calendar/goals/${id}/`)
    }
}

export const goalApi = new GoalApi()