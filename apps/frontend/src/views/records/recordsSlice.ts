import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface RecordsViewSlice {
  records: any[];
  columns: any[];
}

const initialState: RecordsViewSlice = { records: [], columns: [] };

const recordsViewSlice = createSlice({
  name: 'recordsViewSlice',
  initialState,
  reducers: {
    setRecords: (state, action: PayloadAction<any[]>) => {
      state.records = action.payload;
    },
    setColumns: (state, action: PayloadAction<any[]>) => {
      state.columns = action.payload;
    },
  },
});

export const { setRecords, setColumns } = recordsViewSlice.actions;
export default recordsViewSlice.reducer;
