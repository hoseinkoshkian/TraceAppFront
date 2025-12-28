import { inject } from 'vue'

export function useToast() {
    const toast = inject('toast')

    const showSuccess = (msg) => {
        toast?.value.add({ severity: 'success', summary: 'موفق', detail: msg, life: 3000 })
    }

    const showError = (msg) => {
        toast?.value.add({ severity: 'error', summary: 'خطا', detail: msg, life: 3000 })
    }

    const showInfo = (msg) => {
        toast?.value.add({ severity: 'info', summary: 'اطلاع', detail: msg, life: 3000 })
    }

    return { showSuccess, showError, showInfo }
}
