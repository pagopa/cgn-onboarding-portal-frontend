/* eslint-disable functional/immutable-data */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Profile } from '../../api/generated';
import Api from '../../api/index';

export const getProfile = createAsyncThunk('profile/getProfile', async (profileId: string) => {
	const response = await Api.Profile.getProfile(profileId);
	return response.data;
});

interface ProfileState {
	value: Profile;
	loading: boolean;
}

export const profileSlice = createSlice({
	name: 'profile',
	initialState: { value: {}, loading: false },
	reducers: {}
});

export default profileSlice.reducer;
