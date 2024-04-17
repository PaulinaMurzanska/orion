import { useCallback, useEffect, useMemo, useState } from 'react';

import CustomTable from '../../components/custom-table/CustomTable';
import { Record } from '@orionsuite/dtos';
import { api } from '@orionsuite/api-client';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import ProgressSpin from '../../components/progress-spin/ProgressSpin';
import Footer from './table/Footer';
import Filters from './table/Filters';
import Actions from './table/Actions';

const BomRecordsView = () => {
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

  const onRowSelectionChange = useCallback((selectedRows: Record[]) => {
    setSelectedRows(selectedRows);
  }, []);

  useEffect(() => {
    if (data && data.content) {
      const parsed = JSON.parse(data.content ?? '{}');
      const items =
        parsed?.lineJSON?.item?.items?.slice(0, 50).map((item: any) => ({
          ...item,
          id: `${item.itemid}/${item.line}`, // TODO: Use UUID when available
        })) ?? [];
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
        selectedRows={selectedRows}
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
        actions={<Actions editable={editable} setEditable={setEditable} />}
        filters={<Filters setSearch={setSearch} search={search} />}
        footer={<Footer records={records} selectedRows={selectedRows} />}
      />
    </div>
  );
};

export default BomRecordsView;
