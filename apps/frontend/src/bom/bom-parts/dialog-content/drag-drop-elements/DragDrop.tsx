import {
  StyledAttachment,
  StyledAttachmentIcon,
  StyledContentCentered,
  StyledDivider,
  StyledDragDrop,
  StyledDragTextSmall,
  StyledDragTitle,
  StyledDropButton,
} from './StyledDragDrop';
import { useCallback, useEffect, useRef, useState } from 'react';

import { FileObjectType } from '../../type';
import { mdiAttachment } from '@mdi/js';
import { setDisableDragDrop } from '../../../../../store/bom-store/bomSlice';
import { useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';

interface DragProps {
  onDropFunction: (dropzoneId: string, file: any) => void;
  fileObj: FileObjectType;
}

const DragDrop = ({ fileObj, onDropFunction }: DragProps) => {
  const [rejected, setRejected] = useState<any>([]);
  const dropzoneRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const onDrop = useCallback((acceptedFiles: any, rejectedFiles: any) => {
    if (acceptedFiles?.length) {
      const curFile = acceptedFiles[0];
      const dropzoneId = dropzoneRef.current ? dropzoneRef.current.id : '';
      onDropFunction(dropzoneId, curFile);
    }
    if (rejectedFiles?.length) {
      setRejected((prevFiles: any) => [...prevFiles, ...rejectedFiles]);
    }
  }, []);

  const showRejectedAlert = (err: string) => {
    if (rejected.length > 0) {
      const error = rejected[0].errors[0].message;
      window.alert(`File cannot be uploaded: ${error}`);
      setRejected([]);
    }
  };

  useEffect(() => {
    if (rejected?.length > 0) {
      showRejectedAlert(rejected[0].errors[0].message);
    }
  }, [rejected]);

  const fileTypeValidator = (file: any) => {
    const allowedExtensions = ['.sif', '.pmx', '.xml', '.xls', '.csv'];
    if (file.name) {
      const extension = '.' + file.name.split('.').pop();

      if (!allowedExtensions.includes(extension)) {
        return {
          code: 'invalid-extension',
          message: `File extension '${extension}' is not allowed. Allowed extensions are: ${allowedExtensions.join(
            ', '
          )}`,
        };
      }
    }

    return null;
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    validator: fileTypeValidator,
  });

  const handleButtonEnter = (e: any) => {
    e.stopPropagation();
    const type = e.currentTarget.getAttribute('data-type');
    if (type === 'button') {
      dispatch(setDisableDragDrop(true));
      console.log('handleButtonEnter');
    }
  };
  const handleButtonLeave = (e: any) => {
    e.stopPropagation();
    const type = e.currentTarget.getAttribute('data-type');
    if (type === 'button') {
      dispatch(setDisableDragDrop(false));
    }
  };
  const handleButtonClick = (e: any) => {
    e.stopPropagation();
    const type = e.currentTarget.getAttribute('data-type');
    if (type === 'button') {
      open();
    }
  };

  return (
    <>
      <StyledDragDrop
        {...getRootProps({
          refKey: 'idref',
        })}
        id={fileObj.id}
        ref={dropzoneRef}
        data-type="drop"
      >
        <StyledContentCentered className="justify-center">
          <input {...getInputProps()} />
          <StyledAttachment extension={fileObj.fileExtension}>
            {fileObj.fileExtension !== '' ? (
              <p className="text-2xl font-medium">{fileObj.fileExtension}</p>
            ) : (
              <StyledAttachmentIcon path={mdiAttachment} size={1.5} />
            )}
          </StyledAttachment>
          <StyledDragTitle className="font-bold leading-none">
            {fileObj.fileName}
          </StyledDragTitle>
          <StyledDragTextSmall>
            {fileObj.fileAdded ? 'Successfully Loaded' : 'Your File Here'}
          </StyledDragTextSmall>
          <StyledDivider />
          <StyledDragTextSmall>
            {fileObj.fileAdded ? '' : 'or'}
          </StyledDragTextSmall>
          <StyledDropButton
            type="button"
            onClick={handleButtonClick}
            onMouseEnter={handleButtonEnter}
            onMouseLeave={handleButtonLeave}
            data-type="button"
          >
            {fileObj.fileAdded ? 'Change File' : 'Search for File on PC'}
          </StyledDropButton>
        </StyledContentCentered>
      </StyledDragDrop>
    </>
  );
};

export default DragDrop;
