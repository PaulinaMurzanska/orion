import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface BomCombinedArrayObjectType {
  [key: string]: any;
}

const initialState: BomCombinedArrayObjectType[] = [];

const bomImportFilesSlice = createSlice({
  name: 'bomImportFiles',
  initialState,
  reducers: {
    setBomImportFiles: (
      state,
      action: PayloadAction<BomCombinedArrayObjectType[]>
    ) => {
      return action.payload;
    },
  },
});

export const { setBomImportFiles } = bomImportFilesSlice.actions;

export default bomImportFilesSlice.reducer;
