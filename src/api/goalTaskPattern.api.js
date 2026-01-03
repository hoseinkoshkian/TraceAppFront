import BaseAPI from './baseApi.js'

class GoalTaskPatternAPI extends BaseAPI {
    constructor() {
        super()
    }

    // ----------------------------
    // لیست الگوهای تسک هدف
    // params:
    //  - goal: uuid هدف
    //  - search: جستجو روی نام الگو
    //  - page, page_size
    // ----------------------------
    fetchGoalTaskPatterns(params = {}) {
        return this.get('/api/v1/calendar/goal-task-patterns/', { params })
    }

    // ----------------------------
    // اضافه کردن Pattern به Goal
    // payload:
    // {
    //   goal: uuid,
    //   pattern: uuid,
    //   active: true
    // }
    // ----------------------------
    addGoalTaskPattern(payload) {
        return this.post(
            '/api/v1/calendar/goal-task-patterns/create/',
            payload
        )
    }

    // ----------------------------
    // بروزرسانی (active یا pattern)
    // ----------------------------
    updateGoalTaskPattern(id, updates) {
        return this.patch(
            `/api/v1/calendar/goal-task-patterns/${id}/update/`,
            updates
        )
    }

    // ----------------------------
    // حذف Pattern از Goal
    // ----------------------------
    deleteGoalTaskPattern(id) {
        return this.delete(
            `/api/v1/calendar/goal-task-patterns/${id}/delete/`
        )
    }

    // ----------------------------
    // گرفتن جزئیات یک رکورد
    // ----------------------------
    getGoalTaskPattern(id) {
        return this.get(
            `/api/v1/calendar/goal-task-patterns/${id}/`
        )
    }
}

export const goalTaskPatternAPI = new GoalTaskPatternAPI()
