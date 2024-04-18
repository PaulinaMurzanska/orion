import { SpinnerContainer, SpinningIcon } from './StyledProgressSpin';

import { colors } from '../../styles/variables';

export interface ProgressSpinProps {
  size?: number;
  variant?: 'primary' | 'white' | 'gray' | 'orange' | 'pink';
  className?: string;
  animationDuration?: string;
  customColor?: string;
}

const ProgressSpin = ({
  size = 24,
  variant = 'pink',
  className = '',
  animationDuration = '2s',
  customColor = '',
}: ProgressSpinProps) => {
  const colorMap = {
    primary: colors.blue_primary,
    white: '#fff',
    gray: colors.grey_400,
    orange: colors.orange,
    pink: colors.pink,
  };

  const color = customColor ? customColor : colorMap[variant];

  return (
    <SpinnerContainer size={size} color={color} className={className}>
      <SpinningIcon animationDuration={animationDuration} />
    </SpinnerContainer>
  );
};

export default ProgressSpin;
