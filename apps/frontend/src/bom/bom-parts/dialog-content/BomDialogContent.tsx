import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useRef, useState } from 'react';

import ActionBtns from './action-btns/ActionBtns';
import DropAndStatusArea from './drag-drop-elements/DropAndStatusArea';
import { FileObjectType } from '../type';
import { StyledContentWrapper } from './BomStyledDialogContent';
import WebWorker from '../../../workers/WebWorker?worker&inline';
import { extractFileNameAndExtension } from '../../../helpers/nameFormatting';
import { getUrl } from '@orionsuite/api-client';
import { nanoid } from 'nanoid';

interface DialogContentProps {
  setFilesDataArray: (files: FileObjectType[]) => void;
  onImportLines: () => void;
  fileObjs: FileObjectType[];
  emptyObject: FileObjectType;
  uploadProgress: boolean;
}

const BomDialogContent = ({
  fileObjs,
  setFilesDataArray,
  emptyObject,
  onImportLines,
  uploadProgress,
}: DialogContentProps) => {
  const [fileObjects, setFileObjs] = useState<FileObjectType[]>(fileObjs);

  const queryParams = new URLSearchParams(location.search);
  const urlParamId = queryParams.get('id');

  const workerRef = useRef<Worker | null>(null);

  const handleAddNewDropZone = () => {
    const id = nanoid(8);
    const dropzone = { ...emptyObject };
    const positionToSet = fileObjects.length + 1;
    dropzone.initialPosition = positionToSet;
    dropzone.currentPosition = positionToSet;
    dropzone.id = id;

    const newArray = [...fileObjects, dropzone];
    setFileObjs(newArray);
  };

  const handleDeleteDropZone = (id: number | string) => {
    if (fileObjects.length > 1) {
      const newArray = fileObjects.filter(
        (item: FileObjectType) => item.id !== id
      );
      setFilesDataArray(newArray);
    }
  };

  const terminate = (index: number) => {
    setFileObjs((currentFileObjs) => {
      const updatedFileObjs = [...currentFileObjs];
      updatedFileObjs[index] = {
        ...updatedFileObjs[index],
        fileAdded: true,
        fileLoading: false,
        loaderText: 'Upload was terminated due to errors',
      };
      return updatedFileObjs;
    });
  };

  const handleRequestError = (message: string, index: number, key: string) => {
    const err_msg = `Error on ${key} function: ${message}. We should implement here some action what we want to do if this error appears for this file.`;
    alert(err_msg);
    terminate(index);
  };

  const getIdentifier = (queryId: string | null) => {
    let id;
    let fromParam;
    if (queryId === null) {
      const initialStringIdElement = document.getElementById(
        'created-string-id'
      ) as HTMLElement | null;
      if (initialStringIdElement) {
        const dataCreateId =
          initialStringIdElement.getAttribute('data-create-id');
        id = dataCreateId;
      } else {
        console.warn('Element with ID "created-string-id" not found');
        id = null;
      }
      fromParam = false;
    } else {
      id = queryId;
      fromParam = true;
    }
    const idData = {
      id,
      fromParam,
    };
    return idData;
  };

  const initiateProcess = (action: any, payload: any, defaultData: any) => {
    const script = import.meta.env.VITE_API_DEFAULT_SCRIPT;
    const deploy = import.meta.env.VITE_API_DEFAULT_DEPLOY;
    workerRef.current?.postMessage({
      action,
      payload,
      defaultData,
      endpoint: getUrl(deploy, script),
      method: 'POST',
    });
  };

  const proceedToGetBomRecordId = (data: any) => {
    const { defaultPayload, fileID } = data;
    setFileObjs((currentFileObjs) => {
      const index = defaultPayload.index;
      const updatedFileObjs = [...currentFileObjs];
      updatedFileObjs[index] = {
        ...updatedFileObjs[index],
        fileId: fileID,
        loaderText: `Created file id : ${fileID}`,
      };
      return updatedFileObjs;
    });

    const { id, fromParam } = getIdentifier(urlParamId);

    const bomImportCreateObj: any = {
      action: 'create',
      custrecord_bom_import_importd_file_url: fileID,
      custrecord_bom_import_file_import_order:
        defaultPayload.fileCurrentPosition,
      scriptID: 290,
      deploymentID: 1,
    };
    if (fromParam) {
      console.log('Transaction id grabbed from url:', id);
      bomImportCreateObj.custrecord_bom_import_transaction = id;
    } else {
      console.log('Transaction id grabbed from dataset :', id);
      bomImportCreateObj.custrecord_orion_bom_intialization_ident = id;
    }

    initiateProcess('getBomRecordId', bomImportCreateObj, defaultPayload);
  };

  const proceedToCreateJson = (data: any) => {
    const { defaultPayload, bomRecordID } = data;
    const index = defaultPayload.index;
    setFileObjs((currentFileObjs) => {
      const updatedFileObjs = [...currentFileObjs];
      updatedFileObjs[index] = {
        ...updatedFileObjs[index],
        loaderText: `Created BOM Record Id : ${bomRecordID}`,
        bomRecordID,
      };
      return updatedFileObjs;
    });
    const payload = {
      fileContent: defaultPayload.fileContent,
      fileName: defaultPayload.fullFileName,
      scriptID: 219,
      deploymentID: 1,
    };
    initiateProcess('processDataToJson', payload, defaultPayload);
  };

  const proceedToUpdateFileWithJson = (data: any) => {
    const { fileJSON, defaultPayload, itemLines } = data;
    const index = defaultPayload.index;
    setFileObjs((currentFileObjs) => {
      const updatedFileObjs = [...currentFileObjs];
      updatedFileObjs[index] = {
        ...updatedFileObjs[index],
        itemLines,
      };
      return updatedFileObjs;
    });
    const payload = {
      ...fileJSON,
      scriptID: 292,
      fileName: defaultPayload.fileNameJson,
      deploymentID: 1,
    };
    initiateProcess('getBomRecordIfAfterJsonCreated', payload, defaultPayload);
  };

  const proceedToGetBomIdAfterJsonCreated = (data: any) => {
    const defaultPayload = data;
    const index = defaultPayload.index;
    let fileID;
    let bomRecordID;
    setFileObjs((currentFileObjs) => {
      const updatedFileObjs = [...currentFileObjs];
      updatedFileObjs[index] = {
        ...updatedFileObjs[index],
      };
      fileID = updatedFileObjs[index].fileId;
      bomRecordID = updatedFileObjs[index].bomRecordID;

      return updatedFileObjs;
    });
    const dataToEditRecord = {
      action: 'edit',
      custrecord_bom_import_json_importd_file: fileID,
      editID: bomRecordID,
      scriptID: 290,
      deploymentID: 1,
    };
    initiateProcess('finalizeProcess', dataToEditRecord, defaultPayload);
  };

  const finalizeProcess = (data: any) => {
    const { defaultPayload, bomRecordId } = data;
    const index = defaultPayload.index;
    const finalRecId = bomRecordId;
    let bomRecordID;

    setFileObjs((currentFileObjs) => {
      const updatedFileObjs = [...currentFileObjs];
      updatedFileObjs[index] = {
        ...updatedFileObjs[index],
      };
      bomRecordID = updatedFileObjs[index].bomRecordID;
      return updatedFileObjs;
    });

    if (finalRecId === bomRecordID) {
      setFileObjs((currentFileObjs) => {
        const updatedFileObjs = [...currentFileObjs];
        updatedFileObjs[index] = {
          ...updatedFileObjs[index],
          fileLoading: false,
          loaderText: 'File was successfully uploaded',
        };
        return updatedFileObjs;
      });
    }
  };

  const onDropFunction = (dropzoneId: string, file: any) => {
    const index = fileObjects.findIndex((obj: any) => obj.id === dropzoneId);
    if (index === -1) return;

    const fileData = extractFileNameAndExtension(file.name);
    const fileName = fileData.fileNameShort;
    const fullFileName = file.name;
    const fileNameJson = fileData.fileNameJson;
    const fileExtension = fileData.extension;
    const loaderText = 'Reading File';
    const fileCurrentPosition = fileObjects[index].currentPosition;

    // assign known values to the object
    setFileObjs((currentFileObjs) => {
      const updatedFileObjs = [...currentFileObjs];
      updatedFileObjs[index] = {
        ...updatedFileObjs[index],
        file,
        fileAdded: true,
        fileLoading: true,
        fileName,
        fullFileName,
        fileNameJson,
        loaderText,
        fileExtension,
      };
      return updatedFileObjs;
    });

    const reader = new FileReader();

    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const fileContent = (e.target as FileReader).result;

      setFileObjs((currentFileObjs) => {
        const updatedFileObjs = [...currentFileObjs];
        updatedFileObjs[index] = {
          ...updatedFileObjs[index],
          fileContent,
        };
        return updatedFileObjs;
      });

      const fileDataObj = {
        fileContent: (e.target as FileReader).result,
        fileName: fullFileName,
        scriptID: 292,
        deploymentID: 1,
      };

      const defaultPayload = {
        index,
        fileCurrentPosition,
        fileContent,
        fullFileName,
        fileNameJson,
      };

      initiateProcess('getFileId', fileDataObj, defaultPayload);
    };

    reader.readAsText(file, 'UTF-8');
  };

  useEffect(() => {
    workerRef.current = new WebWorker();
    workerRef.current.onmessage = (e: any) => {
      const { action, data, error } = e.data;
      const defaultPayload = e.data.defaultData;
      const index = defaultPayload.index;

      if (error) {
        const err_msg = data.err_message;
        handleRequestError(err_msg, index, action);
        return;
      }
      switch (action) {
        case 'getFileId':
          const fileID = data.output.fileID;
          proceedToGetBomRecordId({ defaultPayload, fileID });
          break;
        case 'getBomRecordId':
          const bomRecordID = data.bomRecordID;
          proceedToCreateJson({ defaultPayload, bomRecordID });
          break;
        case 'processDataToJson':
          const fileJSON = data.lineJSON;
          const itemLines = data.lineJSON.item.items;
          proceedToUpdateFileWithJson({ defaultPayload, fileJSON, itemLines });
          break;
        case 'getBomRecordIfAfterJsonCreated':
          proceedToGetBomIdAfterJsonCreated(defaultPayload);
          break;
        case 'finalizeProcess':
          const bomRecordId = data.bomRecordID;
          finalizeProcess({ defaultPayload, bomRecordId });
          break;
      }
    };

    return () => workerRef.current?.terminate();
  }, []);

  useEffect(() => {
    setFilesDataArray(fileObjects);
  }, [fileObjects]);

  return (
    <StyledContentWrapper>
      <SortableContext
        items={fileObjs}
        strategy={horizontalListSortingStrategy}
      >
        {fileObjs.map((obj) => (
          <DropAndStatusArea
            key={obj.id}
            file={obj}
            fileObjects={fileObjs}
            handleDeleteDropZone={handleDeleteDropZone}
            onDropFunction={onDropFunction}
          />
        ))}
      </SortableContext>
      <ActionBtns
        onAddClick={handleAddNewDropZone}
        onActionClick={onImportLines}
        uploadProgress={uploadProgress}
      />
    </StyledContentWrapper>
  );
};

export default BomDialogContent;
