import { Box, Divider } from '@mui/material';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React, { useState } from 'react';
import { ActionBar } from './ActionBar';
import ScheduleCalendar from './ScheduleCalendar';

const moment = extendMoment(Moment);

const SchedulePage = ({
  navBarHeight,
  setCalendarRange,
  calendarView,
  setCalendarView,
  calendarDate,
  setCalendarDate,
}) => {
  const [availableSlots, setAvailableSlots] = useState([]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: `calc(100% - ${navBarHeight}px)`,
      }}
    >
      <Box sx={{ flex: 1, ml: 1 }}>
        <ScheduleCalendar
          availableSlots={availableSlots}
          setAvailableSlots={setAvailableSlots}
          calendarView={calendarView}
          setCalendarView={setCalendarView}
          setCalendarRange={setCalendarRange}
          calendarDate={calendarDate}
          setCalendarDate={setCalendarDate}
        />
      </Box>
      <Box sx={{ height: '100%', width: 70 }}>
        <ActionBar
          availableSlots={availableSlots}
          setAvailableSlots={setAvailableSlots}
        />
      </Box>
    </Box>
  );
};

export default SchedulePage;
