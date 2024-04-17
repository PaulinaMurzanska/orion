import { Input } from '@orionsuite/shared-components';
import { BomCustomDialog } from '../../../bom/bom-parts/bom-dialog/BomCustomDialog';

interface Props {
  search?: string;
  setSearch: (value: string) => void;
}

const Filters = ({ search, setSearch }: Props) => {
  return (
    <div className="flex gap-2 items-center">
      <Input
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <BomCustomDialog />
    </div>
  );
};

export default Filters;
