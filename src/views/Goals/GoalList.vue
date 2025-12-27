<!-- src/views/GoalList.vue یا هر مسیر دیگه -->
<template>
  <div class="goal-list-page">
    <Table
        :data="goalsData"
        :columns="tableColumns"
        title="لیست اهداف"
        :globalFilterFields="['title', 'date', 'description']"
        :loading="loading"
        :actions="['view', 'edit', 'delete']"
        @selectionChange="handleSelection"
        @open-create-modal="showCreateModal = true"
        @view="viewGoal"
        @edit="openEditModal"
        @delete="confirmDelete"
    >
      <!-- اسلات مودال‌ها -->
      <template #modal>
        <!-- مودال افزودن هدف جدید -->
        <Dialog
            v-model:visible="showCreateModal"
            header="افزودن هدف جدید"
            :modal="true"
            :closable="true"
            :style="{ width: '50vw' }"
            :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
            @hide="onCreateModalHide"
        >
          <GoalForm
              @success="onGoalCreated"
              @cancel="showCreateModal = false"
          />
        </Dialog>

        <!-- مودال ویرایش هدف -->
        <Dialog
            v-model:visible="showEditModal"
            header="ویرایش هدف"
            :modal="true"
            :closable="true"
            :style="{ width: '50vw' }"
            :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
            @hide="onEditModalHide"
        >
          <GoalForm
              :initial-data="selectedGoal"
              @success="onGoalCreated"
              @cancel="showEditModal = false"
          />
        </Dialog>
      </template>
    </Table>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import Table from '@/components/table/Table.vue'
import Dialog from 'primevue/dialog'
import GoalForm from '@/components/goal/GoalForm.vue'

import {utcToJalali} from "../../../utils/date/to_jalali.js";
import {useGoals} from "@/composables/useGoal.js";


// واکشی داده‌های اهداف
const { data: goalsDataRaw, isLoading: loading, refetch } = useGoals()

// تبدیل داده‌ها برای جدول
const goalsData = computed(() => {
  if (!goalsDataRaw.value) return []

  return goalsDataRaw.value.map(goal => ({
    id: goal.id,
    title: goal.title || 'بدون عنوان',
    dateForTable: utcToJalali(goal.start_datetime),
    date: utcToJalali(goal.start_datetime),
    description: goal.description || '—'
  }))
})

// ستون‌های جدول
const tableColumns = [
  { field: 'title', header: 'عنوان', sortable: true, filterable: true },
  { field: 'date', header: 'تاریخ', sortable: true, filterable: true },
  { field: 'description', header: 'توضیحات', sortable: true, filterable: true }
]

// مدیریت مودال‌ها
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedGoal = ref(null)

// وقتی مودال ایجاد بسته شد
const onCreateModalHide = () => {
  showCreateModal.value = false
}

// وقتی مودال ویرایش بسته شد
const onEditModalHide = () => {
  showEditModal.value = false
  selectedGoal.value = null // مهم: پاک کردن داده قبلی
}

// بعد از موفقیت در ایجاد یا ویرایش
const onGoalCreated = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedGoal.value = null
  refetch() // بروزرسانی لیست از سرور
}

// باز کردن مودال ویرایش
const openEditModal = (goal) => {
  selectedGoal.value = { ...goal } // کپی برای جلوگیری از تغییر مستقیم
  showEditModal.value = true
}

// حذف هدف
const confirmDelete = (goal) => {
  if (confirm(`آیا از حذف هدف "${goal.title}" اطمینان دارید؟`)) {
    // اینجا باید API حذف رو فراخوانی کنی
    // مثال: await deleteGoal(goal.id)
    alert('هدف با موفقیت حذف شد (API رو پیاده کن)')
    refetch()
  }
}

// مشاهده هدف
const viewGoal = (goal) => {
  alert(`مشاهده جزئیات هدف:\n\nعنوان: ${goal.title}\nتاریخ: ${goal.date}\nتوضیحات: ${goal.description}`)
  console.log('جزئیات هدف:', goal)
}

// انتخاب چندگانه
const handleSelection = (selectedRows) => {
  console.log('ردیف‌های انتخاب شده:', selectedRows)
}
</script>

<style scoped>
.goal-list-page {
  padding: 1.5rem;
  min-height: 100vh;
  background: #f9fafb;
}
</style>