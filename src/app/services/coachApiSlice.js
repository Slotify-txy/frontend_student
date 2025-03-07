import { api } from './api';

export const coachtApiSlice = api.injectEndpoints({
  reducerPath: 'coachApi',
  tagTypes: ['Coaches'],
  endpoints: (builder) => ({
    getCoaches: builder.query({
      query: ({ studentId }) => `/coach/student/${studentId}`,
      transformResponse: (response) =>
        response.map(({ id, name, email, picture }) => ({
          id,
          name,
          email,
          picture,
        })),
      providesTags: ['User'],
    }),
  }),
});

export const { useGetCoachesQuery } = coachtApiSlice;
