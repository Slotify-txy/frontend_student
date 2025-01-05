import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Box, IconButton, Tooltip } from '@mui/material';
import { green, grey } from '@mui/material/colors';
import moment from 'moment-timezone';
import React from 'react';
import {
  useCreateSlotsMutation,
  useDeleteSlotsMutation,
} from '../../app/services/slotApiSlice';
import * as SlotStatusConstants from '../../common/constants/slotStatus';

const timeFormat = 'YYYY-MM-DD[T]HH:mm:ss';

export const ActionBar = ({ availableSlots, setAvailableSlots }) => {
  // const { data: slots } = useGetSlotsQuery({ studentId: 10, coachId: 10 });
  const [createSlots, { isLoading: isCreatingSlots }] =
    useCreateSlotsMutation();
  const [deleteSlots, { isLoading: isDeletingSlots }] =
    useDeleteSlotsMutation();

  const schedule = async () => {
    try {
      await createSlots({
        studentId: 10,
        coachId: 10,
        slots: availableSlots.map(({ start, end }) => {
          if (start <= Date.now()) {
            return;
          }
          return {
            startAt: moment(start).format(timeFormat),
            endAt: moment(end).format(timeFormat),
            status: SlotStatusConstants.SCHEDULING,
          };
        }),
      }).unwrap();
      setAvailableSlots([]);
    } catch (error) {
      console.log('error', error);
    }
  };

  const clearSlots = () => {
    setAvailableSlots([]);
  };

  return (
    <Box sx={{ pt: 2 }}>
      <Action
        color={green[700]}
        icon={<CheckBoxIcon />}
        tooltip={'Schedule'}
        callback={schedule}
      />
      <Action
        color={grey[700]}
        icon={<DeleteForeverIcon />}
        tooltip={'Clear'}
        callback={clearSlots}
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
