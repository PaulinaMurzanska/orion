import {
  StyledCard,
  StyledContentWrapper,
  StyledDropArea,
  StyledMinus,
} from './BomStyledDialogContent';
import {
  handleHttpRequest,
  handleHttpRequest2,
} from '../../../workers/FileWorker';
import { useEffect, useState } from 'react';

import ActionBtns from './action-btns/ActionBtns';
import DragDrop from './drag-drop-elements/DragDrop';
import { FileObjectType } from '../type';
import FileWorker from '../../../workers/FileWorker?worker&inline';
import StatusZone from './drag-drop-elements/StatusZone';
import { extractFileNameAndExtension } from '../../../helpers/nameFormatting';
import { nanoid } from 'nanoid';

const test = {
  items: [
    {
      line: 0,
      item: null,
      description:
        '+Everywhere Rectangular Table,Squared Edge,Lam Top/Thermo Edge,T-Leg w/Hgt Adj 24D 48W',
      quantity: '1',
      povendor: null,
      custcol_pintel_entcode: 'HMI',
      custcol_pintel_listprice: '1679.00',
      custcol_pintel_tag1: 'CATALOG TAG 1',
      custcol_pintel_tag2: 'CATALOG TAG 2',
      custcol_pintel_porate: '1679.00',
      custcol_pintel_mancode: 'HGN',
      rate: '1679.00',
      costestimaterate: '1679.00',
      custcol_pintel_dealerdisc: '0.000',
      custcol_pintel_custdiscount: '0.000',
      custcol_pintel_optioncodedescription:
        '29 - +misted\n29 - +misted\n8Q - +folkstone grey\n20 - +casters\nNTG - +no grommet\n',
      itemid: 'DT1AS.2448LA',
      product: true,
    },
    {
      line: 1,
      item: null,
      description:
        '+Everywhere Rectangular Table,Squared Edge,Lam Top/Thermo Edge,T-Leg w/Hgt Adj 24D 48W',
      quantity: '1',
      povendor: null,
      custcol_pintel_entcode: 'HMI',
      custcol_pintel_listprice: '1679.00',
      custcol_pintel_tag1: 'CATALOG TAG 1',
      custcol_pintel_tag2: 'CATALOG TAG 2',
      custcol_pintel_porate: '1679.00',
      custcol_pintel_mancode: 'HGN',
      rate: '1679.00',
      costestimaterate: '1679.00',
      custcol_pintel_dealerdisc: '0.000',
      custcol_pintel_custdiscount: '0.000',
      custcol_pintel_optioncodedescription:
        '29 - +misted\n29 - +misted\n8Q - +folkstone grey\n20 - +casters\nNTG - +no grommet\n',
      itemid: 'DT1AS.2448LA',
      product: true,
    },
  ],
};

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

  const fileWorker = new FileWorker(); // load web worker that sends files to NetSuite
  const bomImportWorker = new FileWorker(); // load web worker that creates BoM import records
  const jsonWorker = new FileWorker(); // load web worker that converts sif files to JSON
  const itemCheckWorker = new FileWorker(); // load web worker that checks for item ids and returns missing items
  const itemCreateWorker = new FileWorker(); // load web worker that creates missing items and returns their ids
  const jsonCreateWorker = new FileWorker(); // load web worker that creates JSON records
  const jsonUpdateWorker = new FileWorker(); // load web worker that updates JSON records
  const currentURL = window.location.href;
  const internalIDMatch = currentURL.match(/[?&]id=([^&]*)/);

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

  const onDropFunction = (dropzoneId: string, file: any) => {
    const index = fileObjs.findIndex((obj: any) => obj.id === dropzoneId);
    if (index === -1) return;

    const fileData = extractFileNameAndExtension(file.name);
    const fileName = fileData.fileName;
    const fullFileName = file.name;
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

      const baseUrl =
        'https://corsproxy.io/?https://td2893635.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=220&deploy=1&compid=TD2893635&h=2666e10fd32e93612036';

      const fileDataObj = {
        fileName: fullFileName,
        fileContent: (e.target as FileReader).result,
        scriptID: 292,
        deploymentID: 1,
      };

      console.log('STEP 1 - we are sending fileDataObj to get the fileID');
      const getFileIdentifiers = await handleHttpRequest(fileDataObj, baseUrl);

      if (getFileIdentifiers.error) {
        const err_msg = getFileIdentifiers.err_message;
        alert(
          `Error on creating file ID: ${err_msg}. We should implement here some action what we want to do if this error appears for this file`
        );
        terminate(index);
      } else if (getFileIdentifiers.output.fileID) {
        const fileID = getFileIdentifiers.output.fileID;

        setFileObjs((currentFileObjs) => {
          const updatedFileObjs = [...currentFileObjs];
          updatedFileObjs[index] = {
            ...updatedFileObjs[index],
            loaderText: `Created file id : ${fileID}`,
          };
          return updatedFileObjs;
        });

        const bomImportCreateObj = {
          action: 'create',
          custrecord_bom_import_importd_file_url: fileID,
          custrecord_bom_import_file_import_order: 1, // change to generate index
          custrecord_bom_import_transaction: 3, // capture transaction id from record if record is in edit mode
          custrecord_orion_bom_intialization_ident: 'GmOBKvsQkQ4R3U2N', //capture the intialization identity number from the front end script
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
          alert(
            `Error on bomImportCreateObj: ${err_msg} We should implement here some action what we want to do if this error appears for this file.`
          );
          terminate(index);
        } else if (getBomImportCreateObj.bomRecordID) {
          const bomRecordID = getBomImportCreateObj.bomRecordID;
          console.log(
            'bomRecordID was created as',
            bomRecordID,
            'but we are not using it yet, only to assign it to to local array, but it is not used in HTTP'
          );

          setFileObjs((currentFileObjs) => {
            const updatedFileObjs = [...currentFileObjs];
            updatedFileObjs[index] = {
              ...updatedFileObjs[index],
              loaderText: `Created BOM Record Id : ${bomRecordID}`,
              bomRecordID,
              fileLoading: false,
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
          const createJson = await handleHttpRequest(dataToJson, baseUrl);
          if (createJson.error) {
            const err_msg = createJson.err_message;
            alert(
              `Error on createJson: ${err_msg} We should implement here some action what we want to do if this error appears for this file.`
            );
            terminate(index);
          } else {
            const fileJSON = createJson.lineJSON;
            const newPayload = {
              ...fileJSON,
              scriptID: 219,
              deploymentID: 1,
            };
            console.log(
              'STEP 4 - having lineJSON now, we are sending lineJSON, with script 219 and deployment id=1, I called this function :createFileAgain like that for no, as I  dont know what it suppose to return, as at this step we receive error'
            );
            const createFileAgain = await handleHttpRequest(
              newPayload,
              baseUrl
            );
            console.log('createFileAgain', createFileAgain);
            if (createFileAgain.error) {
              const err_msg = createFileAgain.err_message;
              alert(
                `Error on createFileAgain: ${err_msg} We should implement here some action what we want to do if this error appears for this file.`
              );
              terminate(index);
            } else {
              alert(`createFileAgain WORKED - what is the next step?.`);
            }
          }
        }
      }

      ////--- Stefan's workers block ----/////
      ////--- for some reason the POST is not even getting initiated when I was testing it ----/////

      // post the message (object) to the web worker
      // fileWorker.postMessage(fileDataObj);

      // on return of the message from the web worker, apply the file to the BoM import record
      // fileWorker.onmessage = (e) => {
      //   console.log('fileWorker', e);
      //   const { response, error } = e.data;
      //   if (response) {
      //     console.log('File uploaded successfully:', response);
      //     const fileID = response.output.fileID; // update the file URL on the fileObj with the file URL result

      //     // define fields to set on object
      //     const bomImportCreateObj = {
      //       action: 'create',
      //       custrecord_bom_import_importd_file_url: fileID,
      //       custrecord_bom_import_file_import_order: 1, // change to generate index
      //       custrecord_bom_import_transaction: 3, // capture transaction id from record if record is in edit mode
      //       custrecord_orion_bom_intialization_ident: 'GmOBKvsQkQ4R3U2N', //capture the intialization identity number from the front end script
      //       scriptID: 290,
      //       deploymentID: 1,
      //       endpoint: bomImportCreateURL,
      //     };

      //     bomImportWorker.postMessage(bomImportCreateObj);
      //   } else if (error) {
      //     console.error('Error uploading file:', error);
      //   }
      // };
      // on return of the message from the web worker, capture the bom record id
      // bomImportWorker.onmessage = (e) => {
      //   console.log('bomImportWorker', e);
      //   const { response, error } = e.data;
      //   if (response) {
      //     console.log('BoM Import record created successfully:', response);
      //     const bomRecordID = response.output.recordID;
      //     console.log('bomRecordID', bomRecordID);
      //   } else if (error) {
      //     console.error('Error creating BoM Import record:', error);
      //   }
      // };

      ////---^^^^^^^^^^ Stefan's workers block ^^^^^^^^^^^----/////
    };

    reader.readAsText(file, 'UTF-8');
  };

  const onAction = () => {
    alert('action on arrow click');
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
