import * as React from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/popover/Popover';

import { Button } from '../button/Button';
import { Calendar } from '../calendar/Calendar';
import { CalendarIcon } from '@radix-ui/react-icons';
import { SelectSingleEventHandler } from 'react-day-picker';
import { cn } from '../../utils/tailwind';
import { format } from 'date-fns';

interface datePickerProps {
  handleSetDate: (date: Date) => void;
}

const DatePicker = ({ handleSetDate }: datePickerProps) => {
  const [date, setDate] = React.useState<Date>();

  const onSelectDate: SelectSingleEventHandler = (day: Date | undefined) => {
    if (day) {
      handleSetDate(day);
      setDate(day);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelectDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export { DatePicker };
