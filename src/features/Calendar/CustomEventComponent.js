import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import moment from 'moment-timezone';
import React, { useCallback, useState } from 'react';
import SLOT_STATUS from '../../common/constants/slotStatus';
import {
  convertStatusToText,
  getStatusColor,
} from '../../common/util/slotUtil';
import {
  useDeleteSlotByIdMutation,
  useUpdateSlotStatusByIdMutation,
} from '../../app/services/slotApiSlice';
import EventAction from '../../components/EventAction';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CancelIcon from '@mui/icons-material/Cancel';

const CustomEventComponent = ({ event, setPlanningSlots }) => {
  const start = moment(event.start).format('hh:mm A');
  const end = moment(event.end).format('hh:mm A');
  const status = event.status;
  const [onHover, setOnHover] = useState(false);
  const backgroundColor = getStatusColor(status);
  const [deleteSlotById] = useDeleteSlotByIdMutation();
  const [updateSlotStatusById] = useUpdateSlotStatusByIdMutation();

  const deleteSlot = useCallback(() => {
    switch (event.status) {
      case SLOT_STATUS.PLANNING:
        setPlanningSlots((prev) => prev.filter((slot) => slot.id !== event.id));
        break;
      case SLOT_STATUS.AVAILABLE:
        deleteSlotById(event.id);
        break;
    }
  }, [event, setPlanningSlots]);

  const confirm = useCallback(() => {
    updateSlotStatusById({ id: event.id, status: SLOT_STATUS.APPOINTMENT });
  }, [event]);

  const reject = useCallback(() => {
    updateSlotStatusById({ id: event.id, status: SLOT_STATUS.REJECTED });
  }, [event]);

  const cancel = useCallback(() => {
    updateSlotStatusById({ id: event.id, status: SLOT_STATUS.CANCELLED });
  }, [event]);

  return (
    <Box
      sx={{
        height: '100%',
        paddingX: '0.3rem',
        overflow: 'hidden',
        backgroundColor: backgroundColor,
        borderRadius: '8px',
      }}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {convertStatusToText(status)}
        </Typography>

        {
          // todo: make ui better
          onHover &&
            (() => {
              switch (status) {
                case SLOT_STATUS.PLANNING:
                case SLOT_STATUS.AVAILABLE:
                  return (
                    <EventAction
                      title="Delete"
                      onClick={deleteSlot}
                      Icon={DeleteIcon}
                    />
                  );
                case SLOT_STATUS.PENDING:
                  return (
                    <Stack direction="row">
                      <EventAction
                        title="Schedule"
                        onClick={confirm}
                        Icon={ThumbUpAltIcon}
                      />

                      <EventAction
                        title="Reject"
                        onClick={reject}
                        Icon={ThumbDownIcon}
                      />
                    </Stack>
                  );
                case SLOT_STATUS.APPOINTMENT:
                  return (
                    <EventAction
                      title="Cancel"
                      onClick={cancel}
                      Icon={CancelIcon}
                    />
                  );
              }
            })()
        }
      </Box>
      <Typography sx={{ fontSize: 13 }}>
        {start} - {end}
      </Typography>
    </Box>
  );
};

export default CustomEventComponent;
