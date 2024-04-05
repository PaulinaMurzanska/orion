import { Button, Input } from '@orionsuite/shared-components';
import { useMemo, useState } from 'react';

import CustomTableWithCustomInputDemo from './CustomTableWithCustomInputDemo';
import { Order } from '@orionsuite/dtos';
import { inputVariants } from '../../../components/custom-input/type';

type TableDemoDataType = {
  id: string;
  name: string;
  price: number;
  description: string;
  percent: number;
  number: number;
  [key: string]: any;
};

const EditableTableDemo = () => {
  const dataArrDemo: TableDemoDataType[] = [
    {
      id: '1234',
      name: 'some name',
      price: 230,
      description: 'some description',
      percent: 0.25,
      number: 22,
    },
    {
      id: '1235',
      name: 'some name',
      price: 250,
      description: 'some description 2',
      percent: 0.4,
      number: 45,
    },
  ];

  const [data, setData] = useState<TableDemoDataType[]>(dataArrDemo);
  const [editable, setEditable] = useState<boolean | undefined>();
  const [search, setSearch] = useState<string | undefined>('');
  const [selectedRows, setSelectedRows] = useState<Order[]>([]);

  const columns = useMemo(
    () => [
      {
        id: 'id',
        header: 'ID',
        disabled: true,
      },
      {
        id: 'name',
        header: 'Name',
        disabled: true,
      },
      {
        id: 'description',
        header: 'Description',
      },
      {
        id: 'price',
        header: 'Price',
        cell_variant: inputVariants.CURRENCY,
      },
      {
        id: 'percent',
        header: 'Percent',
        cell_variant: inputVariants.PERCENT,
      },
      {
        id: 'number',
        header: 'Number',
        cell_variant: inputVariants.NUMBER,
      },
    ],
    []
  );

  const onRowSelectionChange = (selectedRows: TableDemoDataType[]) => {
    setSelectedRows(selectedRows);
  };

  return (
    <>
      <div className="m-10">
        <p className="font-semibold text-lg">
          This component mimics behavior of OrdersTable component in the shape
          from date: 20th March '23, just to show how we can use the various
          input types in the table
        </p>
        <div className="p-4">
          <h2 className="font-semibold text-base">The Editable Table Demo:</h2>
          <ul className="list-disc">
            <li className="mb-2">
              utilizes CustomTableWithCustomInputDemo instead of CustomTable -
              this is because I didn't want to make changes to CustomTable
              component, and the change I needed to make was replacing
              EditableCell with CustomEditableCell
            </li>
            <li className="mb-2">
              utilizes the CustomEditableCell instead of EditableCell - because
              CustomEditableCell replaces the 'input' with CustomInput
            </li>
            <li className="mb-2">
              CustomInput was replaced, because the it has the logic that allows
              to use input in multiple variants :currency,number, text, percent
            </li>
            <li className="mb-2">
              in order to set the correct field type, we need to add to Header a
              property with the cell_variant.
            </li>
            <li className="mb-2">
              also assuming, that not all cells will be editable, I added an
              optional property "disabled" to headers definition
            </li>
            <li className="mb-2">
              <b>In order to use CustomInput in the table</b> - to have
              currency, percent,text and number formatting - you just need to
              replace in the CustomTable.tsx the EditableCell with
              CustomEditableCell.There has to be added two additional props:
              "cell_variant" and "disabled" - those properties can be defined in
              the table headers objects.
            </li>
          </ul>
        </div>
        <CustomTableWithCustomInputDemo<TableDemoDataType>
          data={data ?? []}
          columns={columns}
          onRowSelectionChange={onRowSelectionChange}
          header={<h1 className="text-3xl font-extrabold">Orders table</h1>}
          editable={editable}
          search={search}
          setSearch={setSearch}
          onRowUpdate={(rowIndex, columnId, value) => {
            console.log('Row updated', rowIndex, columnId, value);
            const newData = [...data];
            newData[rowIndex] = {
              ...newData[rowIndex],
              [columnId]: value,
            };
            console.log('newData:', newData);

            // setData(newData); //this makes the focus is lost, we can't use Tab to switch focus from field to field, don't know what is the reason.
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
                  <Button
                    variant="ghost"
                    onClick={() => setEditable(!editable)}
                  >
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
    </>
  );
};

export { EditableTableDemo };
