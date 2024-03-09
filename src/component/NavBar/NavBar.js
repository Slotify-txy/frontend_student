import { Box } from '@mui/material'
import React from 'react'
import { useCreateSlotsMutation, useGetSlotsQuery } from '../../api/apiSlice'
import { SlotAction } from './SlotAction'

export const NavBar = () => {
    return <Box><SlotAction /></Box>

}
