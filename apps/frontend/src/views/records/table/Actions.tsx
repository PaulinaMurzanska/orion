import { Button } from '@orionsuite/shared-components';
import { BomCustomDialog } from '../../../bom/bom-parts/bom-dialog/BomCustomDialog';
import { Edit2Icon, SaveIcon } from 'lucide-react';
import { ChevronDownIcon } from '@radix-ui/react-icons';

interface Props {
  editable?: boolean;
  setEditable: (value: boolean) => void;
}

const Actions = ({ editable, setEditable }: Props) => {
  return (
    <>
      <Button
        variant="default"
        disabled={editable}
        className="bg-blue-600 hover:bg-blue-500 flex gap-2"
        onClick={() => setEditable(!editable)}
      >
        <Edit2Icon width="18px" height="18px" />
        Edit table
      </Button>
      <Button
        disabled={!editable}
        className="flex gap-1 bg-blue-600 hover:bg-blue-500"
        onClick={() => setEditable(!editable)}
      >
        <SaveIcon width="18px" height="18px" />
        Commit changes
      </Button>
      <BomCustomDialog />
      <Button
        style={{ margin: '0 0 0 auto' }}
        variant="default"
        className="bg-blue-600 hover:bg-blue-500"
      >
        Export to:
        <ChevronDownIcon width="20px" height="20px" />
      </Button>
      <Button variant="default" className="bg-blue-600 hover:bg-blue-500">
        Generate PO
      </Button>
      <Button variant="default" className="bg-purple-600 hover:bg-purple-500">
        PDF Composer
      </Button>
    </>
  );
};
export default Actions;
