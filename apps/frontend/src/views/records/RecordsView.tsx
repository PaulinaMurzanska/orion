import { useCallback, useEffect, useMemo, useState } from 'react';

import CustomTable from '../../components/custom-table/CustomTable';
import { Record } from '@orionsuite/dtos';
import { api } from '@orionsuite/api-client';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import ProgressSpin from '../../components/progress-spin/ProgressSpin';
import Footer from './table/Footer';
import Actions from './table/Actions';
import { useDispatch, useSelector } from 'react-redux';
import { setRecords } from './recordsSlice';
import { RootState } from '../../../store';

const RecordsView = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = api.useGetRecordsQuery({
    script: 220,
    deploy: 1,
  });
  const { records, columns } = useSelector(
    (state: RootState) => state.recordsSlice
  );
  const [error, setError] = useState<string | undefined>();
  const [editable, setEditable] = useState<boolean | undefined>();
  const [search, setSearch] = useState<string | undefined>();
  const [selectedRows, setSelectedRows] = useState<Record[]>([]);
  const ids = useMemo(
    () => records?.map(({ id }) => String(id)) ?? [],
    [records]
  );

  const onRowSelectionChange = useCallback((selectedRows: Record[]) => {
    setSelectedRows(selectedRows);
  }, []);

  useEffect(() => {
    if (data && data.content) {
      try {
        const parsed = JSON.parse(data.content ?? '{}');
        const items =
          parsed?.slice(0, 50).map((item: any) => ({
            ...item,
            // id: `${item.itemid}/${item.line}`, // TODO: Use UUID when available
          })) ?? [];
        dispatch(setRecords(items));
      } catch (e: any) {
        console.error(e);
        setError(e.toString());
      }
    }
  }, [dispatch, data]);

  if (isLoading) {
    return (
      <div className="m-10">
        <ProgressSpin size={10} />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="m-6">
      <CustomTable<Record>
        data={records}
        columns={columns}
        onRowSelectionChange={onRowSelectionChange}
        editable={editable}
        search={search}
        setSearch={setSearch}
        selectedRows={selectedRows}
        onRowUpdate={(rowIndex, columnId, value) => {
          const tmp: Record[] = [];
          records.forEach((record, index) => {
            if (index === rowIndex) {
              tmp.push({
                ...record,
                [columnId]: value,
              });
            } else {
              tmp.push(record);
            }
          });
          dispatch(setRecords(tmp));
        }}
        onRowDragEnd={(event: DragEndEvent) => {
          const { active, over } = event;
          if (active && over && active.id !== over.id) {
            const tmp: Record[] = [...records];
            const oldIndex = ids.indexOf(String(active.id));
            const newIndex = ids.indexOf(String(over.id));
            const newRecords = arrayMove(tmp, oldIndex, newIndex);
            dispatch(setRecords(newRecords));
          }
        }}
        actions={<Actions editable={editable} setEditable={setEditable} />}
        footer={<Footer records={records} selectedRows={selectedRows} />}
      />
    </div>
  );
};

export default RecordsView;
