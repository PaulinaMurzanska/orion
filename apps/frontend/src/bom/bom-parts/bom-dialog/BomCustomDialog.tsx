import {
  BomCombinedArrayObjectType,
  setBomImportFiles,
} from '../../../../store/bomImportFilesSlice';
import {
  CustomButton,
  CustomTriggerButton,
  StyledContentWrapper,
  StyledDialog,
  StyledDialogOpen,
  StyledInnerContent,
} from './StyledBomDialog';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { useEffect, useRef, useState } from 'react';

import BomDialogContent from '../dialog-content/BomDialogContent';
import { FileObjectType } from '../type';
import Icon from '@mdi/react';
import WebWorker from '../../../workers/WebWorker?worker&inline';
import { arrayMove } from '@dnd-kit/sortable';
import { mdiSofaSingle } from '@mdi/js';
import { nanoid } from 'nanoid';
import { useDispatch } from 'react-redux';

const baseUrl =
  'https://corsproxy.io/?https://td2893635.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=220&deploy=1&compid=TD2893635&h=2666e10fd32e93612036';

const fileObjEmpty: FileObjectType = {
  id: '',
  fileId: null,
  fileLoading: false,
  fileAdded: false,
  fileName: 'Drag and Drop',
  fullFileName: '',
  fileNameJson: '',
  fileExtension: '',
  loaderText: '',
  fileContent: '',
  bomRecordID: null,
  bomRecordStatus: 1,
  fileJSON: {},
  file: null,
  itemLines: [],
  initialPosition: 1,
  currentPosition: 1,
};

const BomCustomDialog = () => {
  const dispatch = useDispatch();

  const idInitial = nanoid(8);
  const workerRef = useRef<any>(null);

  const initialObject = { ...fileObjEmpty };
  initialObject.id = idInitial;
  const [fileObjs, setFileObjs] = useState<FileObjectType[]>([initialObject]);
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);
  const [filesCombined, setFilesCombined] = useState<any[]>([]);

  const setFilesDataArray = (filesArray: FileObjectType[]) => {
    setFileObjs(filesArray);
  };

  const handleSaveFilesGlobally = (newFiles: BomCombinedArrayObjectType[]) => {
    dispatch(setBomImportFiles(newFiles));
  };

  const getFilePosition = (id: any) =>
    fileObjs.findIndex((task: any) => task.id === id);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id === over.id) return;
    const activeObj = fileObjs.find((obj) => obj.id === active.id);
    const overObj = fileObjs.find((obj) => obj.id === over.id);
    if (activeObj && overObj) {
      if (activeObj.fileLoading || overObj.fileLoading) {
        alert(
          'File upload is not completed yet, you cannot change the order until the upload is done.'
        );
      } else {
        setFileObjs((fileObjs) => {
          const originalPosition = getFilePosition(active.id);
          const newPosition = getFilePosition(over.id);
          return arrayMove(fileObjs, originalPosition, newPosition);
        });

        setFileObjs((currentFileObjs) => {
          const updatedFileObjs = [...currentFileObjs];
          for (const [index, file] of updatedFileObjs.entries()) {
            file.currentPosition = index + 1;
            updatedFileObjs[index] = {
              ...updatedFileObjs[index],
              currentPosition: index + 1,
            };
          }
          return updatedFileObjs;
        });
      }
    }
  };

  const createCombinedFilesArr = () => {
    setFileObjs((currentFileObjs) => {
      const updatedFileObjs = [...currentFileObjs];
      for (const [index, file] of updatedFileObjs.entries()) {
        updatedFileObjs[index] = {
          ...updatedFileObjs[index],
          fileLoading: true,
          loaderText: 'Adding file to combined array',
        };
      }
      return updatedFileObjs;
    });

    const combinedItemLines = fileObjs.map((obj) => obj.itemLines).flat();
    setFilesCombined(combinedItemLines);
    handleSaveFilesGlobally(combinedItemLines);
    const id = nanoid(5);
    const combineArrayData = {
      lines: combinedItemLines,
      fileName: `Random = ${id}`,
      scriptID: 292,
      deploymentID: 1,
    };

    setFileObjs((currentFileObjs) => {
      const updatedFileObjs = [...currentFileObjs];
      for (const [index, file] of updatedFileObjs.entries()) {
        updatedFileObjs[index] = {
          ...updatedFileObjs[index],
          fileLoading: false,
          loaderText:
            'Item is part of the combined array now - you can close the dialog',
        };
      }
      return updatedFileObjs;
    });
    console.log(
      'The request should be made in this place, temporarily, we are going to save file in global store - not created yet at this point'
    );
    console.log('payload:', combineArrayData);
  };

  const onImportLines = async () => {
    if (uploadProgress) {
      return;
    } else {
      const changedRecords = fileObjs.filter(
        (file) =>
          file.initialPosition !== file.currentPosition &&
          file.bomRecordID !== null
      );

      setFileObjs((currentFileObjs) => {
        const updatedFileObjs = [...currentFileObjs];
        for (const [index, file] of updatedFileObjs.entries()) {
          file.currentPosition = index + 1;
          updatedFileObjs[index] = {
            ...updatedFileObjs[index],
            currentPosition: index + 1,
            fileLoading: true,
            loaderText: 'Import lines',
          };
        }
        return updatedFileObjs;
      });

      if (changedRecords.length === 0) {
        createCombinedFilesArr();
      } else {
        setFileObjs((currentFileObjs) => {
          const updatedFileObjs = [...currentFileObjs];
          for (const [index, file] of updatedFileObjs.entries()) {
            if (
              file.initialPosition !== file.currentPosition &&
              file.bomRecordID !== null
            ) {
              updatedFileObjs[index] = {
                ...updatedFileObjs[index],
                fileLoading: true,
                loaderText: 'The order of the file changed, updating order',
              };
            }
          }
          return updatedFileObjs;
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
            setFileObjs((currentFileObjs) => {
              const updatedFileObjs = [...currentFileObjs];
              for (const [index, file] of updatedFileObjs.entries()) {
                if (
                  file.initialPosition !== file.currentPosition &&
                  file.bomRecordID !== null
                ) {
                  updatedFileObjs[index] = {
                    ...updatedFileObjs[index],
                    fileLoading: false,
                    loaderText: 'The file was updated',
                  };
                }
              }
              return updatedFileObjs;
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
        setFileObjs(newArr);
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
        endpoint: baseUrl,
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
    const isDataProcessing = fileObjs.some((file) => file.fileLoading === true);
    setUploadProgress(isDataProcessing);
  }, [fileObjs]);

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
                setFilesDataArray={setFilesDataArray}
                onImportLines={onImportLines}
                fileObjs={fileObjs}
                emptyObject={fileObjEmpty}
                uploadProgress={uploadProgress}
              />
            </StyledInnerContent>
            <CustomButton type="button" variant="ghost" onClick={handleClose}>
              Close
            </CustomButton>
          </DndContext>
        </StyledContentWrapper>
      </StyledDialogOpen>
    </StyledDialog>
  );
};

export { BomCustomDialog };
