import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Box, IconButton, Tooltip } from '@mui/material';
import { green, grey } from '@mui/material/colors';
import moment from 'moment-timezone';
import React, { useCallback } from 'react';
import {
  useCreateSlotsMutation,
  useDeleteSlotsMutation,
} from '../../app/services/slotApiSlice';
import SLOT_STATUS from '../../common/constants/slotStatus';
import { useSelector } from 'react-redux';

const timeFormat = 'YYYY-MM-DD[T]HH:mm:ss';

export const ActionBar = ({ planningSlots, setPlanningSlots }) => {
  const { user } = useSelector((state) => state.auth);
  const [createSlots, { isLoading: isCreatingSlots }] =
    useCreateSlotsMutation();

  const schedule = useCallback(async () => {
    try {
      await createSlots({
        slots: planningSlots
          .filter(({ start }) => start > Date.now())
          .map(({ start, end }) => ({
            studentId: user?.id,
            coachId: user?.defaultCoachId,
            startAt: moment(start).format(timeFormat),
            endAt: moment(end).format(timeFormat),
            status: SLOT_STATUS.AVAILABLE,
          })),
      }).unwrap();
      setPlanningSlots([]);
    } catch (error) {
      console.log('error', error);
    }
  }, [planningSlots]);

  const clearSlots = useCallback(() => {
    setPlanningSlots([]);
  }, []);

  return (
    <Box sx={{ pt: 2 }}>
      <Action
        color={green[700]}
        icon={<CheckBoxIcon />}
        tooltip={'Schedule'}
        callback={schedule}
        disabled={planningSlots.length === 0}
      />
      <Action
        color={grey[700]}
        icon={<DeleteForeverIcon />}
        tooltip={'Clear'}
        callback={clearSlots}
        disabled={planningSlots.length === 0}
      />
    </Box>
  );
};

const Action = ({ color, icon, tooltip, callback, disabled = false }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        mb: 2,
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <Tooltip
        title={tooltip}
        placement="top"
        slotProps={{
          popper: {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, -14],
                },
              },
            ],
          },
        }}
      >
        <span>
          <IconButton sx={{ color }} onClick={callback} disabled={disabled}>
            {icon}
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};
