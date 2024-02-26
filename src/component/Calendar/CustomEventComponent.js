import { Badge, Box, Button, Chip, IconButton, Tooltip, Typography } from '@mui/material'
import moment from 'moment-timezone'
import React, { useCallback, useEffect, useState } from 'react'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { apiSlice as api, useGetSlotsQuery } from '../../api/apiSlice'

const CustomEventComponent = ({ event }) => {
    const { data, isSuccess } = useGetSlotsQuery({ studentId: 10, coachId: 10 })
    const start = moment(event.start).format('hh:mm A')
    const end = moment(event.end).format('hh:mm A')
    const [onHover, setOnHover] = useState(false)
    const dispatch = useDispatch()

    const deleteSlot = useCallback(() => {
        isSuccess &&
            dispatch(
                api.util.upsertQueryData('getSlots', { studentId: 10, coachId: 10 }, data.filter(slot => slot.id !== event.id))
            )
    }, [data, isSuccess])

    return (

        <Box sx={{ height: '100%', paddingX: "0.1rem", overflow: 'hidden', backgroundColor: 'rgb(3, 155, 229)' }} onMouseEnter={() => setOnHover(true)} onMouseLeave={() => setOnHover(false)}>

            <Box sx={{ display: "flex", width: '100%', flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                <Typography sx={{ fontSize: 15, fontWeight: 700, alignSelf: 'center' }} >Available</Typography>
                {
                    // todo: make ui better
                    onHover &&
                    <Tooltip title="Delete">
                        <IconButton onClick={deleteSlot} sx={{ color: 'red', padding: 0, alignSelf: 'center' }} aria-label="delete">
                            <HighlightOffIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                }

            </Box>
            <Typography sx={{ fontSize: 15, alignSelf: 'center' }}>{start} - {end}</Typography>

        </Box>

    )
}

export default CustomEventComponent