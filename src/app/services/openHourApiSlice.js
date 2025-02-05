import { v4 as uuidv4 } from 'uuid';
import SLOT_STATUS from '../../common/constants/slotStatus';
import { api } from './api';

export const openHourApiSlice = api.injectEndpoints({
  reducerPath: 'openHourApi',
  tagTypes: ['OpenHours'],
  endpoints: (builder) => ({
    getOpenHours: builder.query({
      query: ({ coachId }) => `/open-hour/coach/${coachId}`,
      transformResponse: (response) =>
        response.map(({ startAt, endAt }) => ({
          id: uuidv4(),
          start: startAt,
          end: endAt,
          isDraggable: false,
          status: SLOT_STATUS.OPEN_HOUR,
        })),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'OpenHours', id })),
              { type: 'OpenHours', id: 'LIST' },
            ]
          : [{ type: 'OpenHours', id: 'LIST' }],
    }),
    createOpenHours: builder.mutation({
      query: ({ coachId, openHours }) => ({
        url: `/open-hour/coach/${coachId}`,
        method: 'POST',
        body: openHours,
      }),
      invalidatesTags: [{ type: 'OpenHours', id: 'LIST' }],
    }),
    deleteOpenHoursByCoachId: builder.mutation({
      query: ({ coachId }) => ({
        url: `/open-hour/coach/${coachId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'OpenHours', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetOpenHoursQuery,
  useCreateOpenHoursMutation,
  useDeleteOpenHoursByCoachIdMutation,
} = openHourApiSlice;
