import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';

import ActionBtns from './action-btns/ActionBtns';
import DropAndStatusArea from './drag-drop-elements/DropAndStatusArea';
import { FileObjectType } from '../type';
import { StyledContentWrapper } from './BomStyledDialogContent';
import { extractFileNameAndExtension } from '../../../helpers/nameFormatting';
import { handleHttpRequest } from '../../../workers/FileWorker';
import { nanoid } from 'nanoid';

const baseUrl =
  'https://corsproxy.io/?https://td2893635.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=220&deploy=1&compid=TD2893635&h=2666e10fd32e93612036';

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

  const handleAddNewDropZone = () => {
    const id = nanoid(8);
    const dropzone = { ...emptyObject };
    const positionToSet = fileObjs.length + 1;
    dropzone.initialPosition = positionToSet;
    dropzone.currentPosition = positionToSet;
    dropzone.id = id;

    const newArray = [...fileObjs, dropzone];
    setFileObjs(newArray);
  };

  const handleDeleteDropZone = (id: number | string) => {
    if (fileObjs.length > 1) {
      const newArray = fileObjs.filter(
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

  const onDropFunction = (dropzoneId: string, file: any) => {
    const index = fileObjs.findIndex((obj: any) => obj.id === dropzoneId);
    if (index === -1) return;

    const fileData = extractFileNameAndExtension(file.name);
    const fileName = fileData.fileNameShort;
    const fullFileName = file.name;
    const fileNameJson = fileData.fileNameJson;
    const fileExtension = fileData.extension;
    const loaderText = 'Reading File';
    const fileCurrentPosition = fileObjs[index].currentPosition;

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

      console.log('STEP 1 - we are sending fileDataObj to get the fileID');
      const getFileIdentifiers = await handleHttpRequest(fileDataObj, baseUrl);
      if (getFileIdentifiers.error) {
        const err_msg = getFileIdentifiers.err_message;
        handleRequestError(err_msg, index, 'getFileIdentifiers');
      } else {
        const fileID = getFileIdentifiers.output.fileID;
        setFileObjs((currentFileObjs) => {
          const updatedFileObjs = [...currentFileObjs];
          updatedFileObjs[index] = {
            ...updatedFileObjs[index],
            fileId: fileID,
            loaderText: `Created file id : ${fileID}`,
          };
          return updatedFileObjs;
        });
        console.log(
          'Before Step 2 - we have to create functionality described in ticket 51 - to get the value for: custrecord_bom_import_transaction  and  custrecord_orion_bom_intialization_ident'
        );
        const bomImportCreateObj = {
          action: 'create',
          custrecord_bom_import_importd_file_url: fileID,
          custrecord_bom_import_file_import_order: fileCurrentPosition,
          // don't include that custrecord_bom_import_transaction if record doesn't exist
          custrecord_bom_import_transaction: 3, // capture transaction id from record if record is in edit mode  ---PM:what the actual value should be here???? - record exist - grab url param
          // if record exist do not include that custrecord_orion_bom_intialization_ident
          custrecord_orion_bom_intialization_ident: 'GmOBKvsQkQ4R3U2N', //capture the intialization identity number from the front end script  ---PM:what the actual value should be here????
          scriptID: 290,
          deploymentID: 1,
        };

        console.log(
          'STEP 2 - having now the fileID we are sending bomImportCreateObj to get the bomRecordID'
        );
        const getBomImportCreateObj = await handleHttpRequest(
          bomImportCreateObj,
          baseUrl
        );
        if (getBomImportCreateObj.error) {
          const err_msg = getBomImportCreateObj.err_message;
          handleRequestError(err_msg, index, 'getBomImportCreateObj');
        } else {
          const bomRecordID = getBomImportCreateObj.bomRecordID;

          setFileObjs((currentFileObjs) => {
            const updatedFileObjs = [...currentFileObjs];
            updatedFileObjs[index] = {
              ...updatedFileObjs[index],
              loaderText: `Created BOM Record Id : ${bomRecordID}`,
              bomRecordID,
            };
            return updatedFileObjs;
          });

          const dataToJson = {
            fileContent: fileContent,
            fileName: fullFileName,
            scriptID: 219,
            deploymentID: 1,
          };

          console.log(
            'STEP 3 - we create dataToJson object, with file content, file name, script and deployment id, in response we expect to get lineJSON'
          );
          const getJsonData = await handleHttpRequest(dataToJson, baseUrl);
          if (getJsonData.error) {
            const err_msg = getJsonData.err_message;
            handleRequestError(err_msg, index, 'jsonData');
          } else {
            const fileJSON = getJsonData.lineJSON;
            const itemLines = getJsonData.lineJSON.item.items;
            setFileObjs((currentFileObjs) => {
              const updatedFileObjs = [...currentFileObjs];
              updatedFileObjs[index] = {
                ...updatedFileObjs[index],
                itemLines,
              };
              return updatedFileObjs;
            });

            const newPayloadToGetUrl = {
              ...fileJSON,
              scriptID: 292,
              fileName: fileNameJson,
              deploymentID: 1,
            };

            console.log(
              'STEP 4 - having lineJSON now, we are sending lineJSON, with script 292 and deployment id=1'
            );
            const fileResponseUrl = await handleHttpRequest(
              newPayloadToGetUrl,
              baseUrl
            );
            if (fileResponseUrl.error) {
              const err_msg = fileResponseUrl.err_message;
              handleRequestError(err_msg, index, 'fileResponseUrl');
            } else {
              const dataToEditRecord = {
                action: 'edit',
                custrecord_bom_import_json_importd_file: fileID,
                editID: bomRecordID,
                scriptID: 290,
                deploymentID: 1,
              };
              console.log(
                'STEP 5 - now we are awaiting to get the final ID after we sent the action:edit data'
              );
              const finalRecordId = await handleHttpRequest(
                dataToEditRecord,
                baseUrl
              );
              if (finalRecordId.error) {
                const err_msg = finalRecordId.err_message;
                handleRequestError(err_msg, index, 'getRecordId');
              } else {
                const response = finalRecordId;
                console.log('Process completed, set loading to false');
                if (finalRecordId.bomRecordID === bomRecordID) {
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
              }
            }
          }
        }
      }
    };

    reader.readAsText(file, 'UTF-8');
  };

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
