import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Route, Routes } from 'react-router';
import { SnackbarProvider } from 'notistack';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Roboto Flex',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      'sans-serif',
    ].join(','),
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <ThemeProvider theme={theme}>
      <React.StrictMode>
        <Provider store={store}>
          <SnackbarProvider
            autoHideDuration={2000}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<App />} />
              </Routes>
            </BrowserRouter>
          </SnackbarProvider>
        </Provider>
      </React.StrictMode>
    </ThemeProvider>
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
