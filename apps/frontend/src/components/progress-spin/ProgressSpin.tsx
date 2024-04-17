import { SpinnerContainer, SpinningIcon } from './StyledProgressSpin';

import { cn } from '../../utils/tailwind';
import { colors } from '../../styles/variables';

export interface ProgressSpinProps {
  size?: number;
  variant?: 'primary' | 'white' | 'gray' | 'orange';
  className?: string;
  animationDuration?: string;
  customColor?: string;
}

const ProgressSpin = ({
  size = 24,
  variant = 'orange',
  className = '',
  animationDuration = '2s',
  customColor = '',
}: ProgressSpinProps) => {
  const colorMap = {
    primary: colors.blue_primary,
    white: '#fff',
    gray: colors.grey_400,
    orange: colors.orange,
  };

  const color = customColor ? customColor : colorMap[variant];

  return (
    <SpinnerContainer size={size} color={color} className={className}>
      <SpinningIcon animationDuration={animationDuration} />
    </SpinnerContainer>
  );
};

export default ProgressSpin;
