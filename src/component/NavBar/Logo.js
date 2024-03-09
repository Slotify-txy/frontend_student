import { Box, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import React from 'react'

const Logo = () => {
    return (
        <Typography sx={{ fontFamily: "Architects Daughter", fontWeight: 300, fontSize: 30, color: blue[200], marginRight: 10 }}>
            Simply Schedule
        </Typography>
    )
}

export default Logo