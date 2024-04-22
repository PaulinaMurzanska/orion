import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { FileObjectType } from '../../src/bom/bom-parts/type';
import { initialFile } from './bomInitialStates';
import { nanoid } from 'nanoid';

const idInitial = nanoid(8);
const initialObject = { ...initialFile };
initialObject.id = idInitial;

type BomState = {
  fileUploadProgress: boolean;
  uploadedFilesArr: FileObjectType[];
  disableBeginBtn: boolean;
  disableDragDrop: boolean;
};

const initialState: BomState = {
  fileUploadProgress: false,
  uploadedFilesArr: [{ ...initialObject }],
  disableBeginBtn: false,
  disableDragDrop: true,
};

const bomSlice = createSlice({
  name: 'bom',
  initialState,
  reducers: {
    setFileUploadProgress(state, action: PayloadAction<boolean>) {
      state.fileUploadProgress = action.payload;
    },
    setDisableBeginBtn(state, action: PayloadAction<boolean>) {
      state.disableBeginBtn = action.payload;
    },
    setDisableDragDrop(state, action: PayloadAction<boolean>) {
      state.disableDragDrop = action.payload;
    },
    setUploadedFilesArr(state, action: PayloadAction<FileObjectType[]>) {
      state.uploadedFilesArr = action.payload;
    },
    updateFilePositions(state) {
      state.uploadedFilesArr = state.uploadedFilesArr.map((file, index) => ({
        ...file,
        currentPosition: index + 1,
      }));
    },

    updateFileDetails(state, action: PayloadAction<FileObjectType>) {
      const { id, ...restOfUpdates } = action.payload;
      const index = state.uploadedFilesArr.findIndex((file) => file.id === id);
      if (index !== -1) {
        state.uploadedFilesArr[index] = {
          ...state.uploadedFilesArr[index],
          ...restOfUpdates,
        };
      }
    },
    removeInvalidFiles(state) {
      state.uploadedFilesArr = state.uploadedFilesArr.filter(
        (file) => file.fileId && file.fileAdded !== false
      );
    },
  },
});

export const {
  setFileUploadProgress,
  setUploadedFilesArr,
  updateFilePositions,
  updateFileDetails,
  setDisableBeginBtn,
  removeInvalidFiles,
  setDisableDragDrop,
} = bomSlice.actions;
export default bomSlice.reducer;
