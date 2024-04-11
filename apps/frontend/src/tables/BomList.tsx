import { Button, Input } from '@orionsuite/shared-components';
import { useEffect, useMemo, useState } from 'react';

import CustomTable from '../components/custom-table/CustomTable';
import { Order, Record } from '@orionsuite/dtos';
import { api } from '@orionsuite/api-client';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import ProgressSpin from '../components/progress-spin/ProgressSpin';
import _ from 'lodash';

const BomList = () => {
  const { data, isLoading } = api.useGetRecordsQuery({
    script: 220,
    deploy: 1,
  });

  const [editable, setEditable] = useState<boolean | undefined>();
  const [search, setSearch] = useState<string | undefined>();
  const [selectedRows, setSelectedRows] = useState<Record[]>([]);

  const [records, setRecords] = useState<Record[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const ids = useMemo(
    () => records?.map(({ id }) => String(id)) ?? [],
    [records]
  );

  const onRowSelectionChange = (selectedRows: Record[]) => {
    setSelectedRows(selectedRows);
  };

  useEffect(() => {
    if (data && data.content) {
      const parsed = JSON.parse(data.content ?? '{}');
      const items = parsed?.lineJSON?.item?.items?.slice(0, 100) ?? [];
      const columns = Object.keys(items[0]).map((key) => ({
        id: key,
        header: key,
      }));
      setRecords(items);
      setColumns(columns);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="m-10">
        <ProgressSpin size={10} />
      </div>
    );
  }

  return (
    <div className="m-6">
      <CustomTable<Record>
        data={records}
        columns={columns}
        onRowSelectionChange={onRowSelectionChange}
        header={<h1 className="text-3xl font-extrabold">Bom records</h1>}
        editable={editable}
        search={search}
        setSearch={setSearch}
        onRowUpdate={(rowIndex, columnId, value) => {
          setRecords((old) =>
            old.map((row, index) => {
              if (index === rowIndex) {
                return {
                  ...old[rowIndex],
                  [columnId]: value,
                };
              }
              return row;
            })
          );
        }}
        onRowDragEnd={(event: DragEndEvent) => {
          const { active, over } = event;
          if (active && over && active.id !== over.id) {
            setRecords((data) => {
              const oldIndex = ids.indexOf(String(active.id));
              const newIndex = ids.indexOf(String(over.id));
              return arrayMove(data, oldIndex, newIndex);
            });
          }
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
        footer={
          <>
            <div>
              <b>Lines selected:</b> {selectedRows.length ?? 0}/
              {records.length ?? 0}
            </div>
            <div style={{ margin: '0 0 0 auto' }}>
              <b>Quantity:</b> 0
            </div>
            <div>
              <b>Cost:</b> $0
            </div>
            <div>
              <b>Sell:</b> $0
            </div>
            <div>
              <b>GP$:</b> $0
            </div>
            <div>
              <b>GP%:</b> 0%
            </div>
          </>
        }
      />
    </div>
  );
};

export default BomList;
