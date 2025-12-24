import jalali from 'jalali-moment'

export const toJalali = (date) => {
    if (!date) return jalali().format('jYYYY-jMM-jDD'); // پیش‌فرض امروز
    try {
        return jalali(date).format('jYYYY-jMM-jDD')
    } catch (e) {
        console.error('Invalid date for Jalali:', date)
        return jalali().format('jYYYY-jMM-jDD') // برگردوندن امروز به جای crash
    }
}
