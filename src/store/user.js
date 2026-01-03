import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useProfile } from '@/composables/useProfile'

export const useUserStore = defineStore('user', () => {
    const profile = ref(null)

    // گرفتن دیتا از vue-query
    const {
        data,
        isLoading,
        isError,
    } = useProfile()

    // هر وقت کوئری آپدیت شد → استور هم آپدیت شود
    watch(
        data,
        (val) => {
            if (val) profile.value = val
        },
        { immediate: true }
    )

    const fullName = computed(() => profile.value?.full_name)
    const username = computed(() => profile.value?.username)
    const avatar = computed(() => profile.value?.avatar)

    return {
        profile,
        fullName,
        username,
        avatar,
        isLoading,
        isError,
    }
})
