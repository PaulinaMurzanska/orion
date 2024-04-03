import { InputVariants, inputVariants } from './type';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useConvertDataTypes } from '../../hooks/useConvertDataType';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  initialValue: string | number | null;
  grabInputValue: (val: string | number | null) => void;
  placeholder?: string;
  variant?: InputVariants;
  className?: string;
}

const CustomInput = ({
  initialValue,
  placeholder,
  grabInputValue,
  variant,
  className,
  ...props
}: InputProps) => {
  const [value, setValue] = useState<string | number>('');
  const [fieldType, setFieldType] = useState<string>('text');

  const { formatToDollar, formatToPercent, convertStringToNumber } =
    useConvertDataTypes();

  const handleFocus = () => {
    if (
      variant &&
      (variant === inputVariants.CURRENCY ||
        variant === inputVariants.PERCENT ||
        variant === inputVariants.NUMBER)
    ) {
      if (typeof value === 'string') {
        if (value === '') {
          setValue('');
        } else {
          const numVal = convertStringToNumber(value);
          setValue(numVal);
        }
      } else {
        setValue(value);
      }
      setFieldType('number');
    }
  };

  const handleBlur = () => {
    let fieldValue: any;

    if (variant) {
      switch (variant) {
        case inputVariants.CURRENCY:
          fieldValue =
            value !== ''
              ? formatToDollar(parseFloat(value.toString()))
              : formatToDollar(0);
          grabInputValue(convertStringToNumber(fieldValue as string));
          break;
        case inputVariants.PERCENT:
          fieldValue =
            value !== ''
              ? formatToPercent(parseFloat(value.toString()) / 100)
              : formatToPercent(0);
          grabInputValue(convertStringToNumber(fieldValue as string) / 100);
          break;
        case inputVariants.NUMBER:
          fieldValue = value !== '' ? parseFloat(value.toString()) : null;
          grabInputValue(convertStringToNumber(fieldValue as string | null));
          break;
        default:
          fieldValue = value;
          grabInputValue(fieldValue);
      }
    } else {
      fieldValue = value;
      grabInputValue(fieldValue);
    }

    setValue(fieldValue);
    setFieldType('text');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const targetVal = e.target.value;
    setValue(targetVal);
  };

  useEffect(() => {
    if (variant === inputVariants.CURRENCY) {
      const dolVal = formatToDollar(initialValue);
      setValue(dolVal);
    } else if (variant === inputVariants.PERCENT) {
      const percentVal = formatToPercent(initialValue);
      setValue(percentVal);
    } else if (variant === inputVariants.NUMBER) {
      if (initialValue === null) {
        setValue('');
      } else {
        setValue(initialValue);
      }
    } else {
      setValue(initialValue || '');
    }
  }, [initialValue]);

  return (
    <div style={{ width: 'max-content' }}>
      <input
        placeholder={placeholder && placeholder}
        value={value}
        step="any"
        size={String(value).length + 3}
        className={className}
        type={fieldType}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    </div>
  );
};

export default CustomInput;
