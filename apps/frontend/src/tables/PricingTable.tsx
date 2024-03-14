import CustomTable from '../components/custom-table/CustomTable';
import { faker } from '@faker-js/faker';
import { useMemo, useState } from 'react';
import { Button, Input } from '@orionsuite/shared-components';

interface Pricing {
  id: string;
  name: string;
  price: number;
  description: string;
}

const PricingTable = () => {
  const [search, setSearch] = useState<string | undefined>();
  const [selectedRows, setSelectedRows] = useState<Pricing[]>([]);
  const data = useMemo(
    () =>
      Array.from(Array(53)).map(
        () =>
          ({
            id: faker.string.uuid(),
            price: faker.number.int(),
            name: faker.word.words(1),
            description: faker.word.words(8),
          } as Pricing)
      ),
    []
  );

  const filteredData = useMemo(() => {
    if (search) {
      return data.filter((row) =>
        row.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    return data;
  }, [data, search]);

  const columns = useMemo(
    () => [
      {
        id: 'id',
        header: 'ID',
      },
      {
        id: 'name',
        header: 'Name',
      },
      {
        id: 'price',
        header: 'Price',
      },
      {
        id: 'description',
        header: 'Description',
      },
    ],
    []
  );

  const onRowSelectionChange = (selectedRows: Pricing[]) => {
    setSelectedRows(selectedRows);
  };

  return (
    <div className="m-10">
      <CustomTable<Pricing>
        data={filteredData}
        columns={columns}
        onRowSelectionChange={onRowSelectionChange}
        header={<h1 className="text-3xl font-extrabold">Pricing table</h1>}
        actions={
          <>
            <Button variant="ghost">Edit</Button>
            <Button variant="secondary">Export to PDF</Button>
            <Button variant="secondary">Customer invoice</Button>
          </>
        }
        filters={
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        }
        footer={<div>Selected rows {selectedRows.length ?? 0}</div>}
      />
    </div>
  );
};

export default PricingTable;
