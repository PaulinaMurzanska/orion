import {
  StyledCard,
  StyledContentWrapper,
  StyledDropArea,
  StyledMinus,
} from './BomStyledDialogContent';
import { useEffect, useState } from 'react';

import ActionBtns from './action-btns/ActionBtns';
import DragDrop from './drag-drop-elements/DragDrop';
import { FileObjectType } from '../type';
import StatusZone from './drag-drop-elements/StatusZone';
import { extractFileNameAndExtension } from '../../../helpers/nameFormatting';
import { handleHttpRequest } from '../../../workers/FileWorker';
import { nanoid } from 'nanoid';

const baseUrl =
  'https://corsproxy.io/?https://td2893635.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=220&deploy=1&compid=TD2893635&h=2666e10fd32e93612036';

interface DialogContentProps {
  setFilesDataArray: (files: FileObjectType[]) => void;
  fileObjs: FileObjectType[];
  emptyObject: FileObjectType;
}

const BomDialogContent = ({
  fileObjs,
  setFilesDataArray,
  emptyObject,
}: DialogContentProps) => {
  const [fileObjects, setFileObjs] = useState<FileObjectType[]>(fileObjs);
  const [filesCombined, setFilesCombined] = useState<any[]>([]);

  const handleAddNewDropZone = () => {
    const id = nanoid(8);
    const dropzone = { ...emptyObject };
    dropzone.id = id;
    const newArray = [...fileObjs, dropzone];
    setFileObjs(newArray);
  };

  const handleDeleteDropZone = (id: number | null) => {
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

  const onAction = () => {
    console.log('Create one array of all likes from all objects');
    const combinedItemLines = fileObjs.map((obj) => obj.itemLines).flat();
    setFilesCombined(combinedItemLines);
    console.log('combinedItemLines', combinedItemLines);

    const id = nanoid(5);
    const combineArrayData = {
      lines: combinedItemLines,
      fileName: `Random = ${id}`,
      scriptID: 292,
      deploymentID: 1,
    }; // this is the payload we need to send when we press "import lines"
    console.log(
      'The request should be made in this place, the payload is:',
      combineArrayData
    );
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

        const bomImportCreateObj = {
          action: 'create',
          custrecord_bom_import_importd_file_url: fileID,
          custrecord_bom_import_file_import_order: index + 1,
          custrecord_bom_import_transaction: 3, // capture transaction id from record if record is in edit mode  ---PM:what the actual value should be here????
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
          console.log(
            '      bomRecordID was created as',
            bomRecordID,
            '   but we are not using it yet, only to assign it to to local array, but it is not used in HTTP at this step'
          );
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
                console.log(
                  'response',
                  response,
                  'we can now set loading state to false'
                );

                if (finalRecordId.bomRecordID === bomRecordID) {
                  setFileObjs((currentFileObjs) => {
                    const updatedFileObjs = [...currentFileObjs];
                    updatedFileObjs[index] = {
                      ...updatedFileObjs[index],
                      fileLoading: false,
                    };
                    return updatedFileObjs;
                  });
                }
              }
            }
          }
        }
      }

      /////////////////////////////////////////////////////////////////////
      // const reorderPayload = {
      //   action: 'edit',
      //   custrecord_bom_import_file_import_order: 'current position',
      //   editID: bomRecordID,
      //   scriptID: 290,
      //   deploymentID: 1,
      // };  // this is the payload we need to send when the reorder happens

      // const reorderPayload2 = {
      //   lines: 'array of objects - concatenated array of all liken from all objects',
      //   fileName: "random string of char eg.'BOB'",
      //   scriptID: 292,
      //   deploymentID: 1,
      // }; // this is the payload we need to send when we press "import lines"

      //   ////--- Stefan's workers block ----/////
      //   ////--- for some reason the POST is not even getting initiated when I was testing it ----/////

      //   // post the message (object) to the web worker
      //   // fileWorker.postMessage(fileDataObj);

      //   // on return of the message from the web worker, apply the file to the BoM import record
      //   // fileWorker.onmessage = (e) => {
      //   //   console.log('fileWorker', e);
      //   //   const { response, error } = e.data;
      //   //   if (response) {
      //   //     console.log('File uploaded successfully:', response);
      //   //     const fileID = response.output.fileID; // update the file URL on the fileObj with the file URL result

      //   //     // define fields to set on object
      //   //     const bomImportCreateObj = {
      //   //       action: 'create',
      //   //       custrecord_bom_import_importd_file_url: fileID,
      //   //       custrecord_bom_import_file_import_order: 1, // change to generate index
      //   //       custrecord_bom_import_transaction: 3, // capture transaction id from record if record is in edit mode
      //   //       custrecord_orion_bom_intialization_ident: 'GmOBKvsQkQ4R3U2N', //capture the intialization identity number from the front end script
      //   //       scriptID: 290,
      //   //       deploymentID: 1,
      //   //       endpoint: bomImportCreateURL,
      //   //     };

      //   //     bomImportWorker.postMessage(bomImportCreateObj);
      //   //   } else if (error) {
      //   //     console.error('Error uploading file:', error);
      //   //   }
      //   // };
      //   // on return of the message from the web worker, capture the bom record id
      //   // bomImportWorker.onmessage = (e) => {
      //   //   console.log('bomImportWorker', e);
      //   //   const { response, error } = e.data;
      //   //   if (response) {
      //   //     console.log('BoM Import record created successfully:', response);
      //   //     const bomRecordID = response.output.recordID;
      //   //     console.log('bomRecordID', bomRecordID);
      //   //   } else if (error) {
      //   //     console.error('Error creating BoM Import record:', error);
      //   //   }
      //   // };

      //   ////---^^^^^^^^^^ Stefan's workers block ^^^^^^^^^^^----/////
    };

    reader.readAsText(file, 'UTF-8');
  };

  useEffect(() => {
    setFilesDataArray(fileObjects);
  }, [fileObjects]);

  return (
    <StyledContentWrapper>
      {fileObjs.map((obj) => (
        <StyledDropArea key={obj.id}>
          {fileObjs.length > 1 && (
            <StyledMinus onClick={() => handleDeleteDropZone(obj.id)} />
          )}
          <StyledCard>
            <DragDrop fileObj={obj} onDropFunction={onDropFunction} />
          </StyledCard>
          <StyledCard onClick={() => handleDeleteDropZone(obj.id)}>
            <StatusZone fileObj={obj} />
          </StyledCard>
        </StyledDropArea>
      ))}
      <ActionBtns onAddClick={handleAddNewDropZone} onActionClick={onAction} />
    </StyledContentWrapper>
  );
};

export default BomDialogContent;
