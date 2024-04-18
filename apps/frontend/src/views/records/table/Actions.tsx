import { Button } from '@orionsuite/shared-components';

interface Props {
  editable?: boolean;
  setEditable: (value: boolean) => void;
}

const Actions = ({ editable, setEditable }: Props) => {
  return (
    <>
      {!editable && (
        <Button variant="outline" onClick={() => setEditable(!editable)}>
          Edit
        </Button>
      )}
      {editable && (
        <>
          <Button variant="outline" onClick={() => setEditable(!editable)}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={() => setEditable(!editable)}>
            Save
          </Button>
        </>
      )}
      <Button variant="default" className="bg-blue-600 hover:bg-blue-500">Export to:</Button>
      <Button variant="default" className="bg-blue-600 hover:bg-blue-500">Generate PO</Button>
      <Button variant="default" className="bg-purple-600 hover:bg-purple-500">PDF Composer</Button>
    </>
  );
};
export default Actions;
