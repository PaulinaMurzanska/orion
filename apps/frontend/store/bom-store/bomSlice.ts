import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { FileObjectType } from '../../src/bom/bom-parts/type';
import { initialFile } from './bomInitialStates';
import { nanoid } from 'nanoid';

const idInitial = nanoid(8);
const initialObject = { ...initialFile };
initialObject.id = idInitial;

type UpdateLoadingPayload = {
  id: any;
  fileLoading: boolean;
  loaderText: string;
};

type BomState = {
  fileUploadProgress: boolean;
  uploadedFilesArr: FileObjectType[];
};

const initialState: BomState = {
  fileUploadProgress: false,
  uploadedFilesArr: [{ ...initialObject }],
};

const bomSlice = createSlice({
  name: 'bom',
  initialState,
  reducers: {
    setFileUploadProgress(state, action: PayloadAction<boolean>) {
      state.fileUploadProgress = action.payload;
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
    updateFilesLoading(
      state,
      action: PayloadAction<{ updates: UpdateLoadingPayload[] }>
    ) {
      action.payload.updates.forEach((update) => {
        const index = state.uploadedFilesArr.findIndex(
          (file) => file.id === update.id
        );
        if (index !== -1) {
          state.uploadedFilesArr[index] = {
            ...state.uploadedFilesArr[index],
            fileLoading: update.fileLoading,
            loaderText: update.loaderText,
          };
        }
      });
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
  },
});

export const {
  setFileUploadProgress,
  setUploadedFilesArr,
  updateFilePositions,
  updateFilesLoading,
  updateFileDetails,
} = bomSlice.actions;
export default bomSlice.reducer;
