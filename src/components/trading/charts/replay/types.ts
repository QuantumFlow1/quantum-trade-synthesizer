
import { Dispatch, SetStateAction } from "react";

export interface DateRangeProps {
  startDate?: Date;
  endDate?: Date;
  onDateRangeChange?: (startDate: Date, endDate: Date) => void;
}

export interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onRewind: () => void;
  onFastForward: () => void;
}

export interface SpeedControlProps {
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
}

export interface TimeframeSelectProps {
  selectedTimeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
}

export interface ProgressControlProps {
  progress: number;
  onProgressChange: (progress: number) => void;
}

export interface ReplayControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  currentSpeed: number;
  progress: number;
  onProgressChange: (progress: number) => void;
  startDate?: Date;
  endDate?: Date;
  onDateRangeChange?: (startDate: Date, endDate: Date) => void;
  selectedTimeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
}
