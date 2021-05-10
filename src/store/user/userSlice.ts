/* eslint-disable functional/immutable-data */
import { createSlice } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';

export const userSlice = createSlice({
	name: 'user',
	initialState: { data: {}, type: '', loading: true },
	reducers: {
		setUser: (state, action) => {
			const decoded = jwt_decode(action.payload) as any;
			state.loading = false;
			state.data = decoded;
			state.type = decoded.iss === 'SPID' ? 'USER' : 'ADMIN';
		},
		setCompany: (state, action) => {
			state.data = {
				...state.data,
				companies: state.data.companies.map((c) => ({...c, active: c.organization_fiscal_code === action.payload}))
			};
		},
	}
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
