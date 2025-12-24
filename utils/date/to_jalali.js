import jalali from 'jalali-moment'

export function toJalali(dateTime, format = 'jYYYY-jMM-jDD') {
    if (!dateTime) return null

    // اگر تاریخ شمسی بود (۱۴۰۰ به بالا)
    const isJalali = /^[12]\d{3}-\d{2}-\d{2}/.test(dateTime) && Number(dateTime.slice(0, 4)) >= 1300

    const m = isJalali
        ? jalali(dateTime, 'jYYYY-jMM-jDDTHH:mm:ss[Z]')
        : jalali(dateTime)

    return m.locale('fa').format(format)
}
