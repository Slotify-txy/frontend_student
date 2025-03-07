import { api } from './api';

export const studentApiSlice = api.injectEndpoints({
  reducerPath: 'studentApi',
  tagTypes: ['Students'],
  endpoints: (builder) => ({
    addCoachToStudent: builder.mutation({
      query: ({ id, invitationCode }) => ({
        url: `/student/${id}?invitation-code=${invitationCode}`,
        method: 'PUT',
        responseHandler: (response) => response.text(), // by default, rtk query receives json response
      }),
      invalidatesTags: ['User'],
    }),
    updateStudent: builder.mutation({
      query: ({ student }) => ({
        url: '/student',
        method: 'PUT',
        body: student,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useAddCoachToStudentMutation, useUpdateStudentMutation } =
  studentApiSlice;
