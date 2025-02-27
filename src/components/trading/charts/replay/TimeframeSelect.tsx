
import { Clock } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { TimeframeSelectProps } from "./types";

export const TimeframeSelect = ({ 
  selectedTimeframe,
  onTimeframeChange 
}: TimeframeSelectProps) => {
  if (!onTimeframeChange) return null;
  
  return (
    <Select 
      value={selectedTimeframe} 
      onValueChange={onTimeframeChange}
    >
      <SelectTrigger className="w-[110px] h-8">
        <Clock className="h-4 w-4 mr-1" />
        <SelectValue placeholder="Timeframe" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Timeframe</SelectLabel>
          <SelectItem value="1m">1 Minute</SelectItem>
          <SelectItem value="5m">5 Minutes</SelectItem>
          <SelectItem value="15m">15 Minutes</SelectItem>
          <SelectItem value="1h">1 Hour</SelectItem>
          <SelectItem value="4h">4 Hours</SelectItem>
          <SelectItem value="1d">1 Day</SelectItem>
          <SelectItem value="1w">1 Week</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
