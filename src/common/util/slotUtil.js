import Moment from 'moment';
import { extendMoment } from 'moment-range';
import * as SlotStatusConstants from '../../common/constants/slotStatus';

const moment = extendMoment(Moment);

export const convertSlots = (data) => {
  return data.map((slot) => {
    const { start, end } = slot;
    return {
      ...slot,
      start: moment(start).toDate(),
      end: moment(end).toDate(),
    };
  });
};

export const convertStatusToText = (status) => {
  return status
    .split('_')
    .map((status) => status.charAt(0) + status.slice(1).toLowerCase())
    .join(' ');
};

// check if the calendar's slot is within the open hours
export const isOpenHour = (openHours, date) =>
  openHours.some(
    (openHour) =>
      date.isSameOrAfter(moment(openHour.start), 'minute') &&
      date.isBefore(moment(openHour.end), 'minute')
  );

// check if the selected slot is within the open hours
export const isAvailable = (combinedOpenHours, start, end) => {
  const range = moment.range(moment(start), moment(end));
  return combinedOpenHours.some((openHour) => {
    const intersection = openHour.intersect(range);
    return intersection != null && intersection.isSame(range);
  });
};

/**
 *
 * @param {*} id `undefined` when selecting slots to form an event
 */
// check if the slot will overlaps with existing slots
export const isOverlapped = (slots, start, end, id = undefined) => {
  return slots.some((slot) => {
    if (id && slot.id === id) {
      return false;
    }
    const range1 = moment.range(start, end);
    const range2 = moment.range(moment(slot.start), moment(slot.end));
    return range1.overlaps(range2);
  });
};

export const combineOpenHours = (openHours) => {
  openHours = openHours ?? [];
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
};

export const getStatusColor = (status) => {
  switch (status) {
    case SlotStatusConstants.AVAILABLE:
      return '#039BE5';
    case SlotStatusConstants.SCHEDULING:
      return '#f6bf26';
    case SlotStatusConstants.PUBLISHED:
      return '#33b679';
    case SlotStatusConstants.PLANNING:
      return '#7986cb';
    default:
      return '';
  }
};
