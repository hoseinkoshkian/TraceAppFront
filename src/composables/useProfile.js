// src/composables/useProfile.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { profileApi } from '@/api/profile.api'
import { computed } from 'vue'

/* =======================
   دریافت پروفایل
======================= */
export function useProfile() {
    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await profileApi.getProfile()

            // اگر interceptor داری → این خط درست است
            return res.data
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
    })
}
/* =======================
   بروزرسانی کامل (PUT)
======================= */
export function useUpdateProfile() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data) => profileApi.updateProfile(data),
        onSuccess: (res) => {
            if (res?.data?.status) {
                queryClient.setQueryData(['profile'], res.data.data)
            }
        },
    })
}

/* =======================
   بروزرسانی جزئی (PATCH)
======================= */
export function usePartialUpdateProfile() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data) => profileApi.partialUpdateProfile(data),
        onSuccess: (res) => {
            if (res?.data?.status) {
                queryClient.setQueryData(['profile'], res.data.data)
            }
        },
    })
}

/* =======================
   حذف پروفایل
======================= */
export function useDeleteProfile() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => profileApi.deleteProfile(),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['profile'] })
        },
    })
}
