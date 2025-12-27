// src/composables/useGoals.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { goalApi } from '@/api/goal.api'
import {computed} from "vue";
import { ref, watch, unref } from 'vue'
export function useGoals(search = ref('')) {
    const queryKey = computed(() => ['goals', { search: unref(search) }])
    const queryFn = () => goalApi.fetchGoals({ search: unref(search) })

    const result = useQuery({
        queryKey,
        queryFn,
        enabled: computed(() => true),
        select: (res) => res.data.results // ← فقط آرایه نتایج
    })

    return { ...result, search }
}
export function useCreateGoal() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (goal) => goalApi.createGoal(goal),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals'] })
        }
    })
}

export function useUpdateGoal() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, updates }) => goalApi.updateGoal(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals'] })
        }
    })
}

export function useDeleteGoal() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id) => goalApi.deleteGoal(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals'] })
        }
    })
}