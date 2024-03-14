import React from 'react'
import { useCreateSlotsMutation, useDeleteSlotsMutation, useGetSlotsQuery } from '../../api/slotApiSlice'
import LoadingButton from '@mui/lab/LoadingButton'
import { Box, Button, ButtonGroup } from '@mui/material'
import moment from 'moment'
import * as SlotStatusConstants from "../../constants/slotStatus"

const timeFormat = "YYYY-MM-DD[T]HH:mm:ss"

export const SlotAction = () => {
    const { data } = useGetSlotsQuery({ studentId: 10, coachId: 10 })
    const [createSlots, { isLoading: isCreatingSlots }] = useCreateSlotsMutation()
    const [deleteSlots, { isLoading: isDeletingSlots }] = useDeleteSlotsMutation()

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

    return (
        <ButtonGroup variant="outlined" >
            <LoadingButton onClick={schedule} loading={isCreatingSlots}>Schedule</LoadingButton>
            <LoadingButton onClick={clearSlots} loading={isDeletingSlots}>Clear</LoadingButton>
        </ButtonGroup>
    )
}
