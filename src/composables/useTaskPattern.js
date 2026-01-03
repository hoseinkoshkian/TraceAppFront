// src/composables/useTaskPatterns.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { taskPatternApi } from '@/api/taskPattern.api'
import { computed, ref, unref } from 'vue'

export function useTaskPatterns(search = ref('')) {
    const queryKey = computed(() => ['taskPatterns', { search: unref(search) }])
    const queryFn = () => taskPatternApi.fetchTaskPatterns({ search: unref(search) })

    const result = useQuery({
        queryKey,
        queryFn,
        enabled: computed(() => true),
        select: (res) => res.data.results // ← فقط آرایه نتایج
    })

    return { ...result, search }
}

export function useTaskPatternDetail(id = ref(null)) {
    const result = useQuery({
        queryKey: computed(() => ['taskPatternDetail', unref(id)]),
        queryFn: async () => {
            if (!unref(id)) return null
            const res = await taskPatternApi.fetchTaskPatternDetail(unref(id))
            return res.data
        },
        enabled: computed(() => !!unref(id)),
    })

    return { ...result, id }
}

export function useCreateTaskPattern() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (pattern) => taskPatternApi.createTaskPattern(pattern),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['taskPatterns'] })
        }
    })
}

export function useUpdateTaskPattern() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, updates }) => taskPatternApi.updateTaskPattern(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['taskPatterns'] })
        }
    })
}

export function useDeleteTaskPattern() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id) => taskPatternApi.deleteTaskPattern(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['taskPatterns'] })
        }
    })
}


export function useTaskPatternTypes() {
    const queryKey = ['taskPatternTypes']
    const queryFn = () => taskPatternApi.fetchTaskPatternsType()

    const result = useQuery({
        queryKey,
        queryFn,
        enabled: true,
        select: (res) => res.data // [{value, label}, ...]
    })

    return result
}