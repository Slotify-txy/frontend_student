import React from 'react'
import { useCreateSlotsMutation, useDeleteSlotsMutation, useGetSlotsQuery } from '../../api/apiSlice'
import { Box, Button } from '@mui/material'
import moment from 'moment'
import * as SlotStatusConstants from "../../constants/slotStatus"

const timeFormat = "YYYY-MM-DD[T]HH:mm:ss"

export const SlotAction = () => {
    const { data, isFetching, isSuccess, refetch } = useGetSlotsQuery({ studentId: 10, coachId: 10 })
    const [createSlots, { isLoading }] = useCreateSlotsMutation()
    const [deleteSlots] = useDeleteSlotsMutation()

    const schedule = async () => {
        try {
            await createSlots({
                studentId: 10, coachId: 10, slots: data.map(({ start, end }) => {
                    return {
                        startAt: moment(start).format(timeFormat),
                        endAt: moment(end).format(timeFormat),
                        status: SlotStatusConstants.ARRANGING
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
