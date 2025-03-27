import { slotApiSlice as slotApi } from '../../app/services/slotApiSlice';

export const selectSlotsResult = slotApi.endpoints.getSlots.select({
  coachId: 10,
  studentId: 10,
});
