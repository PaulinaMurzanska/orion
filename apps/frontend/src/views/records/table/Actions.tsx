import { Button } from '@orionsuite/shared-components';
import { BomCustomDialog } from '../../../bom/bom-parts/bom-dialog/BomCustomDialog';
import { Edit2Icon, SaveIcon } from 'lucide-react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useSelector } from 'react-redux';
import { RootState } from 'apps/frontend/store';
import { api } from '@orionsuite/api-client';
import NetsuiteService from '../../../netsuite/netsuiteService';

interface Props {
  editable?: boolean;
  setEditable: (value: boolean) => void;
}

const Actions = ({ editable, setEditable }: Props) => {
  const { records } = useSelector((state: RootState) => state.recordsSlice);

  const [updateRecords] = api.useUpdateRecordMutation();

  const onCommit = () => {
    updateRecords({
      script: 220,
      deploy: 1,
      fileContent: JSON.stringify(records),
      fileID: 1304,
    })
      .then((res) => {
        NetsuiteService.insertSummaryIntoNetsuite(records, true);
      })
      .catch((e) => console.log('ERR', e));
  };

  return (
    <>
      <Button
        disabled={editable}
        variant="default"
        className="bg-blue-600 hover:bg-blue-500 flex gap-2"
        onClick={() => setEditable(!editable)}
      >
        <Edit2Icon width="18px" height="18px" />
        Edit table
      </Button>
      <Button
        disabled={!editable}
        className="flex gap-1 bg-blue-600 hover:bg-blue-500"
        onClick={onCommit}
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
