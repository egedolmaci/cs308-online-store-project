import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modal: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModal: (state, action) => {
      state.modal = action.payload;
    },
    clearModal: (state) => {
      state.modal = null;
    },
  },
});

export const { setModal, clearModal } = modalSlice.actions;

export default modalSlice.reducer;
