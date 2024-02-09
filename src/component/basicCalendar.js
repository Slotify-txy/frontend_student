import React, {useEffect, useCallback, useState} from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndProp from "react-big-calendar/lib/addons/dragAndDrop"
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import moment from 'moment'

const localizer = momentLocalizer(moment)

const DnDCalendar = withDragAndProp(Calendar)

let id = 3

export default function MyCalendar() {

    const [events, setEvents] = useState([
        {
            id: 1,
            start: moment("2024-01-22T14:00:00").toDate(),
            end: moment("2024-01-22T15:00:00").toDate(),
            title: "Ikun",
            isDraggable: true
        },
        {
            id: 2,
            start: moment("2024-01-22T14:00:00").toDate(),
            end: moment("2024-01-22T15:00:00").toDate(),
            title: "Ikun2",
            isDraggable: true
        }
    ])

    const onChangeEventTime = useCallback(
        (start, end, id) => {
            console.log(id)
            setEvents(prevEvents => {
                return prevEvents.map(event => 
                    event.id === id ? {...event, start, end} : event
                )
            })
        },
        []
    )

    const onSelect = useCallback(
        (start, end) => {
            setEvents(prevEvents => {
                const newEvents = [...prevEvents, {
                    id: id,
                    start,
                    end,
                    title: "Ikun",
                    isDraggable: true
                }]
                id += 1
                console.log(newEvents)
                return newEvents
            })
        },
        []
    )

    return (
        <div style={{height: "95vh"}}>
            <DnDCalendar
            localizer={localizer}
            events={events}
            // timeslots={30}
            // step={1}
            draggableAccessor={"isDraggable"}
            views={['month', 'week']}
            defaultView='week'
            // drilldownView="week"
            onEventDrop={({start, end, event}) => {
                if (start.getDay() === end.getDay()) {
                    onChangeEventTime(start, end, event.id)
                }
            }}
            onEventResize={({start, end, event}) => {
                onChangeEventTime(start, end, event.id)
            }}
            selectable={true}
            onSelectSlot={({start, end}) => {
                onSelect(start, end)
            }}
            />
        </div>
    )
}