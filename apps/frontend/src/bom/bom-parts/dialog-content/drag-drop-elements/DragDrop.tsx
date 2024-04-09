import {
  StyledAttachment,
  StyledAttachmentIcon,
  StyledContentCentered,
  StyledDragDrop,
  StyledDragTextSmall,
  StyledDragTitle,
  StyledDropButton,
} from './StyledDragDrop';
import { useCallback, useEffect, useRef, useState } from 'react';

import { FileObjectType } from '../../type';
import { mdiAttachment } from '@mdi/js';
import { useDropzone } from 'react-dropzone';

interface DragProps {
  onDropFunction: (dropzoneId: string, file: any) => void;
  fileObj: FileObjectType;
}

const DragDrop = ({ fileObj, onDropFunction }: DragProps) => {
  const [rejected, setRejected] = useState<any>([]);
  const dropzoneRef = useRef<HTMLDivElement | null>(null);

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
    window.alert(`File can not be uploaded: ${err}`);
    setRejected([]);
  };

  useEffect(() => {
    if (rejected?.length > 0) {
      showRejectedAlert(rejected[0].errors[0].message);
    }
  }, [rejected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // accept: {
    // '.sif': ['.sif'],  // format not supported with accept property, different validation needed
    // '.pmx': ['.pmx'],  // format not supported with accept property, different validation needed
    // 'application/xml': ['.xml'],
    // 'application/vnd.ms-excel': ['.xls', '.csv'],
    // }, // this object sets what files should be accepted
    // maxSize: 1024 * 1000, // this objects sets max size if need it
  });

  return (
    <>
      <StyledDragDrop
        {...getRootProps({
          refKey: 'idRef',
        })}
        id={fileObj.id}
        ref={dropzoneRef}
      >
        <StyledContentCentered>
          <input {...getInputProps()} />
          <StyledAttachment extension={fileObj.fileExtension}>
            {fileObj.fileExtension !== '' ? (
              <p className="text-2xl font-medium">{fileObj.fileExtension}</p>
            ) : (
              <StyledAttachmentIcon path={mdiAttachment} size={2.5} />
            )}
          </StyledAttachment>
          <StyledDragTitle className="font-bold text-lg m-0 leading-none">
            {fileObj.fileName}
          </StyledDragTitle>
          <StyledDragTextSmall>
            {fileObj.fileAdded ? 'Successfully Loaded' : 'Your File Here'}
          </StyledDragTextSmall>
          <StyledDropButton>
            {fileObj.fileAdded ? 'Change File' : 'Search for File'}
          </StyledDropButton>
        </StyledContentCentered>
      </StyledDragDrop>
    </>
  );
};

export default DragDrop;
