import CustomTable from '../components/custom-table/CustomTable';

interface Pricing {
  id: number;
  name: string;
  price: number;
  description: string;
}

const PricingTable = () => {
  const data = [
    {
      id: 1,
      name: 'Basic',
      price: 10,
      description: 'Basic description',
    },
    {
      id: 2,
      name: 'Pro',
      price: 20,
      description: 'Pro description',
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 30,
      description: 'Enterprise description',
    },
  ] as Pricing[];

  const columns = [
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
  ];

  return (
    <div className="m-10">
      <h1 className="text-4xl font-extrabold mb-5">Pricing table</h1>
      <CustomTable<Pricing> columns={columns} data={data} />
    </div>
  );
};

export default PricingTable;
