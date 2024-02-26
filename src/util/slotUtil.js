import moment from 'moment'

export const convertSlots = (data) => {
    return data.map(slot => {
        const { start, end } = slot
        return {
            ...slot,
            start: moment(start).toDate(),
            end: moment(end).toDate(),
        }
    })
}