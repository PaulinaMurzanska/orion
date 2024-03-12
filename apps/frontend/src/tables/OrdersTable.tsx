import { Column, createColumnHelper } from '@tanstack/react-table';

import { Table } from '@orionsuite/shared-components';

interface Order {
  id: number;
  name: string;
  createdDate: string;
  status: string;
}

const columnHelper = createColumnHelper<Order>();

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
  columnHelper.accessor((row) => row, {
    id: 'createdDate',
    header: 'Created date',
    cell: (props) => props.getValue().createdDate,
  }),
  columnHelper.accessor((row) => row, {
    id: 'status',
    header: 'Status',
    cell: (props) => props.getValue().status,
  }),
] as Column<Order>[];

const exampleData: Order[] = [
  { id: 1, name: 'Order 1', createdDate: '2021-01-01', status: 'New' },
  { id: 2, name: 'Order 2', createdDate: '2021-01-02', status: 'In progress' },
  { id: 3, name: 'Order 3', createdDate: '2021-01-03', status: 'Completed' },
  { id: 4, name: 'Order 4', createdDate: '2021-01-04', status: 'New' },
  { id: 5, name: 'Order 5', createdDate: '2021-01-05', status: 'In progress' },
];

const OrdersTable = () => {
  return (
    <div className="m-10">
      <h1 className="text-4xl font-extrabold mb-5">Orders table</h1>
      <Table columns={columns} data={exampleData} />
    </div>
  );
};

export default OrdersTable;
