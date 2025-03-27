import {
  Avatar,
  Box,
  Button,
  ClickAwayListener,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Popper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { logout } from '../../features/auth/authSlice';
import EventAction from '../EventAction';
import { enqueueSnackbar } from 'notistack';
import { useGetCoachesQuery } from '../../app/services/coachApiSlice';
import AUTH_STATUS from '../../common/constants/authStatus';
import { blue, green } from '@mui/material/colors';
import {
  useAddCoachToUserMutation,
  useUpdateUserMutation,
} from '../../app/services/userApiSlice';

export const Profile = () => {
  const { user, status } = useSelector((state) => state.auth);

  const [addCoachToUser, { isLoading: isAddingCoachToStudent }] =
    useAddCoachToUserMutation();
  const [updateUser, { isLoading: isUpdatingStudent }] =
    useUpdateUserMutation();
  const { data: coaches } = useGetCoachesQuery(
    { studentId: user?.id },
    {
      skip: status != AUTH_STATUS.AUTHENTICATED || user == null,
    }
  );
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectOpen, setSelectOpen] = useState(false);
  const [invitationCode, setInvitationCode] = useState('');
  const [defaultCoachId, setDefaultCoachId] = useState('');
  useEffect(() => {
    if (user?.defaultCoachId) {
      setDefaultCoachId(user?.defaultCoachId);
    }
  }, [user?.defaultCoachId]);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logout());
  };

  const handleClose = () => {
    if (!selectOpen) {
      setAnchorEl(null);
      setDefaultCoachId(user?.defaultCoachId);
    }
  };

  const addCoach = useCallback(async () => {
    try {
      await addCoachToUser({ id: user?.id, invitationCode }).unwrap();
      enqueueSnackbar('Coach added successfully!', {
        variant: 'success',
      });
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
  }, [invitationCode]);

  const changeDefaultCoach = useCallback(async () => {
    try {
      await updateUser({ student: { ...user, defaultCoachId } }).unwrap();
      enqueueSnackbar('Default coach changed successfully!', {
        variant: 'success',
      });
    } catch (err) {
      enqueueSnackbar('Failed to changed the default coach.', {
        variant: 'error',
      });
    }
  }, [defaultCoachId]);

  const open = Boolean(anchorEl);

  return (
    <Fragment>
      <IconButton onClick={handleClick}>
        <Avatar alt={user?.name} src={user?.picture} />
      </IconButton>
      <Popper open={open} anchorEl={anchorEl}>
        <IconButton
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            sx={{
              width: 300,
              py: 3,
              px: 5,
              backgroundColor: '#e9eef6',
              borderRadius: 8,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  sx={{
                    mb: 2,
                    color: '#1F1F1F',
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {user?.email}
                </Typography>
              </Box>

              <Avatar
                alt={user?.name}
                src={user?.picture}
                sx={{ mb: 1, width: 80, height: 80 }}
              />

              <Typography sx={{ fontSize: 22, fontWeight: 400, mb: 2 }}>
                Hi, {user?.name}!
              </Typography>

              {/* Add coach */}
              <Stack
                direction="row"
                spacing={2}
                alignItems={'center'}
                sx={{ width: '100%', mb: 2 }}
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

              {/* Coach selection */}
              {coaches && coaches.length > 0 && (
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems={'center'}
                  sx={{ width: '100%', mb: 2 }}
                >
                  <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="default-coach-selection-label">
                      Default Coach
                    </InputLabel>
                    <Select
                      labelId="default-coach-selection-label"
                      id="default-coach-selection"
                      value={defaultCoachId}
                      label="Default Coach"
                      onChange={(e) => setDefaultCoachId(e.target.value)}
                      onOpen={() => setSelectOpen(true)}
                      MenuProps={{
                        TransitionProps: {
                          onExited: () => setSelectOpen(false),
                        },
                      }}
                      size="small"
                    >
                      {(coaches ?? []).map((coach) => (
                        <MenuItem value={coach.id} key={coach.id}>
                          {coach.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <EventAction
                    title="Change Default Coach"
                    color={green[700]}
                    onClick={changeDefaultCoach}
                    Icon={CheckBoxIcon}
                    fontSize={28}
                    disabled={user?.defaultCoachId === defaultCoachId}
                    isLoading={isUpdatingStudent}
                  />
                </Stack>
              )}

              {/* Sign out */}
              <Button
                startIcon={<LogoutIcon />}
                sx={{
                  width: '90%',
                  borderRadius: 4,
                  color: '#202224',
                  backgroundColor: '#F8FAFD',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#e7e8ec',
                    boxShadow: 'none',
                  },
                }}
                onClick={handleLogout}
              >
                <Typography
                  sx={{ fontSize: 14, color: '#1F1F1F', fontWeight: 500 }}
                >
                  Sign out
                </Typography>
              </Button>
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Fragment>
  );
};
