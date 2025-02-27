
import { useState } from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { DateRangeProps } from "./types";

export const DateRangeSelector = ({
  startDate,
  endDate,
  onDateRangeChange
}: DateRangeProps) => {
  const [localStartDate, setLocalStartDate] = useState<Date | undefined>(startDate);
  const [localEndDate, setLocalEndDate] = useState<Date | undefined>(endDate);
  
  const handleDateApply = () => {
    if (localStartDate && localEndDate && onDateRangeChange) {
      if (localStartDate > localEndDate) {
        toast({
          title: "Invalid Date Range",
          description: "Start date cannot be after end date",
          variant: "destructive"
        });
        return;
      }
      
      onDateRangeChange(localStartDate, localEndDate);
      toast({
        title: "Date Range Applied",
        description: `Showing data from ${format(localStartDate, 'MMM dd, yyyy')} to ${format(localEndDate, 'MMM dd, yyyy')}`
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <CalendarDays className="h-4 w-4 mr-1" />
          Date Range
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="end">
        <div className="space-y-3">
          <h4 className="font-medium">Select Date Range</h4>
          
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label htmlFor="start-date">Start Date</Label>
              <div className="flex gap-2">
                <Calendar
                  mode="single"
                  selected={localStartDate}
                  onSelect={setLocalStartDate}
                  className="rounded-md border"
                />
              </div>
            </div>
            
            <div className="grid gap-1">
              <Label htmlFor="end-date">End Date</Label>
              <div className="flex gap-2">
                <Calendar
                  mode="single"
                  selected={localEndDate}
                  onSelect={setLocalEndDate}
                  className="rounded-md border"
                />
              </div>
            </div>
          </div>
          
          <Button className="w-full" onClick={handleDateApply}>
            Apply Range
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
