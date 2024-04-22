import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';

interface Props {
  selectedRows: any[];
  records: any[];
}

const Footer = ({ selectedRows, records }: Props) => {
  const { columns } = useSelector((state: RootState) => state.recordsSlice);

  const footerColumns = [
    ...columns.filter((col) => col.footer).map((col) => ({ ...col, count: 0 })),
  ];

  records.forEach((record) => {
    footerColumns.forEach((col) => {
      col.count += Number(record[col.id]);
    });
  });

  const getValue = (col: any) => {
    if (col.data_type === 'currency') {
      return `$${col.count}`;
    }
    return col.count;
  };

  return (
    <>
      <div style={{ margin: '0 auto 0 0' }}>
        <b>Lines selected:</b> {selectedRows.length ?? 0}/{records.length ?? 0}
      </div>
      {footerColumns.map((col, index) => (
        <div key={col.footer}>
          <b>{col.footer}:</b> {getValue(col)}
        </div>
      ))}
    </>
  );
};

export default Footer;
