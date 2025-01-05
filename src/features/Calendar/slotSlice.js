import { createSelector } from '@reduxjs/toolkit';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { slotApiSlice as slotApi } from '../../app/services/slotApiSlice';

const moment = extendMoment(Moment);

export const selectSlotsResult = slotApi.endpoints.getSlots.select({
  coachId: 10,
  studentId: 10,
});
