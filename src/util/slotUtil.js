import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

export const convertSlots = (data) => {
  console.log(data);
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
