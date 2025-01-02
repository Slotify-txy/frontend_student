import { Box } from '@mui/material';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndProp from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { useGetOpenHoursQuery } from '../../app/services/openHourApiSlice';
import {
  slotApiSlice as slotApi,
  useGetSlotsQuery,
} from '../../app/services/slotApiSlice';
import * as SlotStatusConstants from '../../constants/slotStatus';
import {
  convertSlots,
  isAvailable,
  isOpenHour,
  isOverlapped,
} from '../../util/slotUtil';
import CustomEventComponent from './CustomEventComponent';

const moment = extendMoment(Moment);
const localizer = momentLocalizer(Moment);
const timeFormat = 'YYYY-MM-DD[T]HH:mm:ss';
const DnDCalendar = withDragAndProp(Calendar);

export default function ScheduleCalendar({ navBarHeight }) {
  const {
    data: slots,
    isFetching,
    isSuccess,
  } = useGetSlotsQuery({ studentId: 10, coachId: 10 });
  const {
    data: openHours,
    isFetching: isFetchingOpenHours,
    isSuccess: isOpenHoursSuccess,
  } = useGetOpenHoursQuery({ coachId: 10 });

  useEffect(() => {
    console.log('slots', slots);
  }, [slots]);

  const combinedOpenHours = useMemo(() => {
    if (isOpenHoursSuccess) {
      const copy = [];
      openHours.forEach((openHour) => copy.push(openHour));
      copy.sort((a, b) => moment(a.start) - moment(b.start));
      const ranges = copy.map((openHour) =>
        moment.range(moment(openHour.start), moment(openHour.end))
      );
      const ret = [];
      for (let i = 0; i < ranges.length; i++) {
        let range = ranges[i];
        while (i + 1 < ranges.length && range.adjacent(ranges[i + 1])) {
          range = range.add(ranges[i + 1], { adjacent: true });
          i += 1;
        }
        ret.push(range);
      }
      return ret;
    }
  }, [openHours, isOpenHoursSuccess]);

  const dispatch = useDispatch();
  const onChangeSlotTime = useCallback(
    (start, end, id) => {
      if (
        isOverlapped(slots, start, end, id) ||
        !isAvailable(combinedOpenHours, start, end)
      ) {
        // todo: notifications
        return;
      }
      dispatch(
        slotApi.util.updateQueryData(
          'getSlots',
          { studentId: 10, coachId: 10 },
          (slots) => {
            let slot = slots.find((slot) => slot.id === id);
            if (slot) {
              slot.start = moment(start).format(timeFormat);
              slot.end = moment(end).format(timeFormat);
            }
          }
        )
      );
    },
    [slots]
  );

  const onSelect = useCallback(
    (start, end) => {
      if (
        isOverlapped(slots, start, end) ||
        !isAvailable(combinedOpenHours, start, end)
      ) {
        // todo: notifications
        return;
      }
      dispatch(
        slotApi.util.updateQueryData(
          'getSlots',
          { studentId: 10, coachId: 10 },
          (slots) => {
            slots.push({
              id: uuidv4(),
              start: moment(start).format(timeFormat),
              end: moment(end).format(timeFormat),
              status: SlotStatusConstants.AVAILABLE,
              isDraggable: true,
            });
          }
        )
      );
    },
    [slots, combinedOpenHours]
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

  if (isFetching) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box style={{ height: `calc(100% - ${navBarHeight}px)` }}>
      <DnDCalendar
        localizer={localizer}
        events={convertSlots(slots)}
        // timeslots={30}
        // step={1}
        draggableAccessor={'isDraggable'}
        views={['month', 'week']}
        defaultView="week"
        // drilldownView="week"
        onEventDrop={({ start, end, event }) => {
          if (start.getDay() === end.getDay()) {
            onChangeSlotTime(start, end, event.id);
          }
        }}
        onEventResize={({ start, end, event }) => {
          onChangeSlotTime(start, end, event.id);
        }}
        selectable={'true'}
        onSelectSlot={({ start, end }) => {
          onSelect(start, end);
        }}
        // eventPropGetter={(event) => {
        //     const backgroundColor = 'yellow';
        //     return { style: { backgroundColor } }
        // }}
        slotPropGetter={slotPropGetter}
        components={{
          event: CustomEventComponent,
          // eventWrapper: CustomEventWrapper,
          // eventContainerWrapper: MyEventContainerWrapper
          // tooltipAccessor: TooltipAccessor
        }}
      />
    </Box>
  );
}
