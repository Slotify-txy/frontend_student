import { Avatar, Box, IconButton } from '@mui/material'
import { blue } from '@mui/material/colors'
import React from 'react'

export const Profile = () => {
    const size = 30
    return (
        <Box>
            <IconButton>
                <Avatar
                    sx={{ bgcolor: blue[300], width: size, height: size }}
                    alt="Xiyuan"
                    src="/broken-image.jpg"
                    onClick={() => console.log('profile')}
                />
            </IconButton>
        </Box>
    )
}
