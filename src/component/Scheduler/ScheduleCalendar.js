import React, { useEffect, useCallback, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndProp from "react-big-calendar/lib/addons/dragAndDrop"
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid';
import { apiSlice as api, useGetSlotsQuery } from '../../api/apiSlice'
import { useDispatch } from 'react-redux'
import { Box } from '@mui/material'
import { convertSlots } from '../../util/slotUtil'

const localizer = momentLocalizer(moment)
const timeFormat = "YYYY-MM-DD[T]HH:mm:ss"
const DnDCalendar = withDragAndProp(Calendar)

export default function ScheduleCalendar() {
    const { data, isFetching, isSuccess } = useGetSlotsQuery({ studentId: 10, coachId: 10 })
    const dispatch = useDispatch()
    const onChangeSlotTime = useCallback(
        (start, end, id) => {
            dispatch(
                api.util.upsertQueryData('getSlots', { studentId: 10, coachId: 10 },
                    data.map(slot =>
                        slot.id === id ?
                            { ...slot, start: moment(start).format(timeFormat), end: moment(end).format(timeFormat) }
                            : slot
                    )
                )
            )
        },
        [data]
    )

    const onSelect = useCallback(
        (start, end) => {
            dispatch(
                api.util.upsertQueryData('getSlots', { studentId: 10, coachId: 10 },
                    [...data, {
                        id: uuidv4(),
                        start: moment(start).format(timeFormat),
                        end: moment(end).format(timeFormat),
                        isDraggable: true
                    }]
                ),
            )
        },
        [data]
    )

    if (isFetching) {
        return <Box>Loading...</Box>
    }
    return (
        <div style={{}}>
            <DnDCalendar
                localizer={localizer}
                events={convertSlots(data)}
                // timeslots={30}
                // step={1}
                draggableAccessor={"isDraggable"}
                views={['month', 'week']}
                defaultView='week'
                // drilldownView="week"
                onEventDrop={({ start, end, event }) => {
                    if (start.getDay() === end.getDay()) {
                        onChangeSlotTime(start, end, event.id)
                    }
                }}
                onEventResize={({ start, end, event }) => {
                    onChangeSlotTime(start, end, event.id)
                }}
                selectable={true}
                onSelectSlot={({ start, end }) => {
                    onSelect(start, end)
                }}
            />
        </div>
    )
}