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
    updateRecord: (state, action: PayloadAction<any>) => {
      state.records = state.records.map((record) =>
        record.id === action.payload.id ? action.payload : record
      );
    },
    removeRecordById: (state, action: PayloadAction<string>) => {
      state.records = state.records.filter(
        (record) => record.id !== action.payload
      );
    },
    setRecords: (state, action: PayloadAction<any[]>) => {
      state.records = action.payload;
    },
    setColumns: (state, action: PayloadAction<any[]>) => {
      state.columns = action.payload;
    },
  },
});

export const { setRecords, setColumns, updateRecord, removeRecordById } =
  recordsViewSlice.actions;
export default recordsViewSlice.reducer;
