<template>
  <Table
      :data="tableData"
      :columns="tableColumns"
      title="لیست تسک‌ها"
      :globalFilterFields="['title', 'date']"
      @selectionChange="handleSelection"
  />
</template>

<script setup>
import { ref } from 'vue'
import Table from '@/components/table/Table.vue'

const tableData = ref([
  {id: 1, title: 'تسک ۱', date: '۱۴۰۲/۱۰/۰۱'},
  {id: 2, title: 'تسک ۲', date: '۱۴۰۲/۱۰/۰۲'},
])

const tableColumns = [
  {
    field: 'title',
    header: 'عنوان',
    sortable: true,
    filterable: true
  },
  {
    field: 'date',
    header: 'تاریخ',
    sortable: true,
    filterable: true
  }
]

const handleSelection = (selectedRows) => {
  console.log('ردیف‌های انتخاب‌شده:', selectedRows)
}
</script>
