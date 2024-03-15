import { Checkbox } from '@orionsuite/shared-components';
import { cn } from '../../utils/tailwind';
import styled from 'styled-components';

interface CheckboxProps {
  onCheckedChange: (val: boolean) => void;
  label?: string;
  labelClassName?: string;
  checkboxClassName?: string;
}

const CheckboxLabel = styled.p`
  font-family: Inter;
`;

const CustomCheckbox = ({
  label,
  labelClassName,
  checkboxClassName,
  onCheckedChange,
}: CheckboxProps) => {
  return (
    <div className="flex items-center gap-2 text-zinc-950">
      <Checkbox
        onCheckedChange={(value: boolean) => onCheckedChange(value)}
        className={checkboxClassName}
      />
      {label && (
        <CheckboxLabel className={cn(labelClassName)}>{label}</CheckboxLabel>
      )}
    </div>
  );
};

export default CustomCheckbox;
