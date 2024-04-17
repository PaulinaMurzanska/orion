import styled, { css, keyframes } from 'styled-components';

import { Icons } from '../../assets/icons/Icons';
import { ProgressSpinProps } from './ProgressSpin';
import React from 'react';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div<ProgressSpinProps>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  color: ${(props) => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SpinningIcon = styled(Icons.spinner)<ProgressSpinProps>`
  animation: ${(props) =>
    css`
      ${spin} ${props.animationDuration || '1s'} linear infinite
    `};
  width: 100%;
  height: 100%;
`;

export { SpinnerContainer, SpinningIcon };
