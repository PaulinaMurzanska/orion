import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetHeader,
} from '../sheet/Sheet';

interface Props<T> {
  open: boolean;
  setOpen: (open: boolean) => void;
  row?: T;
}

const TableSidebar = <T extends object>({ open, setOpen, row }: Props<T>) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Row</SheetTitle>

          {row &&
            Object.keys(row).map((key) => {
              const value = (row as any)[key];
              return (
                <div key={key}>
                  <SheetHeader>{key}</SheetHeader>
                  <SheetDescription>{value}</SheetDescription>
                </div>
              );
            })}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default TableSidebar;
