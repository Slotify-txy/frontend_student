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
        response.map(({ id, startAt, endAt, status }) => ({
          // id: uuidv4(),
          id,
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
      query: ({ slots }) => ({
        url: `/slot`,
        method: 'POST',
        body: slots,
      }),
      invalidatesTags: [{ type: 'Slots', id: 'LIST' }],
    }),
    // deleteSlots: builder.mutation({
    //   query: ({ studentId, coachId }) => ({
    //     url: `/slot/student/${studentId}/coach/${coachId}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: (result, error, id) => [{ type: 'Slots', id }],
    // }),
    deleteSlotById: builder.mutation({
      query: (id) => ({
        url: `/slot/${id}`,
        method: 'DELETE',
        responseHandler: (response) => response.text(), // by default, rtk query receives json response
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Slots', id }],
    }),
    updateSlotStatusById: builder.mutation({
      query: ({ id, status }) => ({
        url: `/slot/${id}?status=${status}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Slots', id }],
    }),
  }),
});

export const {
  useGetSlotsQuery,
  useCreateSlotsMutation,
  useDeleteSlotsMutation,
  useDeleteSlotByIdMutation,
  useUpdateSlotStatusByIdMutation,
} = slotApiSlice;
