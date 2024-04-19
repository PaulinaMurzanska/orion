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
  removeInvalidFiles,
  setDisableBeginBtn,
  setFileUploadProgress,
  setUploadedFilesArr,
  updateFileDetails,
  updateFilePositions,
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
    uploadedFilesArr.forEach((file) => {
      dispatch(
        updateFileDetails({
          id: file.id,
          fileLoading: true,
          loaderText: 'Adding file to combined array',
          createArrayProgress: true,
        })
      );
    });
    const combinedItemLines = uploadedFilesArr
      .map((obj) => obj.itemLines)
      .flat();
    setFilesCombined(combinedItemLines);
    dispatch(setBomImportFiles(combinedItemLines));

    const isDevEnv = import.meta.env.MODE === 'development';
    const param = isDevEnv ? 3 : urlParamId;
    const { transactionId, transactionExists } = getTransactionId(param);

    let payload: any = {
      fileContent: JSON.stringify(combinedItemLines),
      deploymentID: 1,
    };
    let url;
    console.log('transaction exist?', transactionExists, transactionId);
    if (transactionExists) {
      const transactionVal = await getTransactionVal(3);
      payload = { ...payload, scriptID: 307, fileID: transactionVal };
      url =
        'https://corsproxy.io/?https://td2893635.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=220&deploy=1&compid=TD2893635&h=2666e10fd32e93612036&scriptID=307&deploymentID=1';
    } else {
      const fileName =
        transactionId === null ? 'dataset id not found' : transactionId;
      payload = { ...payload, scriptID: 292, fileName: fileName };
      url = null;
    }

    const data: any = await initiateProcessPromise('', payload, null, url);
    finalizeUpload(data.output.fileID);
  };

  const finalizeUpload = (id: string) => {
    uploadedFilesArr.forEach((file) => {
      dispatch(
        updateFileDetails({
          id: file.id,
          fileLoading: false,
          loaderText: `File is saved in NS under transaction ID : ${id}`,
          createArrayProgress: false,
          arrayCreated: true,
        })
      );
    });
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
      uploadedFilesArr.forEach((file) => {
        dispatch(
          updateFileDetails({
            id: file.id,
            fileLoading: true,
            loaderText: 'Adding file to combined array',
          })
        );
      });

      dispatch(removeInvalidFiles());
      if (changedRecords.length === 0) {
        createCombinedFilesArr();
      } else {
        uploadedFilesArr.forEach((file) => {
          if (
            file.initialPosition !== file.currentPosition &&
            file.bomRecordID !== null
          ) {
            dispatch(
              updateFileDetails({
                id: file.id,
                fileLoading: true,
                loaderText: 'The order of the file changed, updating order',
              })
            );
          }
        });

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
            uploadedFilesArr.forEach((file) => {
              if (
                file.initialPosition !== file.currentPosition &&
                file.bomRecordID !== null
              ) {
                dispatch(
                  updateFileDetails({
                    id: file.id,
                    fileLoading: false,
                    loaderText: 'The file was updated',
                  })
                );
              }
            });
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
    defaultData: any,
    url?: any
  ) => {
    const script = import.meta.env.VITE_API_DEFAULT_SCRIPT;
    const deploy = import.meta.env.VITE_API_DEFAULT_DEPLOY;

    const endpoint = url ? url : getUrl(deploy, script);
    console.log('endpoint', endpoint);

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
        endpoint: endpoint,
        method: 'POST',
      });
    });
  };

  useEffect(() => {
    workerRef.current = new WebWorker();
    workerRef.current.onmessage = (e: any) => {
      const { action, data, error } = e.data;

      console.log('event in use eff', e);

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
      switch (action) {
        case 'finish':
          console.log('finish');
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
    if (uploadedFilesArr.length === 1 && !uploadedFilesArr[0].fileAdded) {
      dispatch(setDisableBeginBtn(true));
    } else {
      dispatch(setDisableBeginBtn(false));
    }
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
