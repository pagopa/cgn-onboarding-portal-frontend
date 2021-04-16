/* eslint-disable functional/immutable-data */
import { createAsyncThunk, createEntityAdapter, createSlice, SerializedError } from '@reduxjs/toolkit';
import Api from '../../api';
import { Agreement } from '../../api/generated';
import store from '../store';

enum STATUS {
	IDLE = 'IDLE',
	PENDING = 'PENDING'
}

type RequestState = {
	loading: STATUS.IDLE | STATUS.PENDING;
	loadError: SerializedError | null;
};

const createAgreement = createAsyncThunk('agreement/createAgreement', async () => {
	const response = await Api.Agreement.createAgreement();
	return response.data;
});

export const agreementAdapter = createEntityAdapter<Agreement>();

const agreementSlice = createSlice({
	name: 'agreement',
	initialState: agreementAdapter.getInitialState<RequestState>({
		loading: STATUS.IDLE,
		loadError: null
	}),
	reducers: {
		setAgreement: (state, action) => {
			state;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(createAgreement.pending, (state) => {
			state.loading = STATUS.PENDING;
			state.loadError = null;
		});
		builder.addCase(createAgreement.fulfilled, (state, action) => {
			agreementAdapter.addOne(state, action.payload);
			state.loading = STATUS.IDLE;
			state.loadError = null;
		});
		builder.addCase(createAgreement.rejected, (state, action) => {
			state.loading = STATUS.IDLE;
			state.loadError = action.error;
		});
	}
});

type RootState = ReturnType<typeof store.getState>;

export const agreementSelectors = agreementAdapter.getSelectors<RootState>((state) => state.agreement);

export const { setAgreement } = agreementSlice.actions;

export default agreementSlice.reducer;
