import { Icons } from '../../assets/icons/Icons';
import React from 'react';
import { cn } from '../../utils/tailwind';
import { cva, type VariantProps } from 'class-variance-authority';

const spinnerVariants = cva('animate-spin', {
  variants: {
    variant: {
      primary: 'text-blue-500',
      white: 'text-white',
      gray: 'text-gray-400',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  size?: number;
}

const ProgressSpin = ({ variant, size, className = '' }: SpinnerProps) => {
  const baseSize = size || 6;
  const sizeClass = `w-${baseSize} h-${baseSize}`;
  return (
    <div>
      <Icons.spinner
        className={cn(
          'animate-spin',
          spinnerVariants({ variant, className }),
          sizeClass
        )}
      />
    </div>
  );
};

export default ProgressSpin;
