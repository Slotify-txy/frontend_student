import { Box } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { NavBar } from './components/NavBar/NavBar';
import SchedulePage from './features/Calendar/SchedulePage';
import moment from 'moment';
import * as CalendarViewConstants from './common/constants/calendarView';

function App() {
  const height = 48;
  const py = 8;
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState(CalendarViewConstants.WEEK);
  const [calendarRange, setCalendarRange] = useState({
    start: moment().startOf('week'),
    end: moment().endOf('week'),
  });

  useEffect(() => {
    setCalendarRange({
      start: moment(calendarDate).startOf('week'),
      end: moment(calendarDate).endOf('week'),
    });
  }, [calendarDate]);

  return (
    <Box sx={{ height: '100vh', bgcolor: '#f8fafe' }}>
      <Box sx={{ height: height, py: `${py}px` }}>
        <NavBar
          calendarView={calendarView}
          setCalendarView={setCalendarView}
          calendarRange={calendarRange}
          setCalendarDate={setCalendarDate}
        />
      </Box>
      <SchedulePage
        navBarHeight={height + 2 * py}
        calendarView={calendarView}
        setCalendarRange={setCalendarRange}
        calendarDate={calendarDate}
        setCalendarDate={setCalendarDate}
      />
    </Box>
  );
}

export default App;
