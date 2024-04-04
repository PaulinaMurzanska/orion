import { Button, Input } from '@orionsuite/shared-components';
import { useEffect, useMemo, useState } from 'react';

import CustomTable from '../components/custom-table/CustomTable';
import { Order, Record } from '@orionsuite/dtos';
import { api } from '@orionsuite/api-client';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

const BomList = () => {
  const { data } = api.useGetRecordsQuery({ script: 1002, deploy: 1 });

  const [editable, setEditable] = useState<boolean | undefined>();
  // const [search, setSearch] = useState<string | undefined>();
  // const [selectedRows, setSelectedRows] = useState<Record[]>([]);

  const [records, setRecords] = useState<Record[]>([]);
  // const ids = useMemo(() => orders?.map(({ id }) => id) ?? [], [orders]);

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
        cellVariant: 'currency',
      },
      {
        id: 'description',
        header: 'Description',
      },
    ],
    []
  );

  const onRowSelectionChange = (selectedRows: Record[]) => {
    // setSelectedRows(selectedRows);
  };

  useEffect(() => {
    setRecords(data?.bomRecs ?? []);
  }, [data]);

  return (
    <div className="m-6">
      <CustomTable<Record>
        data={records}
        columns={columns}
        onRowSelectionChange={onRowSelectionChange}
        header={<h1 className="text-3xl font-extrabold">Orders table</h1>}
        // editable={editable}
        // search={search}
        // setSearch={setSearch}
        onRowUpdate={(rowIndex, columnId, value) => {
          // setOrders((old) =>
          //   old.map((row, index) => {
          //     if (index === rowIndex) {
          //       return {
          //         ...old[rowIndex],
          //         [columnId]: value,
          //       };
          //     }
          //     return row;
          //   })
          // );
        }}
        onRowDragEnd={(event: DragEndEvent) => {
          const { active, over } = event;
          // if (active && over && active.id !== over.id) {
          //   setOrders((data) => {
          //     const oldIndex = ids.indexOf(String(active.id));
          //     const newIndex = ids.indexOf(String(over.id));
          //     return arrayMove(data, oldIndex, newIndex);
          //   });
          // }
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
              // value={search}
              // onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        }
        // footer={<div>Selected rows {selectedRows.length ?? 0}</div>}
      />
    </div>
  );
};

export default BomList;
