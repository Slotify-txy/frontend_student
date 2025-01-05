import { Box, Divider } from '@mui/material';
import React from 'react';
import CoachSelection from './CoachSelection';
import Logo from './Logo';
import LogOut from './LogOut';
import { Profile } from './Profile';

export const NavBar = () => {
  return (
    <Box sx={{ height: '100%' }}>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          paddingX: 10,
          justifyContent: 'space-between',
        }}
      >
        <Logo />
        <CoachSelection />
        <Box
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <Profile />
          <LogOut />
        </Box>
      </Box>

      <Divider />
    </Box>
  );
};
