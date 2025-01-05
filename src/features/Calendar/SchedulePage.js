import { Box, Divider } from '@mui/material';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React, { useState } from 'react';
import { ActionBar } from './ActionBar';
import ScheduleCalendar from './ScheduleCalendar';

const moment = extendMoment(Moment);

const SchedulePage = ({ navBarHeight }) => {
  const [availableSlots, setAvailableSlots] = useState([]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: `calc(100% - ${navBarHeight}px)`,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <ScheduleCalendar
          height={'100%'}
          availableSlots={availableSlots}
          setAvailableSlots={setAvailableSlots}
        />
      </Box>
      <Divider orientation="vertical" sx={{ ml: 1 }} />
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
