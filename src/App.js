import { Box } from '@mui/material';
import React from 'react';
import './App.css';
import { NavBar } from './components/NavBar/NavBar';
import SchedulePage from './features/Calendar/SchedulePage';

function App() {
  const navBarHeight = 70;

  return (
    <Box sx={{ height: '100vh' }}>
      <Box sx={{ height: navBarHeight }}>
        <NavBar />
      </Box>
      <SchedulePage navBarHeight={navBarHeight} />
    </Box>
  );
}

export default App;
