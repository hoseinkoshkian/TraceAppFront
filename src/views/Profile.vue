<!-- src/views/Profile.vue (نسخه نهایی و کاملاً اصلاح‌شده) -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 py-12 px-4">
    <div class="max-w-5xl mx-auto">

      <!-- ===== هدر پروفایل ===== -->
      <div class="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden mb-8">
        <div class="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 opacity-90"></div>
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?ixlib=rb-4.0.3&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>

        <div class="relative z-10 flex flex-col items-center py-12 px-8 text-white">
          <!-- آواتار -->
          <div class="relative mb-6">
            <div class="w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-900/50 ring-8 ring-white/30 shadow-2xl flex items-center justify-center">
              <i class="pi pi-user-astronaut text-6xl text-primary-300"></i>
            </div>
            <div class="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full ring-4 ring-white flex items-center justify-center shadow-lg">
              <i class="pi pi-check text-white text-xl"></i>
            </div>
          </div>

          <h1 class="text-4xl font-bold mb-2">{{ fullName }}</h1>
          <p class="text-xl opacity-90">@{{ profile?.username || '...' }}</p>
          <p class="mt-4 text-lg opacity-80">فرمانده ارشد ایستگاه کنترل اهداف</p>
        </div>

        <!-- لودینگ هدر -->
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-3xl">
          <i class="pi pi-spin pi-spinner text-5xl text-white"></i>
        </div>
      </div>

      <!-- ===== فرم ویرایش پروفایل ===== -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold flex items-center gap-3">
            <i class="pi pi-user-edit text-primary-600 text-3xl"></i>
            ویرایش پروفایل
          </h2>

          <button
              @click="isEditing = !isEditing"
              class="px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-3"
              :class="isEditing
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/30'"
          >
            <i class="pi text-xl" :class="isEditing ? 'pi-times' : 'pi-pencil'"></i>
            {{ isEditing ? 'لغو ویرایش' : 'ویرایش اطلاعات' }}
          </button>
        </div>

        <!-- لودینگ اولیه -->
        <div v-if="isLoading" class="text-center py-20">
          <i class="pi pi-spin pi-spinner text-6xl text-primary-600 mb-6"></i>
          <p class="text-lg text-slate-500">در حال دریافت اطلاعات...</p>
        </div>

        <!-- خطا در دریافت اولیه -->
        <div v-else-if="isError" class="p-8 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-2xl text-center space-y-4">
          <i class="pi pi-exclamation-triangle text-4xl"></i>
          <p class="font-semibold mb-2">خطا در دریافت اطلاعات پروفایل</p>
          <p class="text-sm mb-4">{{ errorMessage }}</p>
          <button @click="refetch" class="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center gap-2 mx-auto">
            <i class="pi pi-refresh"></i>
            تلاش مجدد
          </button>
        </div>

        <!-- فرم اصلی -->
        <div v-else-if="profile" class="space-y-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- نام -->
            <div class="relative group">
              <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">نام</label>
              <div class="relative">
                <InputText
                    v-model="form.first_name"
                    :disabled="!isEditing"
                    class="w-full px-5 py-4 text-lg rounded-2xl border-2 transition-all duration-300 pl-12"
                    :class="isEditing
                      ? 'border-primary-400 focus:border-primary-600 focus:ring-4 focus:ring-primary-500/20 bg-white dark:bg-slate-700 shadow-inner'
                      : 'border-transparent bg-slate-100 dark:bg-slate-900/50 cursor-not-allowed'"
                    placeholder="نام خود را وارد کنید"
                />
                <i class="pi pi-user absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 text-xl opacity-60 group-focus-within:opacity-100 transition"></i>
              </div>
            </div>

            <!-- نام خانوادگی -->
            <div class="relative group">
              <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">نام خانوادگی</label>
              <div class="relative">
                <InputText
                    v-model="form.last_name"
                    :disabled="!isEditing"
                    class="w-full px-5 py-4 text-lg rounded-2xl border-2 transition-all duration-300 pl-12"
                    :class="isEditing
                      ? 'border-primary-400 focus:border-primary-600 focus:ring-4 focus:ring-primary-500/20 bg-white dark:bg-slate-700 shadow-inner'
                      : 'border-transparent bg-slate-100 dark:bg-slate-900/50 cursor-not-allowed'"
                    placeholder="نام خانوادگی خود را وارد کنید"
                />
                <i class="pi pi-user absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 text-xl opacity-60 group-focus-within:opacity-100 transition"></i>
              </div>
            </div>

            <!-- نام کاربری -->
            <div class="relative group">
              <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">نام کاربری</label>
              <div class="relative">
                <InputText
                    v-model="form.username"
                    :disabled="!isEditing"
                    class="w-full px-5 py-4 text-lg rounded-2xl border-2 transition-all duration-300 pl-12"
                    :class="isEditing
                      ? 'border-primary-400 focus:border-primary-600 focus:ring-4 focus:ring-primary-500/20 bg-white dark:bg-slate-700 shadow-inner'
                      : 'border-transparent bg-slate-100 dark:bg-slate-900/50 cursor-not-allowed'"
                />
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 text-xl opacity-60 group-focus-within:opacity-100 transition">@</span>
              </div>
            </div>

            <!-- شماره تماس -->
            <div class="relative group">
              <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">شماره تماس</label>
              <div class="relative">
                <InputText
                    v-model="form.phone_number"
                    :disabled="!isEditing"
                    dir="ltr"
                    class="w-full px-5 py-4 text-lg rounded-2xl border-2 transition-all duration-300 pl-12 text-left"
                    :class="isEditing
                      ? 'border-primary-400 focus:border-primary-600 focus:ring-4 focus:ring-primary-500/20 bg-white dark:bg-slate-700 shadow-inner'
                      : 'border-transparent bg-slate-100 dark:bg-slate-900/50 cursor-not-allowed'"
                    placeholder="۰۹۱۳..."
                />
                <i class="pi pi-phone absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 text-xl opacity-60 group-focus-within:opacity-100 transition"></i>
              </div>
            </div>
          </div>

          <!-- دکمه‌های عملیات (فقط در حالت ویرایش) -->
          <transition name="slide-fade">
            <div v-if="isEditing" class="flex justify-end gap-5 pt-8 border-t border-slate-200 dark:border-slate-700">
              <button
                  @click="cancelEdit"
                  class="px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
              >
                لغو
              </button>

              <button
                  @click="saveProfile"
                  :disabled="isSaving"
                  class="px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed"
                  :class="isSaving
                    ? 'bg-primary-400 text-white/80'
                    : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-primary-600/50'"
              >
                <i v-if="isSaving" class="pi pi-spin pi-spinner"></i>
                <i v-else class="pi pi-save"></i>
                {{ isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
              </button>
            </div>
          </transition>

          <!-- پیام موفقیت (۵ ثانیه بعد مخفی می‌شه) -->
          <transition name="slide-fade">
            <div v-if="showSuccessMessage" class="mt-6 p-6 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-2xl text-center flex items-center justify-center gap-4 shadow-lg">
              <i class="pi pi-check-circle text-4xl"></i>
              <p class="text-xl font-bold">تغییرات با موفقیت ذخیره شد، فرمانده! 🚀</p>
            </div>
          </transition>

          <!-- پیام خطا در ذخیره -->
          <transition name="slide-fade">
            <div v-if="isSaveError" class="mt-6 p-6 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-2xl text-center flex items-center justify-center gap-4 shadow-lg">
              <i class="pi pi-exclamation-triangle text-4xl"></i>
              <p class="text-xl font-bold">خطا در ذخیره: {{ saveErrorMessage }}</p>
            </div>
          </transition>
        </div>

        <!-- بدون داده -->
        <div v-else class="text-center py-12 text-slate-500 dark:text-slate-300">
          <i class="pi pi-info-circle text-4xl mb-4"></i>
          <p class="text-lg">اطلاعاتی برای نمایش وجود ندارد.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import InputText from 'primevue/inputtext'
import { useProfile, useUpdateProfile } from '@/composables/useProfile'

const { data: profileData, isLoading: queryIsLoading, isError, error, refetch } = useProfile()
const updateMutation = useUpdateProfile()

const profile = computed(() => profileData.value)

const isLoading = computed(() => queryIsLoading.value)
const errorMessage = computed(() => error.value?.message || 'خطای ناشناخته')

// وضعیت‌های mutation با fallback برای v4 و v5
const isSaving = computed(() => updateMutation.isPending?.value ?? updateMutation.isLoading?.value ?? false)
const isSaveError = computed(() => updateMutation.isError?.value ?? false)
const saveErrorMessage = computed(() => updateMutation.error?.value?.message || 'مشکل ناشناخته')

// حالت ویرایش
const isEditing = ref(false)

// فرم
const form = ref({
  first_name: '',
  last_name: '',
  username: '',
  phone_number: '',
})

// پیام موفقیت موقت
const showSuccessMessage = ref(false)

// پر کردن فرم
watch(profile, (newProfile) => {
  if (newProfile) {
    form.value = { ...newProfile }
  }
}, { immediate: true })

// نام کامل برای هدر
const fullName = computed(() => {
  if (isLoading.value) return 'در حال بارگذاری...'
  if (!profile.value) return 'کاربر ناشناس'

  const { first_name, last_name, username } = profile.value
  const full = `${first_name || ''} ${last_name || ''}`.trim()
  return full || `@${username}`
})

// ذخیره تغییرات
async function saveProfile() {
  try {
    await updateMutation.mutateAsync(form.value)

    showSuccessMessage.value = true
    isEditing.value = false

    setTimeout(() => {
      showSuccessMessage.value = false
    }, 5000)
  } catch (err) {
    console.error('خطا در ذخیره:', err)
  }
}

// لغو ویرایش
function cancelEdit() {
  isEditing.value = false
  if (profile.value) {
    form.value = { ...profile.value }
  }
}
</script>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.4s ease;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>