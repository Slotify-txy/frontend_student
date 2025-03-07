import { Box, Typography } from '@mui/material';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndProp from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { useGetOpenHoursQuery } from '../../app/services/openHourApiSlice';
import { useGetSlotsQuery } from '../../app/services/slotApiSlice';
import SLOT_STATUS from '../../common/constants/slotStatus';
import {
  combineOpenHours,
  convertSlots,
  isAvailable,
  isOpenHour,
  isOverlapped,
} from '../../common/util/slotUtil';
import CustomEventComponent from './CustomEventComponent';
import StyledCalendar from '../../components/StyledCalendar';
import AUTH_STATUS from '../../common/constants/authStatus';
import { enqueueSnackbar } from 'notistack';

const moment = extendMoment(Moment);
const localizer = momentLocalizer(Moment);
const timeFormat = 'YYYY-MM-DD[T]HH:mm:ss';
const DnDCalendar = withDragAndProp(Calendar);

export default function ScheduleCalendar({
  planningSlots,
  setPlanningSlots,
  setCalendarRange,
  calendarView,
  setCalendarView,
  calendarDate,
  setCalendarDate,
}) {
  const { user, status } = useSelector((state) => state.auth);

  const {
    data: slots,
    isFetching,
    isSuccess,
  } = useGetSlotsQuery(
    { studentId: user?.id, coachId: user?.defaultCoachId },
    {
      selectFromResult: (result) => {
        result.data = convertSlots(result.data ?? []);
        return result;
      },
      skip:
        status != AUTH_STATUS.AUTHENTICATED ||
        user == null ||
        user?.defaultCoachId == null,
    }
  );

  const {
    data: openHours,
    isFetching: isFetchingOpenHours,
    isSuccess: isOpenHoursSuccess,
  } = useGetOpenHoursQuery(
    { coachId: user?.defaultCoachId },
    {
      skip:
        status != AUTH_STATUS.AUTHENTICATED ||
        user == null ||
        user?.defaultCoachId == null,
    }
  );

  const combinedOpenHours = useMemo(
    () => combineOpenHours(openHours),
    [openHours]
  );

  useEffect(() => {
    console.log('slots', slots);
  }, [slots]);
  // useEffect(() => {
  //   console.log('availableSlots', planningSlots);
  // }, [planningSlots]);

  const onChangeSlotTime = useCallback(
    (start, end, id) => {
      if (!isAvailable(combinedOpenHours, start, end)) {
        enqueueSnackbar("Not in the coach's open hours!", {
          variant: 'warning',
        });
        return;
      }
      if (isOverlapped([...slots, ...planningSlots], start, end, id)) {
        enqueueSnackbar("Slots can't be overlapped!", {
          variant: 'warning',
        });
        return;
      }

      setPlanningSlots((prev) => {
        let slot = prev.find((slot) => slot.id === id);
        slot.start = start;
        slot.end = end;
        return prev;
      });
    },
    [slots, planningSlots]
  );

  const onSelect = useCallback(
    (start, end) => {
      if (!isAvailable(combinedOpenHours, start, end)) {
        enqueueSnackbar("Not in the coach's open hours!", {
          variant: 'warning',
        });
        return;
      }
      if (isOverlapped([...slots, ...planningSlots], start, end)) {
        enqueueSnackbar("Slots can't be overlapped!", {
          variant: 'warning',
        });
        return;
      }
      setPlanningSlots((prev) => [
        ...prev,
        {
          id: uuidv4(),
          start: start,
          end: end,
          status: SLOT_STATUS.PLANNING,
          isDraggable: true,
        },
      ]);
    },
    [slots, combinedOpenHours, planningSlots]
  );

  const slotPropGetter = useCallback(
    (date) => {
      if (isOpenHoursSuccess) {
        return {
          ...(!isOpenHour(openHours, moment(date)) && {
            style: {
              backgroundColor: 'rgba(0, 0, 0, 0.03)',
              borderTop: 'none',
            },
          }),
        };
      }
    },
    [openHours, isOpenHoursSuccess]
  );

  return (
    <Box style={{ height: '100%' }}>
      <StyledCalendar
        events={[...planningSlots, ...slots]}
        date={calendarDate}
        view={calendarView}
        onEventDrop={({ start, end, event }) => {
          if (start.getDay() === end.getDay()) {
            onChangeSlotTime(start, end, event.id);
          }
        }}
        onEventResize={({ start, end, event }) => {
          onChangeSlotTime(start, end, event.id);
        }}
        onSelectSlot={({ start, end }) => {
          onSelect(start, end);
        }}
        slotPropGetter={slotPropGetter}
        createCustomEventComponent={(props) => (
          <CustomEventComponent
            setPlanningSlots={setPlanningSlots}
            {...props}
          />
        )}
      />
    </Box>
  );
}
