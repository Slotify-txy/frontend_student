import logo from './logo.svg';
import './App.css';
import ScheduleCalendar from './component/Calendar/ScheduleCalendar';
import { Box } from '@mui/material';
import { NavBar } from './component/NavBar/NavBar';

function App() {

  const navBarHeight = 70

  return (
    <Box sx={{ height: '100vh' }}>
      <Box sx={{ height: navBarHeight }}>
        <NavBar />
      </Box>
      <ScheduleCalendar navBarHeight={navBarHeight} />
    </Box>

  );
}

export default App;
