import { Button, Input } from '@orionsuite/shared-components';
import { useMemo, useState } from 'react';

import CustomTable from '../components/custom-table/CustomTable';
import { Order } from '@orionsuite/dtos';
import { api } from '@orionsuite/api-client';

const OrdersTable = () => {
  const { data } = api.useGetOrdersQuery();

  const [editable, setEditable] = useState<boolean | undefined>();
  const [search, setSearch] = useState<string | undefined>();
  const [selectedRows, setSelectedRows] = useState<Order[]>([]);

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

  const onRowSelectionChange = (selectedRows: Order[]) => {
    setSelectedRows(selectedRows);
  };

  return (
    <div className="m-10">
      <CustomTable<Order>
        data={data ?? []}
        columns={columns}
        onRowSelectionChange={onRowSelectionChange}
        header={<h1 className="text-3xl font-extrabold">Orders table</h1>}
        editable={editable}
        search={search}
        setSearch={setSearch}
        onRowUpdate={(rowIndex, columnId, value) => {
          console.log('Row updated', rowIndex, columnId, value);
        }}
        actions={
          <>
            {!editable && (
              <Button variant="ghost" onClick={() => setEditable(!editable)}>
                Edit
              </Button>
            )}
            {editable && (
              <>
                <Button variant="ghost" onClick={() => setEditable(!editable)}>
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setEditable(!editable)}
                >
                  Save
                </Button>
              </>
            )}
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

export default OrdersTable;
