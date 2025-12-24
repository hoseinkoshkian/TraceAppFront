<!-- src/views/Calender.vue — نسخه نهایی، شیک، حرفه‌ای و کاملاً ریسپانسیو -->
<template>
  <div class="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100" dir="rtl">

    <!-- هدر اصلی — مینیمال و زیبا -->
    <header class="bg-white/80 backdrop-blur-lg shadow-sm px-5 py-4 sticky top-0 z-50 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-gray-800 tracking-tight">
            {{ currentMonthJalali.format('jMMMM jYYYY') }}
          </h1>
          <button @click="goToday" class="text-blue-600 text-sm font-medium hover:underline">
            امروز
          </button>
        </div>

        <div class="flex items-center gap-3">
          <button @click="prev" class="p-2.5 hover:bg-gray-100 rounded-full transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button @click="next" class="p-2.5 hover:bg-gray-100 rounded-full transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- دکمه‌های ویو — فقط دسکتاپ (≥1024px) -->
      <div class=" lg:flex justify-center gap-4 mt-5">
        <button @click="setView('month')" :class="viewBtnClass('month')">
          ماه
        </button>
        <button @click="setView('week')" :class="viewBtnClass('week')">
          هفته
        </button>
        <button @click="setView('day')" :class="viewBtnClass('day')">
          روز
        </button>
      </div>
    </header>

    <!-- سرستون روزهای هفته — همیشه فیکس -->
    <div class="grid grid-cols-7 bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-16 lg:top-32 z-40 shadow-sm">
      <div v-for="day in weekDays" :key="day" class="text-center py-4 text-sm font-semibold text-gray-700">
        {{ day }}
      </div>
    </div>

    <!-- بدنه تقویم -->
    <main class="flex-1 overflow-y-auto">

      <!-- ویو ماه — موبایل + دسکتاپ -->
      <div v-if="isDesktop ? view === 'month' : true" class="grid grid-cols-7 gap-px bg-gray-200 p-2">
        <div
            v-for="day in daysInMonth"
            :key="day.date"
            @click="openDayDetail(day.dateObj)"
            @dragover.prevent
            @drop.prevent="onDrop($event, day.date)"
            class="bg-white rounded-xl p-3 min-h-28 flex flex-col hover:shadow-md transition-all duration-200 cursor-pointer"
            :class="{
            'ring-2 ring-blue-500 shadow-lg bg-blue-50/50': day.isToday,
            'opacity-60': !day.isCurrentMonth
          }"
        >
          <div class="text-center font-bold text-sm" :class="{ 'text-blue-600': day.isToday }">
            {{ day.day }}
          </div>

          <div class="flex-1 mt-2 space-y-1.5 text-xs">
            <div
                v-for="task in (tasksByDate[day.date] || []).slice(0, 4)"
                :key="task.id"
                draggable="true"
                class="flex items-center gap-2 p-1.5 bg-blue-50 border border-blue-200 rounded-lg cursor-move select-none"
                :class="{ 'opacity-50 line-through': task.completed }"
                @dragstart="dragStart($event, task.id)"
                @touchstart.prevent="startLongPress(task.id)"
                @touchend.prevent="endLongPress"
                @click.stop
            >
              <div class="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
              <span class="truncate">{{ task.title }}</span>
            </div>
            <div v-if="(tasksByDate[day.date]?.length || 0) > 4" class="text-center text-gray-500 text-xs">
              +{{ tasksByDate[day.date].length - 4 }} مورد دیگر
            </div>
          </div>
        </div>
      </div>

      <!-- ویو هفته — فقط دسکتاپ، خیلی شیک -->
      <div v-else-if="isDesktop && view === 'week'" class="p-6 space-y-8">
        <div v-for="day in weekViewDays" :key="day.date" class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
          <div class="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-5 text-center">
            <div class="text-lg font-semibold">{{ day.dateObj.format('dddd') }}</div>
            <div class="text-3xl font-bold mt-1">{{ day.dateObj.format('jD jMMMM') }}</div>
            <span v-if="day.isToday" class="inline-block mt-2 px-4 py-1 bg-white/25 rounded-full text-sm">امروز</span>
          </div>

          <div class="p-6" @dragover.prevent @drop.prevent="onDrop($event, day.date)">
            <div class="space-y-3">
              <div
                  v-for="task in tasksByDate[day.date] || []"
                  :key="task.id"
                  draggable="true"
                  class="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition cursor-move"
                  :class="{ 'opacity-60 line-through': task.completed }"
                  @dragstart="dragStart($event, task.id)"
                  @touchstart.prevent="startLongPress(task.id)"
                  @touchend.prevent="endLongPress"
                  @click.stop="toggleTask(task.id)"
              >
                <input type="checkbox" :checked="task.completed" readonly class="w-5 h-5 rounded text-blue-600" />
                <div class="flex-1">
                  <div class="font-medium text-gray-800">{{ task.title }}</div>
                  <div v-if="task.time" class="text-sm text-gray-500 mt-1">{{ task.time }}</div>
                </div>
              </div>
              <p v-if="!tasksByDate[day.date]?.length" class="text-center text-gray-400 py-12 text-lg">
                هیچ برنامه‌ای ثبت نشده
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ویو روز — فقط دسکتاپ، فوق‌العاده شیک -->
      <div v-else-if="isDesktop && view === 'day'" class="p-8">
        <div class="max-w-3xl mx-auto">
          <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-600 to-blue-700 text-white p-10 text-center">
              <div class="text-2xl font-bold">{{ j().format('dddd') }}</div>
              <div class="text-6xl font-extrabold mt-3">{{ j().format('jD') }}</div>
              <div class="text-2xl mt-2">{{ j().format('jMMMM jYYYY') }}</div>
            </div>

            <div class="p-8" @dragover.prevent @drop.prevent="onDrop($event, j().format('jYYYY-jMM-jDD'))">
              <div class="space-y-5">
                <div
                    v-for="task in tasksByDate[j().format('jYYYY-jMM-jDD')] || []"
                    :key="task.id"
                    draggable="true"
                    class="flex items-center gap-5 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover:shadow-lg transition cursor-move"
                    :class="{ 'opacity-60 line-through': task.completed }"
                    @dragstart="dragStart($event, task.id)"
                    @click.stop="toggleTask(task.id)"
                >
                  <input type="checkbox" :checked="task.completed" readonly class="w-6 h-6 rounded text-blue-600" />
                  <div class="flex-1">
                    <div class="text-xl font-semibold text-gray-800">{{ task.title }}</div>
                    <div v-if="task.time" class="text-lg text-gray-600 mt-1">{{ task.time }}</div>
                  </div>
                </div>
                <p v-if="!tasksByDate[j().format('jYYYY-jMM-jDD')]?.length" class="text-center text-gray-400 py-24 text-2xl font-light">
                  امروز برنامه‌ای ندارید
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- دکمه افزودن -->
    <button @click="showAddModal = true"
            class="fixed bottom-6 left-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl font-light transition z-50">
      +
    </button>

    <!-- مودال‌ها (همون قبلی — فقط کمی شیک‌تر شده) -->
    <Transition name="modal">
      <div v-if="showAddModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showAddModal = false">
        <div @click.stop class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <h3 class="text-2xl font-bold text-center mb-8 text-gray-800">برنامه جدید</h3>
          <input v-model="newTask.title" placeholder="عنوان برنامه" class="w-full border border-gray-300 rounded-xl px-5 py-4 mb-5 text-lg focus:ring-4 focus:ring-blue-300 outline-none" />
          <input v-model="newTask.time" type="time" class="w-full border border-gray-300 rounded-xl px-5 py-4 mb-8 text-lg focus:ring-4 focus:ring-blue-300 outline-none" />
          <div class="flex gap-4">
            <button @click="addTask" class="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition">اضافه کن</button>
            <button @click="showAddModal = false" class="flex-1 bg-gray-200 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition">لغو</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="selectedDayDetail" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="selectedDayDetail = null">
        <div @click.stop class="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          <div class="bg-gradient-to-r from-indigo-600 to-blue-700 text-white p-8 text-center">
            <h2 class="text-3xl font-bold">{{ selectedDayDetail.format('dddd jD jMMMM jYYYY') }}</h2>
          </div>
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <div v-for="task in tasksByDate[selectedDayDetail.format('jYYYY-jMM-jDD')] || []" :key="task.id"
                 @click="toggleTask(task.id)"
                 class="flex items-center gap-5 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover:shadow-md transition cursor-pointer">
              <input type="checkbox" :checked="task.completed" readonly class="w-6 h-6 rounded text-blue-600" />
              <div class="flex-1 text-right">
                <div class="text-xl font-semibold" :class="{ 'line-through text-gray-500': task.completed }">
                  {{ task.title }}
                </div>
                <div v-if="task.time" class="text-lg text-gray-600 mt-2">{{ task.time }}</div>
              </div>
            </div>
            <p v-if="!tasksByDate[selectedDayDetail.format('jYYYY-jMM-jDD')]?.length" class="text-center py-20 text-gray-400 text-2xl">
              هیچ برنامه‌ای ثبت نشده
            </p>
          </div>
          <div class="p-6 border-t bg-gray-50">
            <button @click="openAddModalWithDate(selectedDayDetail)" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-xl hover:bg-blue-700 transition">
              افزودن برنامه جدید
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import jalali from 'jalali-moment'
import {useTasks, useUpdateTask} from "@/api/task.api.js"
import {toJalali} from '../../utils/date/to_jalali.js'
const tasks = ref([])

// واکشی داده‌ها از API
const { data: tasksData, status, error, refetch } = useTasks()

// تبدیل داده‌های API به فرمت داخلی
watch(tasksData, (newVal) => {
  if (newVal?.data?.results) {
    tasks.value = newVal.data.results.map(task => ({
      id: task.id,
      title: task.title,
      date: toJalali(task.start_datetime),           // ✅ شمسی
      time: jalali(task.start_datetime).format('HH:mm'),
      completed: task.completed
    }))
  }
}, { immediate: true })
console.log('tasks: ' , tasks)
// تاریخ و زمان
const j = (date) => jalali(date || undefined).locale('fa')
const currentMonthJalali = ref(j())

// ویو و مودال‌ها
const view = ref('month')
const showAddModal = ref(false)
const selectedDayDetail = ref(null)
const newTask = ref({ title: '', time: '', date: '' })

// درگ و دراپ
let draggedTaskId = null
let longPressTimer = null


const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
const isDesktop = computed(() => window.innerWidth >= 1024)


const daysInMonth = computed(() => {
  const start = currentMonthJalali.value.clone().startOf('jMonth').startOf('week')
  const end = currentMonthJalali.value.clone().endOf('jMonth').endOf('week')
  const days = []
  let day = start.clone()
  while (day.isBefore(end) || day.isSame(end, 'day')) {
    days.push({
      date: day.format('jYYYY-jMM-jDD'),
      dateObj: day,
      day: day.format('jD'),
      isToday: day.isSame(j(), 'day'),
      isCurrentMonth: day.isSame(currentMonthJalali.value, 'jMonth')
    })
    day = day.add(1, 'day')
  }
  return days
})

// ویو هفته
const weekViewDays = computed(() => {
  const start = currentMonthJalali.value.clone().startOf('week')
  return Array.from({ length: 7 }, (_, i) => {
    const d = start.clone().add(i, 'day')
    return { date: d.format('jYYYY-jMM-jDD'), dateObj: d, isToday: d.isSame(j(), 'day') }
  })
})

// گروه‌بندی تسک‌ها بر اساس تاریخ
const tasksByDate = computed(() => {
  const map = {}
  tasks.value.forEach(t => {
    console.log(t)
    if (!map[t.start]) map[t.date] = []
    map[t.date].push(t)
  })
  return map
})

// کلاس دکمه‌های ویو
const viewBtnClass = (v) => view.value === v
    ? 'px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold shadow-md'
    : 'px-6 py-2.5 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition'

// درگ و دراپ
const dragStart = (e, id) => { draggedTaskId = id; e.dataTransfer.setData('taskId', id) }
const startLongPress = (id) => { longPressTimer = setTimeout(() => draggedTaskId = id, 600) }
const endLongPress = () => clearTimeout(longPressTimer)


const { mutate: mutateTaskUpdate } = useUpdateTask()

const onDrop = (e, targetDate) => {
  const id = draggedTaskId || e.dataTransfer.getData('taskId')
  if (id) {
    const task = tasks.value.find(t => t.id == id)
    if (task && task.date !== targetDate) {
      // آپدیت UI
      task.date = targetDate

      // آپدیت سرور
      mutateTaskUpdate({ id: task.id, updates: { start_datetime: targetDate + 'T' + (task.time || '00:00:00') + 'Z' } })
    }
  }
  draggedTaskId = null
}


// ناوبری ماه
const prev = () => currentMonthJalali.value = currentMonthJalali.value.subtract(1, 'jMonth')
const next = () => currentMonthJalali.value = currentMonthJalali.value.add(1, 'jMonth')
const goToday = () => currentMonthJalali.value = j()
const setView = (v) => { if (isDesktop.value) view.value = v }

// باز کردن جزئیات روز
const openDayDetail = (date) => selectedDayDetail.value = date
const openAddModalWithDate = (date) => {
  newTask.value.date = date.format('jYYYY-jMM-jDD')
  showAddModal.value = true
  selectedDayDetail.value = null
}

// تغییر وضعیت تکمیل تسک
const toggleTask = (id) => {
  const task = tasks.value.find(t => t.id == id)
  if (task) task.completed = !task.completed
}

// اضافه کردن تسک جدید
const addTask = () => {
  if (!newTask.value.title.trim()) return
  const date = newTask.value.date || currentMonthJalali.value.format('jYYYY-jMM-jDD')
  tasks.value.push({
    id: Date.now(),
    title: newTask.value.title.trim(),
    time: newTask.value.time || null,
    date,
    completed: false
  })
  newTask.value = { title: '', time: '', date: '' }
  showAddModal.value = false
}

// مدیریت رویدادهای ماوس و تاچ
onMounted(() => {
  document.addEventListener('touchend', endLongPress)
  document.addEventListener('mouseup', endLongPress)
  if (!isDesktop.value) view.value = 'month'
})

onUnmounted(() => {
  document.removeEventListener('touchend', endLongPress)
  document.removeEventListener('mouseup', endLongPress)
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: translateY(20px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>