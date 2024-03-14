import { Box, Divider } from '@mui/material'
import React from 'react'
import { useCreateSlotsMutation, useGetSlotsQuery } from '../../api/slotApiSlice'
import { SlotAction } from './SlotAction'
import Logo from './Logo'
import { Profile } from './Profile'
import LogOut from './LogOut'
import CoachSelection from './CoachSelection'

export const NavBar = () => {
    return <Box sx={{ height: '100%' }}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingX: 10, justifyContent: 'space-between' }}>
            <Logo />
            <CoachSelection />
            <SlotAction />
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                <Profile />
                <LogOut />
            </Box>

        </Box>

        <Divider />
    </Box>

}
