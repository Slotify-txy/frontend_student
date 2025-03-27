import { Box } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import './App.css';
import { NavBar } from './components/NavBar/NavBar';
import SchedulePage from './features/Calendar/SchedulePage';
import moment from 'moment';
import CALENDAR_VIEW from './common/constants/calendarView';
import Login from './components/Login';
import AddDefaultCoach from './components/AddDefaultCoach';
import { useGetUserQuery } from './app/services/userApiSlice';
import { useSelector } from 'react-redux';
import AUTH_STATUS from './common/constants/authStatus';
import { useLoginMutation } from './app/services/authApiSlice'; //It's not being used, but it's required

const _ = useLoginMutation;

function App() {
  const height = 48;
  const py = 8;

  const { userId, status } = useSelector((state) => state.auth);

  useGetUserQuery(
    { id: userId },
    {
      skip: status != AUTH_STATUS.AUTHENTICATED || userId == null,
    }
  );

  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState(CALENDAR_VIEW.WEEK);
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
    <Fragment>
      <Box sx={{ height: '100vh', bgcolor: '#f8fafe' }}>
        <Box
          sx={{
            height: height,
            py: `${py}px`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
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
      <Login />
      <AddDefaultCoach />
    </Fragment>
  );
}

export default App;
