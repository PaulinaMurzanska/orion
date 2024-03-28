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

import Icon from '@mdi/react';
import { mdiSofaSingle } from '@mdi/js';

const BomCustomDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <CustomTriggerButton variant="outline" className="uppercase">
          <Icon path={mdiSofaSingle} size={1} />
          bom import tool
        </CustomTriggerButton>
      </DialogTrigger>
      <CustomDialogContent overlayClassName="bg-black/30" closeIconTop={false}>
        <StyledInnerContent>inner content</StyledInnerContent>
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
