import ProgressSpin from '../../components/progress-spin/ProgressSpin';

const ProgressSpinDemo = () => {
  return (
    <div>
      <h2>Progress spinner</h2>
      <p>Provides 3 variant : primary, white, gray</p>
      <p className="mb-6"> Size - pass value as props, default is 6</p>
      <div className="flex gap-24">
        <div>
          <p className="font-bold">Primary - default </p>
          <br />
          <ProgressSpin duration="4s" variant="orange" />
        </div>
        <div>
          <p className="font-bold">Gray - 8 </p>
          <br />
          <ProgressSpin duration="3s" variant="primary" />
        </div>
        <div>
          <p className="font-bold">Custom class - 34px </p>
          <br />
          <ProgressSpin duration="6s" size={58} customColor="red" />
        </div>
      </div>
    </div>
  );
};

export { ProgressSpinDemo };
