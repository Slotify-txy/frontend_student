import React, { useEffect } from 'react';
import { useLoginMutation } from '../../app/services/authApiSlice';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import { Box } from '@mui/material';
import LoadingSpinner from '../../components/LoadingSpinner';

export function RedirectPage() {
  const [login] = useLoginMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.slice(1));
    const idToken = urlParams.get('id_token');
    const promise = login(idToken);
    promise
      .then(() => navigate('/', { replace: true }))
      .catch(() =>
        enqueueSnackbar('Failed to log in.', {
          variant: 'error',
        })
      );

    // In react 18's dev mode, use effect will be triggered twice, so the first request needs to be aborted when unmounting, but using this code causes users need to log in twice
    // return () => {
    //   promise.abort();
    // };
  }, []);

  return (
    <Box sx={{ height: '100vh' }}>
      <LoadingSpinner />
    </Box>
  );
}

export default RedirectPage;
