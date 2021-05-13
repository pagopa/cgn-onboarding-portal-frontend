/* eslint-disable functional/immutable-data */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { identity } from "fp-ts/lib/function";
import Api from '../../api/index';
import { Agreement } from '../../api/generated';

export const createAgreement = createAsyncThunk('agreement/createStatus', async () => 
await tryCatch(() => Api.Agreement.createAgreement(), toError)
	.map(response => response.data)
	.fold(
		() => void 0,
		identity
	).run()
);


interface ExtendedAgreement extends Agreement {
    startDate?: string;
    endDate?: string;
}

interface AgreementState {
	value: ExtendedAgreement;
	loading: boolean;
}

export const agreementSlice = createSlice({
	name: 'agreement',
	initialState: { value: {}, loading: true } as AgreementState,
	reducers: {
		setImage: (state, action) => {
			state.value.imageUrl = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(createAgreement.pending, (state, action) => {
			state.loading = true;
		});
		builder.addCase(createAgreement.fulfilled, (state, action) => {
			if (action.payload) {
				state.value = action.payload;
			}
			state.loading = false;
		});
		builder.addCase(createAgreement.rejected, (state, action) => {
			state.loading = false;
		});
	}
});

export const { setImage } = agreementSlice.actions;

export default agreementSlice.reducer;
