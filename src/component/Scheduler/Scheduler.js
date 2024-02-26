import { Box, Button, Container, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ScheduleCalendar from '../Calendar/ScheduleCalendar'
import { useCreateSlotsMutation, useDeleteSlotsMutation, useGetSlotsQuery } from '../../api/apiSlice'
import moment from 'moment'

const timeFormat = "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"

export default function Scheduler() {
    return (
        <Box sx={{ flex: 1 }}>
            <Bar />
            <ScheduleCalendar sx={{ height: '80vh' }} />
        </Box>
    )
}

const Bar = () => {
    const { data, isFetching, isSuccess, refetch } = useGetSlotsQuery({ studentId: 10, coachId: 10 })
    const [createSlots, { isLoading }] = useCreateSlotsMutation()
    const [deleteSlots] = useDeleteSlotsMutation()

    const schedule = async () => {
        try {
            await createSlots({
                studentId: 10, coachId: 10, slots: data.map(({ start, end }) => {
                    return {
                        startAt: moment(start).format(timeFormat),
                        endAt: moment(end).format(timeFormat)
                    }
                })
            })
        } catch (err) {
            console.error('Failed to save the slots: ', err)
        }
    }

    const clearSlots = async () => {
        try {
            await deleteSlots({ studentId: 10, coachId: 10 })

        } catch (err) {
            console.error('Failed to clear slots: ', err)
        }
    }

    if (isFetching) {
        return <Box>Loading...</Box>
    }

    return (
        <Box sx={{ backgroundColor: '#cfe8fc' }}>
            <Button variant="outlined" onClick={schedule}>Schedule</Button>
            <Button variant="outlined" onClick={clearSlots}>Clear Slot</Button>
        </Box>
    )
}

