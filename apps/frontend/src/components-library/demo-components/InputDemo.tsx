import CustomInput from '../../components/custom-input/CustomInput';
import { inputVariants } from '../../components/custom-input/type';
import { useState } from 'react';

const InputDemo = () => {
  const [percent, setPercent] = useState<number | null>(null);
  const [dollar, setDollar] = useState<number | null>(null);
  const [text, setText] = useState<string | null>('');
  const [numberInput, setNumberInput] = useState<number | null>(null);

  const setTextValue = (val: any) => {
    setText(val);
  };
  const setNumberInputValue = (val: any) => {
    setNumberInput(val);
  };
  const setPercentValue = (val: any) => {
    setPercent(val);
  };
  const setDollarValue = (val: any) => {
    setDollar(val);
  };

  return (
    <>
      <div className="flex  gap-4">
        <p className="w-72">
          Text type - <b>default</b> input type
        </p>
        <CustomInput
          initialValue={text}
          placeholder="text type input"
          grabInputValue={setTextValue}
          className="w-30"
        />
        <p>
          Value returned: <b className="text-green-600">{text}</b> , typeof:{' '}
          <b>
            {' '}
            {typeof text} , {text === '' && 'empty string'}
          </b>
        </p>
      </div>
      <br />
      <div className="flex  gap-4">
        <p className="w-72">
          Number type - <b>'integer'</b> variant
        </p>
        <CustomInput
          initialValue={numberInput}
          placeholder="number type input"
          grabInputValue={setNumberInputValue}
          className="w-30"
          variant={inputVariants.NUMBER}
        />
        <p>
          Value returned: <b className="text-green-600">{numberInput}</b> ,
          typeof:{' '}
          <b>
            {typeof numberInput}, {numberInput === null ? 'null' : ''}
          </b>
        </p>
      </div>
      <br />
      <div className="flex  gap-4">
        <p className="w-72">
          Percent type - <b>'percent'</b> variant
        </p>
        <CustomInput
          initialValue={percent}
          placeholder="percent type input"
          grabInputValue={setPercentValue}
          className="w-30"
          variant={inputVariants.PERCENT}
        />
        <p>
          Value returned: <b className="text-green-600">{percent}</b> , typeof:{' '}
          <b>
            {' '}
            {typeof percent}, {percent === null ? 'null' : ''}
          </b>
        </p>
      </div>
      <br />
      <div className="flex  gap-4">
        <p className="w-72">
          Currency type - <b>'currency'</b> variant
        </p>
        <CustomInput
          initialValue={dollar}
          placeholder="currency type input"
          grabInputValue={setDollarValue}
          className="w-30"
          variant={inputVariants.CURRENCY}
        />
        <p>
          Value returned: <b className="text-green-600">{dollar}</b> , typeof:{' '}
          <b>
            {typeof dollar}, {dollar === null ? 'null' : ''}
          </b>
        </p>
      </div>
    </>
  );
};

export { InputDemo };
