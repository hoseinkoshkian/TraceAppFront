<!-- src/views/Calender.vue — نسخه کامل نهایی با سایدبار آیکن‌دار -->
<template>
  <AddTaskModal
      :show="showAddModal"
      :task="newTask"
      @close="showAddModal = false"
      @submit="handleAddTask"
  />

  <div class="h-screen w-full flex bg-gradient-to-br from-slate-50 to-slate-100 relative " dir="rtl">

    <!-- سایدبار — فقط آیکن‌ها (فقط دسکتاپ) -->
    <CalenderSidebar />
    <!-- محتوای اصلی تقویم — با فاصله از سایدبار -->
    <div class="flex-1 lg:mr-20 flex flex-col overflow-hidden">

      <CalendarHeader
          :current-month="currentMonthJalali"
          :view="view"
          @prev="prev"
          @next="next"
          @today="goToday"
          @set-view="setView"
      />

      <!-- سرستون روزهای هفته -->
      <div class="grid grid-cols-7 bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-16 lg:top-10 z-40 shadow-sm">
        <div v-for="day in weekDays" :key="day" class="text-center py-4 text-sm font-semibold text-gray-700">
          {{ day }}
        </div>
      </div>

      <!-- بدنه اصلی تقویم -->
      <main class="flex-1 overflow-y-auto">

        <!-- ویو ماه (همیشه در موبایل، انتخابی در دسکتاپ) -->
        <div v-if="isDesktop ? view === 'month' : true" class="grid grid-cols-7 gap-px bg-gray-200 p-2">
          <CalendarDay
              v-for="day in daysInMonth"
              :key="day.date"
              :date="day.date"
              :date-obj="day.dateObj"
              :day-number="day.day"
              :is-today="day.isToday"
              :is-current-month="day.isCurrentMonth"
              :tasks="tasksByDate[day.date] || []"
              :goals="goalsByDate[day.date] || []"
              @open-detail="openDayDetail"
              @drop="onDrop"
              @drag-start="dragStart"
              @toggle-task="toggleTask"
          />
        </div>

        <!-- ویو هفته — فقط دسکتاپ -->
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
                    v-for="task in eventsByDate[day.date] || []"
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
                <p v-if="!eventsByDate[day.date]?.length" class="text-center text-gray-400 py-12 text-lg">
                  هیچ برنامه‌ای ثبت نشده
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- ویو روز — فقط دسکتاپ -->
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
                      v-for="task in eventsByDate[j().format('jYYYY-jMM-jDD')] || []"
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
                  <p v-if="!eventsByDate[j().format('jYYYY-jMM-jDD')]?.length" class="text-center text-gray-400 py-24 text-2xl font-light">
                    امروز برنامه‌ای ندارید
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- دکمه افزودن تسک -->
      <button @click="showAddModal = true"
              class="fixed bottom-6 left-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl font-light transition z-50">
        +
      </button>

      <!-- مودال بزرگ جزئیات روز -->
      <Transition name="fade">
        <div v-if="selectedDayDetail" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="selectedDayDetail = null">
          <div @click.stop class="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div class="bg-gradient-to-r from-indigo-600 to-blue-700 text-white p-8 text-center">
              <h2 class="text-3xl font-bold">{{ selectedDayDetail.format('dddd jD jMMMM jYYYY') }}</h2>
            </div>
            <div class="flex-1 overflow-y-auto p-6 space-y-4">
              <div v-for="task in eventsByDate[selectedDayDetail.format('jYYYY-jMM-jDD')] || []" :key="task.id"
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
              <p v-if="!eventsByDate[selectedDayDetail.format('jYYYY-jMM-jDD')]?.length" class="text-center py-20 text-gray-400 text-2xl">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import jalali from 'jalali-moment'
import { useAddTask, useTasks, useUpdateTask } from "@/composables/useTasks.js"
import { utcToJalali, jalaliToUtc } from '../../utils/date/to_jalali.js'
import AddTaskModal from "@/components/modal/AddTaskModal.vue"

import CalendarDay from "@/components/calendar/CalendarDay.vue"
import CalendarHeader from "@/components/calendar/CalenderHeader.vue"
import CalenderSidebar from "@/components/calendar/CalenderSidebar.vue";
import {useGoals} from "@/composables/useGoal.js";

// داده‌های واکنش‌پذیر
const tasks = ref([])
const goals = ref([])

// واکشی داده‌ها
// const { data: tasksData } = useTasks()
const { data: goalsData } = useGoals()

//
// watch(tasksData, (newVal) => {
//   if (newVal?.data?.results) {
//     tasks.value = newVal.data.results.map(task => ({
//       id: task.id,
//       title: task.title,
//       date: utcToJalali(task.start_datetime),
//       time: jalali(task.start_datetime).format('HH:mm'),
//       completed: task.completed
//     }))
//   }
// }, { immediate: true })

watch(goalsData, (newVal) => {
  if (newVal?.data?.results) {
    goals.value = newVal.data.results.map(goal => ({
      id: goal.id,
      title: goal.title,
      date: utcToJalali(goal.start_datetime),
      time: jalali(goal.start_datetime).format('HH:mm'),
    }))
  }
}, { immediate: true })

// تاریخ شمسی
const j = (date) => jalali(date || undefined).locale('fa')
const currentMonthJalali = ref(j())

// ویو و مودال‌ها
const view = ref('month')
const showAddModal = ref(false)
const selectedDayDetail = ref(null)
const newTask = ref({ title: '', time: '', date: '' })

// رویدادهای درگ و دراپ
let draggedTaskId = null
let longPressTimer = null

const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
const isDesktop = computed(() => window.innerWidth >= 1024)

// روزهای ماه
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

// روزهای ویو هفته
const weekViewDays = computed(() => {
  const start = currentMonthJalali.value.clone().startOf('week')
  return Array.from({ length: 7 }, (_, i) => {
    const d = start.clone().add(i, 'day')
    return { date: d.format('jYYYY-jMM-jDD'), dateObj: d, isToday: d.isSame(j(), 'day') }
  })
})

// ترکیب تسک و هدف برای نمایش در ویوهای دیگر
const eventsByDate = computed(() => {
  const map = {}
  tasks.value.forEach(t => {
    if (!t.date) return
    if (!map[t.date]) map[t.date] = []
    map[t.date].push(t)
  })
  return map
})

// گروه‌بندی تسک و هدف جداگانه برای CalendarDay
const tasksByDate = computed(() => {
  const map = {}
  tasks.value.forEach(t => {
    if (!t.date) return
    if (!map[t.date]) map[t.date] = []
    map[t.date].push(t)
  })
  return map
})

const goalsByDate = computed(() => {
  const map = {}
  goals.value.forEach(g => {
    if (!g.date) return
    if (!map[g.date]) map[g.date] = []
    map[g.date].push(g)
  })
  return map
})

// درگ و دراپ
const dragStart = (e, id) => { draggedTaskId = id; e.dataTransfer.setData('taskId', id) }
const startLongPress = (id) => { longPressTimer = setTimeout(() => draggedTaskId = id, 600) }
const endLongPress = () => clearTimeout(longPressTimer)

const { mutate: mutateTaskUpdate } = useUpdateTask()
const { mutate: mutateTaskCreate } = useAddTask()

const onDrop = (e, targetDate) => {
  const id = draggedTaskId || e.dataTransfer.getData('taskId')
  if (!id) return

  const task = tasks.value.find(t => t.id == id)
  if (!task) return

  task.date = targetDate
  const utcDateTime = jalaliToUtc(targetDate, task.time || '00:00')
  mutateTaskUpdate({ id: task.id, updates: { start_datetime: utcDateTime } })

  draggedTaskId = null
}

// ناوبری
const prev = () => currentMonthJalali.value = currentMonthJalali.value.subtract(1, 'jMonth')
const next = () => currentMonthJalali.value = currentMonthJalali.value.add(1, 'jMonth')
const goToday = () => currentMonthJalali.value = j()
const setView = (v) => { if (isDesktop.value) view.value = v }

// مودال‌ها
const openDayDetail = (date) => selectedDayDetail.value = date
const openAddModalWithDate = (date) => {
  newTask.value.date = date.format('jYYYY-jMM-jDD')
  showAddModal.value = true
  selectedDayDetail.value = null
}

// تکمیل تسک
const toggleTask = (id) => {
  const task = tasks.value.find(t => t.id == id)
  if (task) {
    task.completed = !task.completed
    mutateTaskUpdate({ id: task.id, updates: { completed: task.completed } })
  }
}

// افزودن تسک
const handleAddTask = (task) => {
  if (!task.title.trim()) return

  const date = task.date || currentMonthJalali.value.format('jYYYY-jMM-jDD')

  tasks.value.push({
    id: Date.now(),
    title: task.title,
    time: task.time || null,
    date,
    completed: false
  })

  const nowUtc = new Date().toISOString()
  mutateTaskCreate({
    title: task.title,
    time: task.time || null,
    start_datetime: nowUtc,
    completed: false
  })

  showAddModal.value = false
}

watch(() => showAddModal.value, (val) => {
  if (!val) newTask.value = { title: '', time: '', date: '' }
})

// مدیریت ریسپانسیو
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>