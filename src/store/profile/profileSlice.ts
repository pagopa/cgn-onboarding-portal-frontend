/* eslint-disable functional/immutable-data */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toError } from 'fp-ts/lib/Either';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { Profile } from '../../api/generated';
import Api from '../../api/index';

export const getProfile = createAsyncThunk(
	'profile/getProfile',
	async (profileId: string) =>
		await tryCatch(() => Api.Profile.getProfile(profileId), toError).fold(() => void 0, (_) => _.data).run()
);

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
