// src/api/index.js

// اول BaseAPI رو import و export می‌کنیم (همیشه اول لود بشه)
export { default as BaseAPI } from './BaseAPI.js'

// حالا همه APIهای دیگه رو یکی یکی import و export می‌کنیم
export { taskAPI } from './task.api.js'
export { taskPatternApi } from './taskPattern.api.js'

// اگر بعداً API جدید اضافه کردی، فقط یک خط اینجا اضافه کن:
// export { goalAPI } from './goal.api.js'