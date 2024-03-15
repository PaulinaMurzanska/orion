import { DoubleArrowDownIcon, DoubleArrowUpIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react';

import { Card } from '@orionsuite/shared-components';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  width: 100%;
  padding: 4px;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
`;

interface Props {
  demoComponent: React.ReactNode;
  demoTitle: string;
}

const ComponentCard = ({ demoComponent, demoTitle }: Props) => {
  const [showCard, setShowCard] = useState<boolean>(false);
  const handleShowCard = () => {
    setShowCard(!showCard);
  };
  return (
    <StyledWrapper>
      <Card
        className="p-5 flex justify-between items-center cursor-pointer"
        onClick={handleShowCard}
      >
        <p className="text-xl font-semibold">{demoTitle}</p>
        <div className="flex items-center justify-center">
          {showCard ? (
            <DoubleArrowUpIcon className="w-6 h-6" />
          ) : (
            <DoubleArrowDownIcon className="w-6 h-6" />
          )}
        </div>
      </Card>
      {showCard && (
        <Card className="p-5 flex flex-col">
          <p className="mb-4">{demoTitle}</p>
          {demoComponent}
        </Card>
      )}
    </StyledWrapper>
  );
};

export default ComponentCard;
