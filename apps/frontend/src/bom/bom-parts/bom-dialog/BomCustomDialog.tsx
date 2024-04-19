import {
  CustomTriggerButton,
  StyledCloseIcon,
  StyledContentWrapper,
  StyledDialog,
  StyledDialogOpen,
  StyledEmail,
  StyledInnerContent,
} from './StyledBomDialog';
import { DndContext, closestCorners } from '@dnd-kit/core';
import {
  setFileUploadProgress,
  setUploadedFilesArr,
  updateFilePositions,
  updateFilesLoading,
} from '../../../../store/bom-store/bomSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';

import BomDialogContent from '../dialog-content/BomDialogContent';
import Icon from '@mdi/react';
import { Icons } from '../../../assets/icons/Icons';
import { RootState } from 'apps/frontend/store';
import WebWorker from '../../../workers/WebWorker?worker&inline';
import { arrayMove } from '@dnd-kit/sortable';
import { getTransactionId } from '../../../helpers/getTransactionId';
import { getUrl } from '@orionsuite/api-client';
import { initialFile } from '../../../../store/bom-store/bomInitialStates';
import { mdiSofaSingle } from '@mdi/js';
import { nanoid } from 'nanoid';
import { setBomImportFiles } from '../../../../store/bom-store/bomImportFilesSlice';

const BomCustomDialog = () => {
  const dispatch = useDispatch();

  const fileUploadProgress = useSelector(
    (state: RootState) => state.bom.fileUploadProgress
  );

  const uploadedFilesArr = useSelector(
    (state: RootState) => state.bom.uploadedFilesArr
  );

  const queryParams = new URLSearchParams(location.search);
  const urlParamId = queryParams.get('id');

  const idInitial = nanoid(8);
  const workerRef = useRef<any>(null);

  const initialObject = { ...initialFile };
  initialObject.id = idInitial;

  const [filesCombined, setFilesCombined] = useState<any[]>([]);

  const getFilePosition = (id: any) =>
    uploadedFilesArr.findIndex((task) => task.id === id);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id === over.id) return;
    const activeObj = uploadedFilesArr.find((obj) => obj.id === active.id);
    const overObj = uploadedFilesArr.find((obj) => obj.id === over.id);
    if (activeObj && overObj) {
      if (activeObj.fileLoading || overObj.fileLoading) {
        alert(
          'File upload is not completed yet, you cannot change the order until the upload is done.'
        );
      } else {
        const originalPosition = getFilePosition(active.id);
        const newPosition = getFilePosition(over.id);
        const newFilesArr = arrayMove(
          uploadedFilesArr,
          originalPosition,
          newPosition
        );
        dispatch(setUploadedFilesArr(newFilesArr));
        dispatch(updateFilePositions());
      }
    }
  };

  const getTransactionVal = async (paramId: any) => {
    console.log(
      'Make a call to API to get the value, it return just temporary value'
    );
    const tempValue = '1304';
    return tempValue;
  };

  const createCombinedFilesArr = async () => {
    dispatch(
      updateFilesLoading({
        updates: uploadedFilesArr.map((file) => ({
          id: file.id,
          fileLoading: true,
          loaderText: 'Adding file to combined array',
        })),
      })
    );

    const combinedItemLines = uploadedFilesArr
      .map((obj) => obj.itemLines)
      .flat();
    setFilesCombined(combinedItemLines);
    dispatch(setBomImportFiles(combinedItemLines));

    const { transactionId, transactionExists } = getTransactionId(urlParamId);

    if (!transactionExists) {
      const transactionVal = await getTransactionVal(3);
      const payload = {
        fileId: transactionVal,
        fileContent: JSON.stringify(combinedItemLines),
        scriptID: 307,
        deploymentID: 1,
      };
      console.log('payload:', payload);
    } else {
      const payload = {
        fileName: transactionId,
        fileContent: JSON.stringify(combinedItemLines),
        scriptID: 292,
        deploymentID: 1,
      };
      console.log('payload:', payload);
      initiateProcessPromise('', payload, null);
    }

    dispatch(
      updateFilesLoading({
        updates: uploadedFilesArr.map((file) => ({
          id: file.id,
          fileLoading: false,
          loaderText: 'files added to array',
        })),
      })
    );
    console.log(
      'The request should be made in this place, temporarily, we are going to save file in global store - not created yet at this point'
    );
  };

  const onImportLines = async () => {
    if (fileUploadProgress) {
      return;
    } else {
      const changedRecords = uploadedFilesArr.filter(
        (file) =>
          file.initialPosition !== file.currentPosition &&
          file.bomRecordID !== null
      );
      dispatch(updateFilePositions());
      dispatch(
        updateFilesLoading({
          updates: uploadedFilesArr.map((file) => ({
            id: file.id,
            fileLoading: true,
            loaderText: 'Adding file to combined array',
          })),
        })
      );

      if (changedRecords.length === 0) {
        createCombinedFilesArr();
      } else {
        const updates = uploadedFilesArr
          .filter(
            (file) =>
              file.initialPosition !== file.currentPosition &&
              file.bomRecordID !== null
          )
          .map((file) => ({
            id: file.id,
            fileLoading: true,
            loaderText: 'The order of the file changed, updating order',
          }));

        if (updates.length > 0) {
          dispatch(updateFilesLoading({ updates }));
        }

        const promises = [];
        for (const [index, file] of changedRecords.entries()) {
          const reorderPayload = {
            action: 'edit',
            custrecord_bom_import_file_import_order: file.currentPosition,
            editID: file.bomRecordID,
            scriptID: 290,
            deploymentID: 1,
          };
          const promise = await initiateProcessPromise(
            'updateNewFilesOrder',
            reorderPayload,
            null
          );
          promises.push(promise);
        }
        try {
          const responses = await Promise.all(promises);

          if (responses) {
            const updates = uploadedFilesArr
              .filter(
                (file) =>
                  file.initialPosition !== file.currentPosition &&
                  file.bomRecordID !== null
              )
              .map((file) => ({
                id: file.id,
                fileLoading: false,
                loaderText: 'The file was updated',
              }));

            if (updates.length > 0) {
              dispatch(updateFilesLoading({ updates }));
            }
            createCombinedFilesArr();
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      }
    }
  };
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleClose = (e: any) => {
    setDialogOpen((dialogOpen) => !dialogOpen);
    if (!dialogOpen) {
      console.log('opening');
    } else {
      console.log('closing');
      if (filesCombined.length > 0) {
        setFilesCombined([]);
        const newArr = [initialObject];
        dispatch(setUploadedFilesArr(newArr));
      }
    }
  };
  const handleRequestError = (message: string, key: string) => {
    const err_msg = `Error on ${key} function: ${message}. We should implement here some action what we want to do if this error appears for this file.`;
    alert(err_msg);
  };

  const initiateProcessPromise = async (
    action: any,
    payload: any,
    defaultData: any
  ) => {
    const script = import.meta.env.VITE_API_DEFAULT_SCRIPT;
    const deploy = import.meta.env.VITE_API_DEFAULT_DEPLOY;

    return new Promise((resolve, reject) => {
      const messageHandler = (e: any) => {
        const { action: responseAction, data, error } = e.data;
        if (responseAction === action) {
          workerRef.current.removeEventListener('message', messageHandler);
          if (error) {
            reject(new Error(data.err_message));
          } else {
            resolve(data);
          }
        }
      };
      workerRef.current.addEventListener('message', messageHandler);
      workerRef.current.postMessage({
        action,
        payload,
        defaultData,
        endpoint: getUrl(deploy, script),
        method: 'POST',
      });
    });
  };

  useEffect(() => {
    workerRef.current = new WebWorker();
    workerRef.current.onmessage = (e: any) => {
      const { action, data, error } = e.data;

      if (error) {
        const err_msg = data.err_message;
        handleRequestError(err_msg, action);
        return;
      }
      switch (action) {
        case 'updateNewFilesOrder':
          console.log('File was successfully updated', data);
          break;
      }
    };

    return () => workerRef.current.terminate();
  }, []);

  useEffect(() => {
    const isDataProcessing = uploadedFilesArr.some(
      (file) => file.fileLoading === true
    );

    dispatch(setFileUploadProgress(isDataProcessing));
  }, [uploadedFilesArr]);

  return (
    <StyledDialog>
      <CustomTriggerButton
        type="button"
        variant="outline"
        className="uppercase"
        onClick={handleClose}
      >
        <Icon path={mdiSofaSingle} size={1} />
        bom import tool
      </CustomTriggerButton>
      <StyledDialogOpen dialogOpen={dialogOpen}>
        <StyledContentWrapper>
          <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <StyledInnerContent>
              <BomDialogContent
                onImportLines={onImportLines}
                emptyObject={initialFile}
              />
            </StyledInnerContent>
            <StyledEmail>
              <Icons.envelope />
              {/* <span
                id="created-string-id"
                data-create-id="ABCD-TEST-XYZ"
              ></span> */}
              <span>Email yourself or Others When Complete</span>
              {/* <div>
                <pre>{JSON.stringify(uploadedFilesArr, null, 2)}</pre>
              </div> */}
            </StyledEmail>
            <StyledCloseIcon onClick={handleClose} />
          </DndContext>
        </StyledContentWrapper>
      </StyledDialogOpen>
    </StyledDialog>
  );
};

export { BomCustomDialog };
