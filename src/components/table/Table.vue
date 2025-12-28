<!-- src/components/table/Table.vue -->
<template>
  <div class="table-container">
    <DataTable
        dir="rtl"
        class="rtl-datatable"
        v-model:selection="selectedRows"
        :value="data"
        paginator
        :rows="rowsPerPage"
        :rowsPerPageOptions="[5, 10, 20, 50, 100]"
        :filters="filters"
        :globalFilterFields="globalFilterFields"
        dataKey="id"
        selectionMode="multiple"
        filterDisplay="menu"
        responsiveLayout="scroll"
        :loading="loading"
        removableSort
    >
      <!-- ستون انتخاب چندگانه -->
      <Column selectionMode="multiple" headerStyle="width: 3rem; text-align: center" />

      <!-- ستون‌های دینامیک -->
      <Column
          v-for="col in visibleColumns"
          :key="col.field"
          :field="col.field"
          :header="col.header"
          :sortable="col.sortable ?? true"
          :filterField="col.filterField || col.field"
          :style="col.style"
      >
        <!-- فیلتر ستونی -->
        <template v-if="col.filterable !== false" #filter="{ filterModel, filterCallback }">
          <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              class="p-column-filter"
              :placeholder="`جستجو در ${col.header}`"
          />
        </template>

        <!-- محتوای سلول (اسلات سفارشی یا پیش‌فرض) -->
        <template #body="slotProps">
          <slot
              :name="`body.${col.field}`"
              :row="slotProps.data"
              :value="slotProps.data[col.field]"
          >
            <span class="cell-text">
              {{ formatCellValue(slotProps.data[col.field]) }}
            </span>
          </slot>
        </template>
      </Column>

      <!-- ستون عملیات (اختیاری) -->
      <Column v-if="hasActions" header="عملیات" headerStyle="width: 10rem; text-align: center">
        <template #body="slotProps">
          <div class="actions-cell">
            <!-- دکمه مشاهده -->
            <Button
                v-if="showAction('view')"
                icon="pi pi-eye"
                class="p-button-rounded p-button-info p-button-text"
                @click="emit('view', slotProps.data)"
                v-tooltip.left="'مشاهده'"
            />

            <!-- دکمه ویرایش -->
            <Button
                v-if="showAction('edit')"
                icon="pi pi-pencil"
                class="p-button-rounded p-button-warning p-button-text"
                @click="emit('edit', slotProps.data)"
                v-tooltip.left="'ویرایش'"
            />

            <!-- دکمه حذف -->
            <Button
                v-if="showAction('delete')"
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger p-button-text"
                @click="emit('delete', slotProps.data)"
                v-tooltip.left="'حذف'"
            />

            <!-- اسلات عملیات سفارشی -->
            <slot name="actions" :row="slotProps.data"></slot>
          </div>
        </template>
      </Column>

      <!-- هدر جدول با عنوان و اکشن‌ها -->
      <template #header>
        <div class="datatable-header">
          <div class="title-section">
            <h3 class="title">{{ title }}</h3>
            <span v-if="selectedRows.length" class="selected-count">
              {{ toPersian(selectedRows.length) }} ردیف انتخاب شده
            </span>
          </div>

          <div class="header-actions">
            <!-- جستجوی کلی -->
            <IconField iconPosition="left" class="search-box">
              <InputIcon><i class="pi pi-search" /></InputIcon>
              <InputText
                  v-model="filters.global.value"
                  placeholder="جستجوی کلی..."
                  class="global-search"
              />
            </IconField>

            <!-- دکمه افزودن جدید -->
            <Button
                label="افزودن جدید"
                icon="pi pi-plus"
                class="p-button-success p-button-sm"
                @click="emit('open-create-modal')"
            />
          </div>
        </div>
      </template>

      <!-- حالت خالی -->
      <template #empty>
        <div class="empty-state">
          <i class="pi pi-inbox" style="font-size: 2.5rem; color: #94a3b8"></i>
          <p>داده‌ای یافت نشد</p>
        </div>
      </template>

      <!-- لودینگ -->
      <template #loading>
        <div class="loading-state">
          <ProgressSpinner style="width: 50px; height: 50px" />
          <p>در حال بارگذاری...</p>
        </div>
      </template>
    </DataTable>

    <!-- اسلات برای مودال‌ها (افزودن / ویرایش) -->
    <slot name="modal"></slot>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import ProgressSpinner from 'primevue/progressspinner'
import Tooltip from 'primevue/tooltip'

const props = defineProps({
  data: { type: Array, required: true, default: () => [] },
  columns: { type: Array, required: true },
  title: { type: String, default: 'جدول داده‌ها' },
  globalFilterFields: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  actions: {
    type: Array,
    default: () => ['view', 'edit', 'delete'],
    validator: (val) => ['view', 'edit', 'delete', 'none'].some(v => val.includes(v))
  }
})

const emit = defineEmits([
  'selectionChange',
  'open-create-modal',
  'view',
  'edit',
  'delete'
])

// ردیف‌های انتخاب شده
const selectedRows = ref([])
watch(selectedRows, (val) => emit('selectionChange', val), { deep: true })

// فیلترها
const filters = ref({
  global: { value: null, matchMode: 'contains' }
})

const rowsPerPage = ref(10)

// آیا ستون عملیات وجود دارد؟
const hasActions = computed(() => {
  return props.actions.length > 0 && !props.actions.includes('none')
})

const showAction = (action) => {
  return props.actions.includes(action)
}

// ستون‌های قابل نمایش (بدون ستون‌های مخفی اگر لازم بود)
const visibleColumns = computed(() => {
  return props.columns.filter(col => col.hidden !== true)
})

// تبدیل اعداد به فارسی
const toPersian = (val) => {
  if (val === null || val === undefined) return '—'
  return val.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d])
}

// فرمت کردن مقدار سلول (تاریخ، عدد، متن)
const formatCellValue = (value) => {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'boolean') return value ? 'بله' : 'خیر'
  return toPersian(value)
}


</script>

<style scoped>
.table-container {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.datatable-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1.5rem 1.5rem 1rem;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.selected-count {
  font-size: 0.9rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  width: 20rem;
}

.global-search {
  width: 100%;
}

.actions-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.empty-state,
.loading-state {
  padding: 3rem;
  text-align: center;
  color: #64748b;
}

.empty-state i,
.loading-state p {
  margin-top: 1rem;
}

/* استایل‌های RTL و PrimeVue */
:deep(.rtl-datatable) {
  direction: rtl;
  font-family: "Vazirmatn", sans-serif;
}

:deep(.rtl-datatable .p-datatable-thead th) {
  text-align: right !important;
  background: linear-gradient(to left, #f8fafc, #eef2f7);
  font-weight: 700;
  border-bottom: 1px solid #e2e8f0;
}

:deep(.rtl-datatable .p-datatable-tbody td) {
  text-align: right !important;
  padding: 1rem;
}

:deep(.cell-text) {
  display: block;
  direction: rtl;
}

:deep(.p-column-filter),
:deep(.p-inputtext) {
  text-align: right;
  direction: rtl;
  border-radius: 999px;
  font-size: 0.85rem;
}

:deep(.p-paginator) {
  direction: ltr;
  justify-content: center;
}

:deep(.p-button.p-button-sm) {
  font-size: 0.85rem;
}
.table-container {
  overflow-x: auto; /* اسکرول افقی فعال می‌شه وقتی محتوا پهن‌تر باشه */
  -webkit-overflow-scrolling: touch; /* اسکرول نرم‌تر در موبایل (iOS/Android) */
}

:deep(.p-datatable-wrapper) {
  min-width: 600px; /* یا مقداری که حداقل عرض مناسب جدولتون باشه، مثلاً 50rem */
}
</style>