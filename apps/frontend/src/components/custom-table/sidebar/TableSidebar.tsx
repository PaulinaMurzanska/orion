import styled from 'styled-components';
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowUpDownIcon,
  ArrowUpNarrowWide,
  ChevronsLeft,
  DiffIcon,
  ListChecksIcon,
  PlusIcon,
} from 'lucide-react';
import { useCallback } from 'react';
import { motion } from 'framer-motion';
import CloseIcon from 'mdi-react/CloseIcon';
import ChevronDownUpIcon from 'mdi-react/ChevronDownUpIcon';
import SidebarContent from './SidebarContent';
import { RowObject } from '@orionsuite/shared-components';

interface Props<T> {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedRows?: T[];
}

const RightMenu = styled.div`
  background: #2b2b2e;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(90vh - 42px);
  color: white;
  padding: 12px;
  gap: 10px;
  margin: 0 0 0 10px;
`;

const SidebarContainer = styled.div<{ open: boolean }>`
  width: 380px;
  margin: 0 10px 0 10px;
  padding: 10px;
  height: calc(100vh - 42px);
  display: ${(props) => (props.open ? '' : 'none')};
`;

const TableSidebar = <T extends RowObject>({
  selectedRows,
  open,
  setOpen,
}: Props<T>) => {
  const onOpenChange = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  return (
    <>
      <RightMenu>
        <motion.div animate={{ rotate: open ? '180deg' : '0' }}>
          <ChevronsLeft
            style={{
              cursor: 'pointer',
            }}
            size={24}
            onClick={onOpenChange}
          />
        </motion.div>
        <PlusIcon
          style={{ marginTop: 'auto', cursor: 'pointer' }}
          size={24}
        ></PlusIcon>
        <CloseIcon size={24} className="cursor-pointer" />
        <DiffIcon size={24} className="cursor-pointer" />
        <ArrowUpDownIcon size={24} className="cursor-pointer" />
        <ChevronDownUpIcon size={24} className="cursor-pointer" />
        <ArrowRightToLine size={24} className="cursor-pointer" />
        <ArrowLeftToLine size={24} className="cursor-pointer" />
        <ListChecksIcon size={24} className="cursor-pointer" />
        <ArrowUpNarrowWide
          size={24}
          style={{ transform: 'rotate(180deg)', cursor: 'pointer' }}
        />
      </RightMenu>
      <SidebarContainer open={open}>
        <SidebarContent<T> selectedRows={selectedRows ?? []} />
      </SidebarContainer>
    </>
  );
};

export default TableSidebar;
