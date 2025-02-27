
import { ReplayControlsProps } from "./replay/types";
import { PlaybackControls } from "./replay/PlaybackControls";
import { SpeedControl } from "./replay/SpeedControl";
import { TimeframeSelect } from "./replay/TimeframeSelect";
import { DateRangeSelector } from "./replay/DateRangeSelector";
import { ProgressControl } from "./replay/ProgressControl";
import { handleRewind, handleFastForward } from "./replay/utils";

export const ReplayControls = ({
  isPlaying,
  onPlayPause,
  onReset,
  onSpeedChange,
  currentSpeed,
  progress,
  onProgressChange,
  startDate,
  endDate,
  onDateRangeChange,
  selectedTimeframe,
  onTimeframeChange
}: ReplayControlsProps) => {
  // Handlers for rewind and fast forward using the utility functions
  const onRewind = () => handleRewind(progress, onProgressChange);
  const onFastForward = () => handleFastForward(progress, onProgressChange);
  
  return (
    <div className="bg-background/90 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PlaybackControls 
              isPlaying={isPlaying}
              onPlayPause={onPlayPause}
              onReset={onReset}
              onRewind={onRewind}
              onFastForward={onFastForward}
            />
            
            <SpeedControl 
              currentSpeed={currentSpeed}
              onSpeedChange={onSpeedChange}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <TimeframeSelect 
              selectedTimeframe={selectedTimeframe}
              onTimeframeChange={onTimeframeChange}
            />
            
            <DateRangeSelector 
              startDate={startDate}
              endDate={endDate}
              onDateRangeChange={onDateRangeChange}
            />
          </div>
        </div>
        
        <ProgressControl 
          progress={progress}
          onProgressChange={onProgressChange}
        />
      </div>
    </div>
  );
};
