<template>
  <Table
      :data="goalsData"
      :columns="tableColumns"
      title="لیست اهداف"
      :globalFilterFields="['title', 'date']"
      @selectionChange="handleSelection"
  />
</template>

<script setup>
import {computed, ref} from 'vue'
import Table from '@/components/table/Table.vue'
import {useGoals} from "@/api/goal.api.js";
import {utcToJalali} from "../../../utils/date/to_jalali.js";


const { data: goalsDataRaw } = useGoals() // واکشی داده‌ها

// map کردن داده‌ها برای جدول
const goalsData = computed(() => {
  if (!goalsDataRaw.value || !goalsDataRaw.value.data) return []

  return goalsDataRaw.value.data.results.map(goal => ({
    id: goal.id,
    title: goal.title,
    date: utcToJalali(goal.start_datetime), // فرمت تاریخ قابل نمایش
    description: goal.description
  }))
})
console.log(goalsData)
const tableColumns = [
  { field: 'title', header: 'عنوان', sortable: true, filterable: true },
  { field: 'date', header: 'تاریخ', sortable: true, filterable: true },
  { field: 'description', header: 'توضیحات', sortable: false, filterable: false }
]
const handleSelection = (selectedRows) => {
  console.log('ردیف‌های انتخاب‌شده:', selectedRows)
}
</script>
