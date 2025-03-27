import { Box } from '@mui/material';
import React, { useState } from 'react';
import { ActionBar } from './ActionBar';
import ScheduleCalendar from './ScheduleCalendar';

const SchedulePage = ({
  navBarHeight,
  setCalendarRange,
  calendarView,
  setCalendarView,
  calendarDate,
  setCalendarDate,
}) => {
  const [planningSlots, setPlanningSlots] = useState([]);

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
          planningSlots={planningSlots}
          setPlanningSlots={setPlanningSlots}
          calendarView={calendarView}
          setCalendarView={setCalendarView}
          setCalendarRange={setCalendarRange}
          calendarDate={calendarDate}
          setCalendarDate={setCalendarDate}
        />
      </Box>
      <Box sx={{ height: '100%', width: 70 }}>
        <ActionBar
          planningSlots={planningSlots}
          setPlanningSlots={setPlanningSlots}
        />
      </Box>
    </Box>
  );
};

export default SchedulePage;
