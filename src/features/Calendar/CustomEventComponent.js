import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import moment from 'moment-timezone';
import React, { useCallback, useState } from 'react';
import SLOT_STATUS from '../../common/constants/slotStatus';
import {
  convertStatusToText,
  getDisplayedTime,
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
import { enqueueSnackbar } from 'notistack';
import { deleteConfirmationAction } from '../../components/DeleteConfirmationAction';

const CustomEventComponent = ({ event, setPlanningSlots }) => {
  const { start, end, status } = event;
  const [onHover, setOnHover] = useState(false);
  const backgroundColor = getStatusColor(status);
  const [deleteSlotById, { isLoading: isDeletingSlot }] =
    useDeleteSlotByIdMutation();
  const [updateSlotStatusById, { isLoading: isUpdatingSlot }] =
    useUpdateSlotStatusByIdMutation();

  const deleteSlot = useCallback(() => {
    switch (event.status) {
      case SLOT_STATUS.PLANNING:
        setPlanningSlots((prev) => prev.filter((slot) => slot.id !== event.id));
        break;
      case SLOT_STATUS.AVAILABLE:
      case SLOT_STATUS.CANCELLED:
      case SLOT_STATUS.REJECTED:
        enqueueSnackbar('Are you sure you want to delete it?', {
          variant: 'info',
          autoHideDuration: null,
          action: deleteConfirmationAction(async () => {
            try {
              await deleteSlotById(event.id).unwrap();
              enqueueSnackbar('Deleted successfully!', {
                variant: 'success',
              });
            } catch (err) {
              let prompt = `Failed to delete it. `;
              if (err.status === 409) {
                prompt +=
                  'The status is not up to date. Latest status fetched. ';
              } else {
                prompt += JSON.parse(err.data).message;
              }
              enqueueSnackbar(prompt, {
                variant: 'error',
              });
            }
          }),
        });
        break;
    }
  }, [event, setPlanningSlots]);

  const accept = useCallback(() => {
    enqueueSnackbar('Are you sure you want to accept the class invitation?', {
      variant: 'info',
      autoHideDuration: null,
      action: deleteConfirmationAction(async () => {
        try {
          await updateSlotStatusById({
            id: event.id,
            status: SLOT_STATUS.APPOINTMENT,
          }).unwrap();
          enqueueSnackbar('Class scheduled successfully!', {
            variant: 'success',
          });
        } catch (err) {
          let prompt = 'Failed to accept the class invitation. ';
          if (err.status === 409) {
            prompt += 'The status is not up to date. Latest status fetched. ';
          } else {
            prompt += JSON.parse(err.data).message;
          }
          enqueueSnackbar(prompt, {
            variant: 'error',
          });
        }
      }),
    });
  }, [event]);

  const reject = useCallback(() => {
    enqueueSnackbar('Are you sure you want to reject the class invitation?', {
      variant: 'info',
      autoHideDuration: null,
      action: deleteConfirmationAction(async () => {
        try {
          await updateSlotStatusById({
            id: event.id,
            status: SLOT_STATUS.REJECTED,
          }).unwrap();
          enqueueSnackbar('Invitation rejected successfully!', {
            variant: 'success',
          });
        } catch (err) {
          let prompt = 'Failed to reject the class invitation. ';
          if (err.status === 409) {
            prompt += 'The status is not up to date. Latest status fetched. ';
          } else {
            prompt += JSON.parse(err.data).message;
          }
          enqueueSnackbar(prompt, {
            variant: 'error',
          });
        }
      }),
    });
  }, [event]);

  const cancel = useCallback(() => {
    enqueueSnackbar('Are you sure you want to cancel the class?', {
      variant: 'info',
      autoHideDuration: null,
      action: deleteConfirmationAction(async () => {
        try {
          await updateSlotStatusById({
            id: event.id,
            status: SLOT_STATUS.CANCELLED,
          }).unwrap();
          enqueueSnackbar('Class cancelled successfully!', {
            variant: 'success',
          });
        } catch (err) {
          let prompt = 'Failed to cancel the class. ';
          if (err.status === 409) {
            prompt += 'The status is not up to date. Latest status fetched. ';
          } else {
            prompt += JSON.parse(err.data).message;
          }
          enqueueSnackbar(prompt, {
            variant: 'error',
          });
        }
      }),
    });
  }, [event]);

  const buildEventAction = useCallback(() => {
    switch (status) {
      case SLOT_STATUS.PLANNING:
      case SLOT_STATUS.AVAILABLE:
      case SLOT_STATUS.CANCELLED:
      case SLOT_STATUS.REJECTED:
        return (
          <EventAction
            title="Delete"
            onClick={deleteSlot}
            Icon={DeleteIcon}
            isLoading={isDeletingSlot}
          />
        );
      case SLOT_STATUS.PENDING:
        return (
          <Stack direction="row">
            <EventAction
              title="Accept"
              onClick={accept}
              Icon={ThumbUpAltIcon}
              isLoading={isUpdatingSlot}
            />

            <EventAction
              title="Reject"
              onClick={reject}
              Icon={ThumbDownIcon}
              isLoading={isUpdatingSlot}
            />
          </Stack>
        );
      case SLOT_STATUS.APPOINTMENT:
        return (
          <EventAction
            title="Cancel"
            onClick={cancel}
            Icon={CancelIcon}
            isLoading={isUpdatingSlot}
          />
        );
    }
  }, [status, deleteSlot, reject, cancel]);

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
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {convertStatusToText(status)}
          {event.classId && ` - #${event.classId?.slice(-4)}`}
        </Typography>

        {
          // todo: make ui better
          onHover && buildEventAction()
        }
      </Box>
      <Typography sx={{ fontSize: 12 }}>
        {getDisplayedTime(start, end)}
      </Typography>
    </Box>
  );
};

export default CustomEventComponent;
