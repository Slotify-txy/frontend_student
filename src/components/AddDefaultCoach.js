import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import EventAction from './EventAction';
import { blue } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import { useAddCoachToStudentMutation } from '../app/services/studentApiSlice';
import { enqueueSnackbar } from 'notistack';

export default function AddDefaultCoach() {
  const { user } = useSelector((state) => state.auth);
  const [openAddDefaultCoachDialog, setOpenAddDefaultCoachDialog] =
    useState(false);
  const [invitationCode, setInvitationCode] = useState('');
  const [addCoachToStudent, { isLoading: isAddingCoachToStudent }] =
    useAddCoachToStudentMutation();
  const handleClose = useCallback(() => {
    setOpenAddDefaultCoachDialog(false);
  }, []);

  const addCoach = useCallback(async () => {
    try {
      await addCoachToStudent({ id: user?.id, invitationCode }).unwrap();
      enqueueSnackbar('Coach added successfully!', {
        variant: 'success',
      });
      setOpenAddDefaultCoachDialog(false);
    } catch (err) {
      enqueueSnackbar(
        `Failed to add the coach. ${err.status === 409 ? 'Coach already added before' : 'Invalid code'} .`,
        {
          variant: 'error',
        }
      );
    } finally {
      setInvitationCode('');
    }
  }, [user, invitationCode]);

  useEffect(() => {
    if (user && user?.defaultCoachId == null) {
      setOpenAddDefaultCoachDialog(true);
    }
  }, [user]);

  return (
    <Dialog open={openAddDefaultCoachDialog} fullWidth maxWidth={'xs'}>
      <DialogTitle>Tada! Welcome to Slotify!</DialogTitle>
      <DialogContent>
        <Typography>
          You haven&apos;t added any coach yet. Add one here.
        </Typography>
        {/* Add coach */}
        <Stack
          direction="row"
          spacing={2}
          alignItems={'center'}
          sx={{ width: '100%', my: 2 }}
        >
          <TextField
            fullWidth
            sx={{ ml: 1, flex: 1 }}
            placeholder="Invitation Code"
            label="Add a coach with invitation code"
            size="small"
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
          />
          <EventAction
            title="Add Coach"
            color={blue[700]}
            onClick={addCoach}
            Icon={AddIcon}
            fontSize={28}
            disabled={
              // invitation code should be 6 digits and only numbers
              invitationCode.length !== 6 || !/^\d+$/.test(invitationCode)
            }
            isLoading={isAddingCoachToStudent}
          />
        </Stack>
        <Typography>Or later in the profile page.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ textTransform: 'none' }}>
          Skip
        </Button>
      </DialogActions>
    </Dialog>
  );
}
