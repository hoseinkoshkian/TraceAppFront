// utils/date/to_jalali.js
import jalali from 'jalali-moment'

export const utcToJalali = (date) => {
    if (!date) return null

    const m = jalali(date).utc()

    if (!m.isValid()) {
        console.error('Invalid date:', date)
        return null
    }

    return m.local().format('jYYYY-jMM-jDD')
}


export const jalaliToUtc = (jalaliDate, time = '00:00') => {
    const m = jalali(
        `${jalaliDate} ${time}`,
        'jYYYY-jMM-jDD HH:mm'
    )

    if (!m.isValid()) {
        console.error('Invalid Jalali date:', jalaliDate, time)
        return null
    }

    return m.utc().format('YYYY-MM-DDTHH:mm:ss[Z]')
}