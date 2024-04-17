interface Props {
  selectedRows: any[];
  records: any[];
}

const Footer = ({ selectedRows, records }: Props) => {
  const totalQuantity = selectedRows.reduce(
    (acc, row) => acc + Number(row.quantity),
    0
  );

  return (
    <>
      <div>
        <b>Lines selected:</b> {selectedRows.length ?? 0}/{records.length ?? 0}
      </div>
      <div style={{ margin: '0 0 0 auto' }}>
        <b>Quantity:</b> {totalQuantity ?? 0}
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
  );
};

export default Footer;
