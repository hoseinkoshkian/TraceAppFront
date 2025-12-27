// src/utils/date/to_utc.js
export function toUTCISOString(date) {
    if (!(date instanceof Date) || isNaN(date)) return null

    // تبدیل به UTC با حفظ تاریخ محلی
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    return utcDate.toISOString() // مثال خروجی: 2025-12-27T00:00:00.000Z
}