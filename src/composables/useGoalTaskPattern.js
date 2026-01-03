import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { goalTaskPatternAPI } from '@/api/goalTaskPattern.api'
import { computed, ref, unref } from 'vue'


// --------------------------------------------------
// لیست الگوهای تسک برای یک Goal (با جستجو و Pagination)
// --------------------------------------------------
export function useGoalTaskPatterns(goalId = ref(null), search = ref('')) {
    const queryKey = computed(() => [
        'goalTaskPatterns',
        {
            goal: unref(goalId),
            search: unref(search),
        }
    ])

    const queryFn = () =>
        goalTaskPatternAPI.fetchGoalTaskPatterns({
            goal: unref(goalId),
            search: unref(search),
        })

    const result = useQuery({
        queryKey,
        queryFn,
        enabled: computed(() => !!unref(goalId)),
        select: (res) => res.data.results,
    })

    return {
        ...result,
        goalId,
        search,
    }
}


// --------------------------
// جزئیات یک GoalTaskPattern
// --------------------------
export function useGoalTaskPatternDetail(id = ref(null)) {
    const result = useQuery({
        queryKey: computed(() => ['goalTaskPatternDetail', unref(id)]),
        queryFn: async () => {
            if (!unref(id)) return null
            const res = await goalTaskPatternAPI.getGoalTaskPattern(unref(id))
            return res.data
        },
        enabled: computed(() => !!unref(id)),
    })

    return { ...result, id }
}


// --------------------------
// ایجاد ارتباط Goal ↔ Pattern
// --------------------------
export function useCreateGoalTaskPattern() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload) =>
            goalTaskPatternAPI.addGoalTaskPattern(payload),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goalTaskPatterns'] })
        },
    })
}


// --------------------------
// بروزرسانی (PUT / PATCH)
// --------------------------
export function useUpdateGoalTaskPattern() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, updates }) =>
            goalTaskPatternAPI.updateGoalTaskPattern(id, updates),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goalTaskPatterns'] })
        },
    })
}


// --------------------------
// حذف Pattern از Goal
// --------------------------
export function useDeleteGoalTaskPattern() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id) =>
            goalTaskPatternAPI.deleteGoalTaskPattern(id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goalTaskPatterns'] })
        },
    })
}
