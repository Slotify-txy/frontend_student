import { api } from './api';

export const userApiSlice = api.injectEndpoints({
  reducerPath: 'userApi',
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: ({ id }) => `/student/${id}`,
      providesTags: ['User'],
    }),
    addCoachToUser: builder.mutation({
      query: ({ id, invitationCode }) => ({
        url: `/student/${id}?invitation-code=${invitationCode}`,
        method: 'PUT',
        responseHandler: (response) => response.text(), // by default, rtk query receives json response
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ student }) => ({
        url: '/student',
        method: 'PUT',
        body: student,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUserQuery,
  useAddCoachToUserMutation,
  useUpdateUserMutation,
} = userApiSlice;
