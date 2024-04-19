import { Input } from '@orionsuite/shared-components';
import { BomCustomDialog } from '../../../bom/bom-parts/bom-dialog/BomCustomDialog';

interface Props {
  search?: string;
  setSearch: (value: string) => void;
}

const Filters = ({ search, setSearch }: Props) => {
  return (
    <div className="flex gap-2 items-center">
      <BomCustomDialog />
    </div>
  );
};

export default Filters;
