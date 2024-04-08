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
import { nanoid } from 'nanoid';

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

  const onDropFunction = async (dropzoneId: string, file: any) => {
    const index = fileObjs.findIndex((obj: any) => obj.id === dropzoneId);
    if (index === -1) return;

    const fileData = extractFileNameAndExtension(file.name);
    const fileName = fileData.fileName;
    const fullFileName = file.name;
    const fileExtension = fileData.extension;

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

      console.log(
        'All the steps from the Vue onDrop Function - webworkers that are defined in the reader.onload block'
      );
      await new Promise((resolve) => setTimeout(resolve, 4000)); // Temporary simulating asynchronous operation timeout

      setFileObjs((currentFileObjs) => {
        const updatedFileObjs = [...currentFileObjs];
        updatedFileObjs[index] = {
          ...updatedFileObjs[index],
          fileLoading: false,
        };
        return updatedFileObjs;
      });
    };

    reader.readAsText(file, 'UTF-8');
  };

  const onAction = () => {
    alert('action on arrow click');
  };

  useEffect(() => {
    console.log('use effect array upddated');
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
