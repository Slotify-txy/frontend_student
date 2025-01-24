import { Box, Stack } from '@mui/material';
import React from 'react';
import CoachSelection from './CoachSelection';
import Logo from './Logo';
import LogOut from './LogOut';
import { Profile } from './Profile';
import CalendarControl from './CalendarControl';

export const NavBar = ({
  calendarView,
  setCalendarView,
  calendarRange,
  setCalendarDate,
  tab,
  setTab,
}) => {
  return (
    <Stack
      sx={{
        flexDirection: 'row',
        px: 4,
        alignItems: 'center',
      }}
    >
      <Box mr={5}>
        <Logo />
      </Box>
      <Box flex={1} mr={5}>
        <CalendarControl
          calendarView={calendarView}
          setCalendarView={setCalendarView}
          calendarRange={calendarRange}
          setCalendarDate={setCalendarDate}
          tab={tab}
          setTab={setTab}
        />
      </Box>
      <Stack
        sx={{
          ml: 'auto',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Profile />
      </Stack>
    </Stack>
  );
};
