import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown/Dropdown';
import {
  ChevronDownIcon,
  CrossCircledIcon,
  DrawingPinFilledIcon,
  DrawingPinIcon,
  PinBottomIcon,
  PinTopIcon,
} from '@radix-ui/react-icons';
import { Column } from '@tanstack/react-table';

interface Props<T> {
  column: Column<T, unknown>;
}

const ColumnMenu = <T extends object>({ column }: Props<T>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Column Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            column.toggleSorting(false);
          }}
          className="cursor-pointer gap-2 items-center"
        >
          <PinTopIcon />
          Sort Ascending
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            column.toggleSorting(true);
          }}
          className="cursor-pointer gap-2 items-center"
        >
          <PinBottomIcon />
          Sort Descending
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            column.clearSorting();
            column.pin(false);
          }}
          className="cursor-pointer gap-2 items-center"
        >
          <CrossCircledIcon /> Clear Sort
        </DropdownMenuItem>
        {column.getIsPinned() ? (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              column.pin(false);
            }}
            className="cursor-pointer gap-2 items-center"
          >
            <DrawingPinFilledIcon /> Unfreeze Column
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              column.pin('left');
            }}
            className="cursor-pointer gap-2 items-center"
          >
            <DrawingPinIcon /> Freeze Column
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnMenu;
