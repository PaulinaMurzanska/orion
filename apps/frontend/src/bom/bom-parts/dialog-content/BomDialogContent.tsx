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
import FileWorker from '../../../workers/FileWorker?worker&inline';
import StatusZone from './drag-drop-elements/StatusZone';
import { extractFileNameAndExtension } from '../../../helpers/nameFormatting';
import { nanoid } from 'nanoid';
import { postToEndpoint2 } from '../../../workers/FileWorker';
import { postToEndpoint3 } from '../../../workers/FileWorker';

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

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const fileContent = (e.target as FileReader).result;

      setFileObjs((currentFileObjs) => {
        const updatedFileObjs = [...currentFileObjs];
        updatedFileObjs[index] = {
          ...updatedFileObjs[index],
          fileContent,
        };
        return updatedFileObjs;
      });
      const updatedFileObjs = [...fileObjs];
      const fileObj = updatedFileObjs[index];

      // jsonCreateWorker.onmessage = (e) => {
      //   console.log('jsonCreateWorker-e', e);
      //   const { response, error } = e.data;
      //   if (response) {
      //     console.log('JSON record created successfully:', response);
      //     fileObj.bomRecordID = response.output.recordID;

      //     // create object with necessary params for JSON conversion web worker to run
      //     const JSONDataObj = {
      //       fileName: fullFileName,
      //       fileContent: fileObj.fileContent,
      //       endpoint:
      //         'https://2584332.app.netsuite.com/app/site/hosting/restlet.nl?script=66&deploy=1', // TODO: adminable
      //     };

      //     jsonWorker.postMessage(JSONDataObj);
      //   } else if (error) {
      //     console.error('Error creating record', error);
      //   }
      // };

      // jsonUpdateWorker.onmessage = (e) => {
      //   console.log('jsonUpdateWorker', e);
      //   const { response, error } = e.data;

      //   if (response) {
      //     console.log('JSON record updated successfully:', response);
      //   } else if (error) {
      //     console.error('Error updating record:', error);
      //   }
      // };

      // // create listener that looks for the response from the file web worker once it's complete
      // fileWorker.onmessage = (e) => {
      //   console.log('fileWorker', e);
      //   const { response, error } = e.data;

      //   if (response) {
      //     console.log('File uploaded successfully:', response);
      //     fileObj.fileURL = response.output.fileURL; // update the file URL on the fileObj with the file URL result
      //   } else if (error) {
      //     console.error('Error uploading file:', error);
      //   }
      // };

      // jsonWorker.onmessage = (e) => {
      //   const { response, error } = e.data;

      //   if (response) {
      //     fileObj.fileJSON = response.output; // update the file JSON on the fileObj with the JSON result
      //     console.log(
      //       'JSON returned successfully:',
      //       JSON.stringify(response.output)
      //     );
      //     // TODO: update display for products/services/totals
      //     // trigger item check
      //     itemCheckWorker.postMessage({
      //       fileName: 'itemCheck',
      //       fileContent: response.output.lines.map((line: any) => line.sku),
      //       endpoint:
      //         'https://2584332.app.netsuite.com/app/site/hosting/restlet.nl?deploy=1&script=71', // TODO: adminable
      //     });

      //     jsonUpdateWorker.postMessage({
      //       fileName: 'JSONRecordUpdate',
      //       fileContent: {
      //         jsonRecordID: fileObj.bomRecordID,
      //         fieldData: {
      //           custrecord_bom_json: JSON.stringify(fileObj.fileJSON),
      //         },
      //       },
      //       endpoint:
      //         'https://2584332.app.netsuite.com/app/site/hosting/restlet.nl?script=235&deploy=1', // TODO: adminable
      //       method: 'PUT',
      //     });
      //   } else if (error) {
      //     console.error('Error converting file to JSON:', error);
      //   }
      // };

      // itemCheckWorker.onmessage = (e) => {
      //   console.log('THIS');
      //   const { response, error } = e.data;

      //   if (response) {
      //     console.log('JSON returned successfully:', JSON.stringify(response));
      //     console.log(JSON.stringify(response.output.itemsMissing));
      //     fileObj.itemLines = { ...response.output.itemsFound };
      //     // trigger item create
      //     const result = {
      //       items: response.output.itemsMissing.map((item: any) => ({
      //         itemname: item,
      //       })),
      //     };

      //     fileObj.loaderText = `Creating ${response.output.itemsMissing.length} Items`;

      //     itemCreateWorker.postMessage({
      //       fileName: 'itemCreate',
      //       fileContent: result,
      //       endpoint:
      //         'https://2584332.app.netsuite.com/app/site/hosting/restlet.nl?script=62&deploy=1', // TODO: adminable
      //     });

      //     // TODO: update item ids object
      //   } else if (error) {
      //     console.error('Error converting file to JSON:', error);
      //   }
      // };

      // itemCreateWorker.onmessage = (e) => {
      //   console.log('THIS');
      //   const { response, error } = e.data;
      //   console.log('JSON returned successfully:', JSON.stringify(response));

      //   fileObj.itemLines = {
      //     ...fileObj.itemLines,
      //     ...response.createdItemIds,
      //   };
      //   fileObj.fileLoading = false;
      //   fileObj.loaderText = `Created ${
      //     Object.keys(response.createdItemIds).length
      //   } Items\n${fileObj.fileJSON.lines.length} Line(s) Ready`;
      //   // return item ids.
      //   // TODO: update item ids object
      //   jsonUpdateWorker.postMessage({
      //     fileName: 'JSONRecordUpdate',
      //     fileContent: {
      //       jsonRecordID: fileObj.bomRecordID,
      //       fieldData: {
      //         custrecord_bom_json_status: 2,
      //         custrecord_bom_file_url: fileObj.fileURL,
      //         custrecord_bom_file_name: fileObj.fullFileName,
      //       },
      //     },
      //     endpoint:
      //       'https://2584332.app.netsuite.com/app/site/hosting/restlet.nl?script=235&deploy=1', // TODO: adminable
      //     method: 'PUT',
      //   });
      // };
      // // create object with necessary params for file upload web worker to run



      const newURL =
        'https://corsproxy.io/?https://td2893635.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=220&deploy=1&compid=TD2893635&h=2666e10fd32e93612036';

      const bomImportCreateURL = 'https://corsproxy.io/?https://td2893635.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=220&deploy=1'

      const fileDataObj = {
        fileName: fullFileName,
        fileContent: (e.target as FileReader).result,
        scriptID: 292,
        deploymentID: 1,
        endpoint: newURL,

        // 'https://2584332.app.netsuite.com/app/site/hosting/restlet.nl?script=64&deploy=1', // TODO: adminable
      };

      // post the message (object) to the web worker
      fileWorker.postMessage(fileDataObj)

      // on return of the message from the web worker, apply the file to the BoM import record
      fileWorker.onmessage = (e) => {
        console.log('fileWorker', e);
        const { response, error } = e.data;
        if (response) {
          console.log('File uploaded successfully:', response);
          const fileID = response.output.fileID; // update the file URL on the fileObj with the file URL result

          // define fields to set on object
          const bomImportCreateObj = {
            action: 'create',
            custrecord_bom_import_importd_file_url: fileID,
            custrecord_bom_import_file_import_order: 1, // change to generate index
            custrecord_bom_import_transaction: 3, // capture transaction id from record if record is in edit mode 
            custrecord_orion_bom_intialization_ident: 'GmOBKvsQkQ4R3U2N', //capture the intialization identity number from the front end script
            scriptID: 290,
            deploymentID: 1,
            endpoint: bomImportCreateURL
          };

          bomImportWorker.postMessage(bomImportCreateObj);

        } else if (error) {
          console.error('Error uploading file:', error);
        }
      }
      // on return of the message from the web worker, capture the bom record id
      bomImportWorker.onmessage = (e) => {
        console.log('bomImportWorker', e);
        const { response, error } = e.data;
        if (response) {
          console.log('BoM Import record created successfully:', response);
          const bomRecordID = response.output.recordID;
          console.log('bomRecordID', bomRecordID);
        } else if (error) {
          console.error('Error creating BoM Import record:', error);
        }
      }
      

      

      // let transactionID: string | undefined;
      // if (internalIDMatch) {
      //   transactionID = internalIDMatch[1];
      // } else {
      //   transactionID = undefined;
      // }

      // const createJSONRecordObj = {
      //   fileName: 'JSONRecordCreate',
      //   fileContent: {
      //     transactionID: transactionID,
      //   },
      //   endpoint:
      //     'https://2584332.app.netsuite.com/app/site/hosting/restlet.nl?script=234&deploy=1', // TODO: adminable
      // };

      // post messages to web workers
      // fileWorker.postMessage(fileDataObj);
      // jsonCreateWorker.postMessage(createJSONRecordObj);

      //-- temp code below --//
      // await new Promise((resolve) => setTimeout(resolve, 2000)); // Temporary simulating asynchronous operation timeout

      // setFileObjs((currentFileObjs) => {
      //   const updatedFileObjs = [...currentFileObjs];
      //   updatedFileObjs[index] = {
      //     ...updatedFileObjs[index],
      //     fileLoading: false,
      //     loaderText: `Creating - some response should be here- Items`,
      //   };
      //   return updatedFileObjs;
      // });
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
