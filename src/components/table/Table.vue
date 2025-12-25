<template>
  <DataTable
      dir="rtl"
      class="rtl-datatable"
      v-model:selection="selectedRows"
      :value="data"
      paginator
      :rows="rowsPerPage"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      :filters="filters"
      :globalFilterFields="globalFilterFields"
      dataKey="id"
      selectionMode="multiple"
      filterDisplay="menu"
      :sortField="sortField"
      :sortOrder="sortOrder"
      responsiveLayout="scroll"
      @sort="onSort"
      @page="onPage"
  >

    <!-- ستون انتخاب -->
    <Column selectionMode="multiple" headerStyle="width:3rem" />

    <!-- ستون‌ها -->
    <Column
        v-for="col in columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :sortable="col.sortable ?? true"
        :filterField="col.filterField || col.field"
    >
      <!-- فیلتر -->
      <template v-if="col.filterable" #filter="{ filterModel }">
        <InputText
            v-model="filterModel.value"
            :placeholder="`جستجو در ${col.header}`"
            class="p-column-filter"
        />
      </template>

      <!-- بدنه -->
      <template #body="{ data }">
        <span class="cell-text">
          {{ toPersian(data[col.field]) }}
        </span>
      </template>
    </Column>

    <!-- هدر -->
    <template #header>
      <div class="datatable-header">
        <span class="title">{{ title }}</span>

        <IconField iconPosition="left" class="search-box">
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText
              v-model="filters.global.value"
              placeholder="جستجوی کلی..."
          />
        </IconField>
      </div>
    </template>

    <!-- خالی -->
    <template #empty>
      <div class="empty">داده‌ای یافت نشد</div>
    </template>

  </DataTable>

  <!-- انتخاب شده‌ها -->
  <div v-if="selectedRows.length" class="selected-box">
    <i class="pi pi-check-circle"></i>
    {{ toPersian(selectedRows.length) }} ردیف انتخاب شده
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

const props = defineProps({
  data: { type: Array, required: true },
  columns: { type: Array, required: true },
  title: { type: String, default: 'جدول داده‌ها' },
  globalFilterFields: { type: Array, default: () => [] }
})

const emit = defineEmits(['selectionChange'])

const selectedRows = ref([])
watch(selectedRows, v => emit('selectionChange', v), { deep: true })

const filters = ref({
  global: { value: null, matchMode: 'contains' }
})

const rowsPerPage = ref(10)
const onPage = e => rowsPerPage.value = e.rows

const sortField = ref(null)
const sortOrder = ref(1)
const onSort = e => {
  sortField.value = e.sortField
  sortOrder.value = e.sortOrder
}

/* عدد فارسی */
const toPersian = val => {
  if (val === null || val === undefined) return '—'
  return val.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d])
}
</script>

<style scoped>

/* پایه RTL */
:deep(.rtl-datatable) {
  direction: rtl;
  font-family: "Vazirmatn", sans-serif;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 12px 30px rgba(0,0,0,.06);
  overflow: hidden;
}

/* هدر بالای جدول */
.datatable-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #334155;
}

.search-box {
  width: 18rem;
}

/* تیتر ستون */
:deep(.rtl-datatable .p-datatable-thead th) {
  text-align: right !important;
  background: linear-gradient(to left, #f8fafc, #eef2f7);
  font-weight: 700;
  font-size: .85rem;
  border: none;
}

/* سلول td */
:deep(.rtl-datatable .p-datatable-tbody td) {
  text-align: right !important;
  padding: .85rem 1rem;
  border-color: #f1f5f9;
}

/* 🔥 متن واقعی داخل سلول */
:deep(.rtl-datatable .p-datatable-body-cell-content) {
  text-align: right !important;
  direction: rtl;
  width: 100%;
}

/* متن سفارشی */
:deep(.cell-text) {
  display: block;
  text-align: right;
  direction: rtl;
}

/* فیلتر ستون */
:deep(.rtl-datatable .p-column-filter),
:deep(.rtl-datatable .p-inputtext) {
  text-align: right;
  direction: rtl;
  border-radius: 999px;
  font-size: .8rem;
}

/* ردیف */
:deep(.rtl-datatable .p-datatable-tbody tr:hover) {
  background: #f8fafc;
}

/* چک‌باکس */
:deep(.rtl-datatable .p-selection-column) {
  text-align: center !important;
}

:deep(.rtl-datatable .p-checkbox-box.p-highlight) {
  background: #2563eb;
  border-color: #2563eb;
}

/* paginator */
:deep(.rtl-datatable .p-paginator) {
  direction: ltr;
  border: none;
  padding: 1rem;
}

:deep(.rtl-datatable .p-paginator .p-highlight) {
  background: #2563eb;
  color: #fff;
  border-radius: 8px;
}

/* empty */
.empty {
  padding: 2rem;
  text-align: center;
  color: #64748b;
}

/* انتخاب شده */
.selected-box {
  margin-top: 1rem;
  padding: .75rem 1rem;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  color: #3730a3;
  border-radius: .75rem;
  display: flex;
  align-items: center;
  gap: .4rem;
  font-size: .85rem;
}
:deep(.rtl-datatable .p-sortable-column) {
  direction: rtl;
}

:deep(.rtl-datatable .p-sortable-column .p-sortable-column-icon) {
  margin-right: .5rem;
  margin-left: 0;
}
</style>
