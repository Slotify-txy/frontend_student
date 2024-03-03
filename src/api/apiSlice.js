import { FormatColorResetSharp } from '@mui/icons-material';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { v4 as uuidv4 } from 'uuid';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/v1' }),
    tagTypes: ['Slot', 'Appointment'],
    endpoints: (builder) => ({
        getSlots: builder.query({
            query: ({ studentId, coachId }) => `/slot/${studentId}/${coachId}`,
            transformResponse: (response) => (
                response.map(({ startAt, endAt, status }) => (
                    {
                        id: uuidv4(),
                        start: startAt,
                        end: endAt,
                        status,
                        isDraggable: false
                    }
                ))
            ),
            providesTags: ['Slot'],
        }),
        createSlots: builder.mutation({
            query: ({ studentId, coachId, slots }) => ({
                url: `/slot/${studentId}/${coachId}`,
                method: 'POST',
                body: slots,
            }),
            invalidatesTags: ['Slot'],
        }),
        deleteSlots: builder.mutation({
            query: ({ studentId, coachId }) => ({
                url: `/slot/${studentId}/${coachId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Slot'],
        }),
    }),
})

export const { useGetSlotsQuery, useCreateSlotsMutation, useDeleteSlotsMutation } = apiSlice