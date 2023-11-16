import { AppThunk } from "@/store";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface useStoreModalInterface {
  isOpen: boolean;
}

const initialState: useStoreModalInterface = {
  isOpen: false,
};

const StoreModalSlice = createSlice({
  name: "storeModal",
  initialState,
  reducers: {
    setIsOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isOpen = payload;
    },
  },
});

export const { setIsOpen } = StoreModalSlice.actions;

const StoreModalReducer = StoreModalSlice.reducer;

export default StoreModalReducer;

export const onOpen = (): AppThunk => (dispatch) => {
  dispatch(setIsOpen(true));
};
export const onClose = (): AppThunk => (dispatch) => {
  dispatch(setIsOpen(false));
};
