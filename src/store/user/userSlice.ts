/* eslint-disable functional/immutable-data */
import { createSlice } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';

export const userSlice = createSlice({
	name: 'user',
	initialState: { data: {}, loading: true },
	reducers: {
		setUser: (state, action) => {
			state.loading = false;
			state.data = jwt_decode(action.payload);
		},
		setAdmin: (state, action) => {
			state.loading = false;
			state.data = action.payload;
		}
	}
});

export const { setUser, setAdmin } = userSlice.actions;

export default userSlice.reducer;
