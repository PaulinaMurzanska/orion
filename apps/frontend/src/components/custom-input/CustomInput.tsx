import { InputVariants, inputVariants } from './type';
import React, { ChangeEvent, useState } from 'react';
import { useConvertDataTypes } from '../../hooks/useConvertDataType';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  externalValue: string | number | null;
  grabInputValue: (val: string | number | null) => void;
  placeholder?: string;
  variant?: InputVariants;
  className?: string;
}

const CustomInput = ({
  externalValue,
  placeholder,
  grabInputValue,
  variant,
  className,
  ...props
}: InputProps) => {
  const { formatToDollar, formatToPercent, convertStringToNumber } =
    useConvertDataTypes();
  const [fieldType, setFieldType] = useState<string>('text');
  const [value, setValue] = useState<string | number>(() => {
    if (variant === inputVariants.CURRENCY) {
      return formatToDollar(externalValue);
    } else if (variant === inputVariants.PERCENT) {
      return formatToPercent(externalValue);
    } else if (variant === inputVariants.NUMBER) {
      if (externalValue === null) {
        return '';
      } else {
        return externalValue;
      }
    } else {
      return externalValue || '';
    }
  });

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
