import { Order } from '@orionsuite/dtos';
import CustomTable from '../components/custom-table/CustomTable';
import { Button, Input } from '@orionsuite/shared-components';
import { useMemo, useState } from 'react';
import { api } from '@orionsuite/api-client';

const OrdersTable = () => {
  const { data } = api.useGetOrdersQuery();

  const [search, setSearch] = useState<string | undefined>();
  const [selectedRows, setSelectedRows] = useState<Order[]>([]);

  const filteredData = useMemo(() => {
    if (search) {
      return (
        data?.filter((row) =>
          row.name.toLowerCase().includes(search.toLowerCase())
        ) ?? []
      );
    }
    return data ?? [];
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

  const onRowSelectionChange = (selectedRows: Order[]) => {
    setSelectedRows(selectedRows);
  };

  return (
    <div className="m-10">
      <CustomTable<Order>
        data={filteredData}
        columns={columns}
        onRowSelectionChange={onRowSelectionChange}
        header={<h1 className="text-3xl font-extrabold">Orders table</h1>}
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

export default OrdersTable;
