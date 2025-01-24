import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { v4 as uuidv4 } from 'uuid';
import { api } from './api';

const moment = extendMoment(Moment);

export const slotApiSlice = api.injectEndpoints({
  reducerPath: 'slotsApi',
  tagTypes: ['Slots'],
  endpoints: (builder) => ({
    getSlots: builder.query({
      query: ({ studentId, coachId }) =>
        `/slot/student/${studentId}/coach/${coachId}`,
      transformResponse: (response) =>
        response.map(({ startAt, endAt, status }) => ({
          id: uuidv4(),
          start: startAt, // can't do `moment(startAt).toDate(),` because redux doesn't store date object
          end: endAt,
          status,
          isDraggable: false,
        })),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Slots', id })),
              { type: 'Slots', id: 'LIST' },
            ]
          : [{ type: 'Slots', id: 'LIST' }],
    }),
    createSlots: builder.mutation({
      query: ({ studentId, coachId, slots }) => ({
        url: `/slot/student/${studentId}/coach/${coachId}`,
        method: 'POST',
        body: slots,
      }),
      invalidatesTags: [{ type: 'Slots', id: 'LIST' }],
    }),
    deleteSlots: builder.mutation({
      query: ({ studentId, coachId }) => ({
        url: `/slot/student/${studentId}/coach/${coachId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Slots', id }],
    }),
  }),
});

export const {
  useGetSlotsQuery,
  useCreateSlotsMutation,
  useDeleteSlotsMutation,
} = slotApiSlice;
