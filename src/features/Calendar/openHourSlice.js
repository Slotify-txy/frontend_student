import { createSelector } from '@reduxjs/toolkit';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { openHourApiSlice as openHourApi } from '../../app/services/openHourApiSlice';

const moment = extendMoment(Moment);

export const selectOpenHours = openHourApi.endpoints.getOpenHours.select({
  coachId: 10,
});

export const selectCombinedOpenHours = createSelector(
  selectOpenHours,
  (openHours) => {
    openHours = openHours?.data ?? [];
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
);
