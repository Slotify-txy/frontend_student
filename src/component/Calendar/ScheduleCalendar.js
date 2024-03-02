import React, { useEffect, useCallback, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndProp from "react-big-calendar/lib/addons/dragAndDrop"
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import Moment from 'moment'
import { extendMoment } from 'moment-range';
import { v4 as uuidv4 } from 'uuid';
import { apiSlice as api, useGetSlotsQuery } from '../../api/apiSlice'
import { useDispatch } from 'react-redux'
import { Box } from '@mui/material'
import { convertSlots } from '../../util/slotUtil'
import CustomEventComponent from './CustomEventComponent'
import * as SlotStatusConstants from "../../constants/slotStatus"

const moment = extendMoment(Moment)
const localizer = momentLocalizer(Moment)
const timeFormat = "YYYY-MM-DD[T]HH:mm:ss"
const DnDCalendar = withDragAndProp(Calendar)

export default function ScheduleCalendar() {
    const { data, isFetching, isSuccess } = useGetSlotsQuery({ studentId: 10, coachId: 10 })
    const dispatch = useDispatch()
    const onChangeSlotTime = useCallback(
        (start, end, id) => {
            if (isOverlapped(start, end, id)) {
                return
            }
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
            if (isOverlapped(start, end)) {
                return
            }
            dispatch(
                api.util.upsertQueryData('getSlots', { studentId: 10, coachId: 10 },
                    [...data, {
                        id: uuidv4(),
                        start: moment(start).format(timeFormat),
                        end: moment(end).format(timeFormat),
                        status: SlotStatusConstants.AVAILABLE,
                        isDraggable: true
                    }]
                ),
            )
        },
        [data]
    )

    // check if the slot will overlaps with existing slots
    const isOverlapped = useCallback(
        (start, end, id = undefined) => {
            return !data.every(slot => {
                if (id && slot.id === id) {
                    return true;
                }
                const range1 = moment.range(start, end);
                const range2 = moment.range(moment(slot.start), moment(slot.end));
                const result = range1.overlaps(range2)
                if (result) {
                    // todo: send notification
                    return false
                }
                return true
            })
        }, [data])

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
                selectable={'true'}
                onSelectSlot={({ start, end }) => {
                    onSelect(start, end)
                }}
                // eventPropGetter={(event) => {
                //     const backgroundColor = 'yellow';
                //     return { style: { backgroundColor } }
                // }}
                components={{
                    event: CustomEventComponent,
                    // eventWrapper: CustomEventWrapper,
                    // eventContainerWrapper: MyEventContainerWrapper
                    // tooltipAccessor: TooltipAccessor
                }}
            />
        </div>
    )
}

