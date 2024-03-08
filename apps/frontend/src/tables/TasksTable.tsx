import { Table } from '@orionsuite/shared-components';
import { Column, createColumnHelper } from '@tanstack/react-table';

interface Task {
  id: number;
  name: string;
}

const columnHelper = createColumnHelper<Task>();

const columns = [
  columnHelper.accessor((row) => row, {
    id: 'id',
    header: 'ID',
    cell: (props) => props.getValue().id,
  }),
  columnHelper.accessor((row) => row, {
    id: 'name',
    header: 'Name',
    cell: (props) => props.getValue().name,
  }),
] as Column<Task>[];

const exampleData: Task[] = [
  { id: 1, name: 'Task 1' },
  { id: 2, name: 'Task 2' },
  { id: 3, name: 'Task 3' },
];

const TasksTable = () => {
  return (
    <div className="m-10">
      <h1 className="text-4xl font-extrabold mb-5">Tasks table</h1>
      <Table columns={columns} data={exampleData} />
    </div>
  );
};

export default TasksTable;
