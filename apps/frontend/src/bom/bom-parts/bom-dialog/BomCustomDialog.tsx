import {
  CustomButton,
  CustomDialogContent,
  CustomTriggerButton,
  StyledInnerContent,
} from './StyledBomDialog';
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogTrigger,
} from '@orionsuite/shared-components';

import BomDialogContent from '../dialog-content/BomDialogContent';
import { FileObjectType } from '../type';
import Icon from '@mdi/react';
import { mdiSofaSingle } from '@mdi/js';
import { nanoid } from 'nanoid';
import { useState } from 'react';

const fileObjEmpty: FileObjectType = {
  id: '',
  fileLoading: false,
  fileAdded: false,
  fileName: 'Drag and Drop',
  fullFileName: '',
  fileExtension: '',
  fileContent: '',
  bomRecordID: null,
  bomRecordStatus: 1,
  fileJSON: {},
  file: null,
  itemLines: [],
};

const BomCustomDialog = () => {
  const idInitial = nanoid(8);
  const initialObject = { ...fileObjEmpty };
  initialObject.id = idInitial;
  const [fileObjs, setFileObjs] = useState<FileObjectType[]>([initialObject]);

  const setFilesDataArray = (filesArray: FileObjectType[]) => {
    setFileObjs(filesArray);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <CustomTriggerButton variant="outline" className="uppercase">
          <Icon path={mdiSofaSingle} size={1} />
          bom import tool
        </CustomTriggerButton>
      </DialogTrigger>
      <CustomDialogContent overlayClassName="bg-black/30" closeIconTop={false}>
        <StyledInnerContent>
          <BomDialogContent
            setFilesDataArray={setFilesDataArray}
            fileObjs={fileObjs}
            emptyObject={fileObjEmpty}
          />
        </StyledInnerContent>
        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <CustomButton type="button" variant="ghost">
              Close
            </CustomButton>
          </DialogClose>
        </DialogFooter>
      </CustomDialogContent>
    </Dialog>
  );
};

export { BomCustomDialog };
