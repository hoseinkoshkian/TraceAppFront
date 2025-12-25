<!-- src/components/calendar/CalendarDay.vue -->
<template>
  <div
      @click="openDayDetail"
      @dragover.prevent
      @drop.prevent="onDrop"
      class="bg-white rounded-xl p-2 h-32 flex flex-col hover:shadow-md transition-all duration-200 cursor-pointer relative overflow-hidden"
      :class="{
        'ring-2 ring-blue-500 shadow-lg bg-blue-50/50': isToday,
        'opacity-60': !isCurrentMonth
      }"
  >
    <!-- شماره روز -->
    <div class="text-center font-semibold text-xs mb-1" :class="{ 'text-blue-600': isToday }">
      {{ dayNumber }}
    </div>

    <!-- محتوا -->
    <div class="flex-1 relative">
      <!-- لیست آیتم‌های قابل نمایش -->
      <div class="absolute inset-0 pb-6 overflow-hidden">
        <div class="space-y-1 text-xs">
          <!-- تسک‌ها -->
          <div
              v-for="task in visibleTasks"
              :key="task.id"
              draggable="true"
              @dragstart="dragStart($event, task.id)"
              @click.stop="toggleTask(task.id)"
              class="flex items-center gap-1.5 p-1 rounded-md cursor-move select-none bg-blue-50 border border-blue-200 truncate"
              :class="{ 'opacity-50 line-through': task.completed }"
          >
            <input
                type="checkbox"
                :checked="task.completed"
                @click.stop
                readonly
                class="w-3 h-3 rounded text-blue-600 flex-shrink-0"
            />
            <div class="w-1 h-1 rounded-full bg-blue-600 flex-shrink-0"></div>
            <span class="truncate">{{ task.title }}</span>
          </div>

          <!-- اهداف -->
          <div
              v-for="goal in visibleGoals"
              :key="goal.id"
              class="flex items-center gap-1.5 p-1 rounded-md select-none truncate"
          >
            <div class="w-1 h-1 rounded-full bg-green-600 flex-shrink-0"></div>
            <span class="truncate">{{ goal.title }}</span>
          </div>
        </div>
      </div>

      <!-- دکمه +X مورد دیگر -->
      <div
          v-if="totalItems > maxVisible"
          @click.stop="openSmallModal"
          class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-4 pb-1 text-center cursor-pointer"
      >
        <span class="text-blue-600 text-xs font-medium hover:underline">
          +{{ totalItems - maxVisible }} مورد دیگر
        </span>
      </div>
    </div>
  </div>

  <!-- مودال کوچک برای نمایش همه آیتم‌ها -->
  <Transition name="fade">
    <div
        v-if="showSmallModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="showSmallModal = false"
    >
      <div @click.stop class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <!-- هدر -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 text-center">
          <h3 class="text-lg font-bold">
            {{ formattedDate }}
          </h3>
        </div>

        <!-- لیست کامل -->
        <div class="flex-1 overflow-y-auto p-5 space-y-3">
          <!-- همه تسک‌ها -->
          <div
              v-for="task in tasks"
              :key="task.id"
              class="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200"
              :class="{ 'opacity-60 line-through': task.completed }"
          >
            <input
                type="checkbox"
                :checked="task.completed"
                readonly
                class="w-5 h-5 rounded text-blue-600 flex-shrink-0"
            />
            <div class="flex-1 text-right">
              <div class="font-medium">{{ task.title }}</div>
              <div v-if="task.time" class="text-sm text-gray-600 mt-1">{{ task.time }}</div>
            </div>
          </div>

          <!-- همه اهداف -->
          <div
              v-for="goal in goals"
              :key="goal.id"
              class="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200"
          >
            <div class="w-5 h-5 rounded-full bg-green-600 flex-shrink-0"></div>
            <div class="flex-1 text-right font-medium">
              {{ goal.title }}
            </div>
          </div>

          <!-- پیام وقتی چیزی نیست -->
          <p v-if="totalItems === 0" class="text-center text-gray-500 py-10 text-lg">
            هیچ موردی ثبت نشده
          </p>
        </div>

        <!-- دکمه بستن -->
        <div class="p-4 border-t bg-gray-50">
          <button
              @click="showSmallModal = false"
              class="w-full py-3 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-800 transition"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, ref } from 'vue'
import jalali from 'jalali-moment'

const props = defineProps({
  date: { type: String, required: true },
  dateObj: { type: Object, required: true },
  dayNumber: { type: String, required: true },
  isToday: { type: Boolean, default: false },
  isCurrentMonth: { type: Boolean, default: true },
  tasks: { type: Array, default: () => [] },
  goals: { type: Array, default: () => [] },
  maxVisible: { type: Number, default: 3 }
})

const emit = defineEmits(['open-detail', 'drop', 'drag-start', 'toggle-task'])

// تعداد کل آیتم‌ها
const totalItems = computed(() => props.tasks.length + props.goals.length)

// نمایش محدود تسک‌ها و اهداف
const visibleTasks = computed(() => {
  const goalCount = visibleGoals.value.length
  const taskLimit = Math.max(0, props.maxVisible - goalCount)
  return props.tasks.slice(0, taskLimit)
})

const visibleGoals = computed(() => {
  const taskCount = Math.min(props.tasks.length, props.maxVisible)
  const goalLimit = Math.max(0, props.maxVisible - taskCount)
  return props.goals.slice(0, goalLimit)
})

// تاریخ فرمت‌شده برای هدر مودال (امن و بدون خطا)
const formattedDate = computed(() => {
  return jalali(props.dateObj).locale('fa').format('dddd jD jMMMM jYYYY')
})

// توابع
const openDayDetail = () => emit('open-detail', props.dateObj)
const onDrop = (e) => emit('drop', e, props.date)
const dragStart = (e, taskId) => emit('drag-start', e, taskId)
const toggleTask = (taskId) => emit('toggle-task', taskId)

// مودال کوچک
const showSmallModal = ref(false)
const openSmallModal = () => {
  showSmallModal.value = true
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>