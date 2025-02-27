
import { ReactElement, SVGProps } from "react";
import { Rectangle, Layer } from "recharts";

interface CandlestickProps extends SVGProps<SVGRectElement> {
  x: number;
  y: number;
  width: number;
  height: number;
  openValue: number;
  closeValue: number;
  highValue: number;
  lowValue: number;
  upColor: string;
  downColor: string;
  index: number;
}

interface CandlestickSeriesProps {
  data: Array<any>;
  xAxisDataKey: string;
  openDataKey: string;
  highDataKey: string;
  lowDataKey: string;
  closeDataKey: string;
  upColor?: string;
  downColor?: string;
}

const Candlestick = (props: CandlestickProps): ReactElement => {
  const {
    x,
    y,
    width,
    height,
    openValue,
    closeValue,
    highValue,
    lowValue,
    upColor,
    downColor,
    index,
    ...others
  } = props;

  const isUp = closeValue >= openValue;
  const color = isUp ? upColor : downColor;
  const baseY = isUp ? y + (height * (highValue - closeValue)) / (highValue - lowValue) : y + (height * (highValue - openValue)) / (highValue - lowValue);
  const candleHeight = isUp
    ? (height * (closeValue - openValue)) / (highValue - lowValue)
    : (height * (openValue - closeValue)) / (highValue - lowValue);

  // Calculate wick coordinates
  const wickX = x + width / 2;
  const wickTop = y;
  const wickBottom = y + height;
  const candleY = isUp ? baseY : baseY - candleHeight;

  return (
    <g className="recharts-candlestick" {...others}>
      {/* Draw the wick (vertical line) */}
      <line
        x1={wickX}
        y1={wickTop}
        x2={wickX}
        y2={wickBottom}
        stroke={color}
        strokeWidth={1}
      />
      
      {/* Draw the candle body */}
      <rect
        x={x + width * 0.25}
        y={candleY}
        width={width * 0.5}
        height={Math.max(1, candleHeight)}
        stroke="none"
        fill={color}
      />
    </g>
  );
};

export const CandlestickSeries = ({
  data,
  xAxisDataKey,
  openDataKey,
  highDataKey,
  lowDataKey,
  closeDataKey,
  upColor = "#4ade80",
  downColor = "#ef4444",
}: CandlestickSeriesProps): ReactElement => {
  return (
    <Layer>
      {data.map((entry, index) => {
        const x = entry.x;
        const width = entry.width;
        const openValue = entry[openDataKey];
        const closeValue = entry[closeDataKey];
        const highValue = entry[highDataKey];
        const lowValue = entry[lowDataKey];
        const y = entry.y;
        const height = entry.height;

        if (
          x === undefined ||
          y === undefined ||
          width === undefined ||
          height === undefined ||
          openValue === undefined ||
          closeValue === undefined ||
          highValue === undefined ||
          lowValue === undefined
        ) {
          return null;
        }

        return (
          <Candlestick
            key={`candlestick-${index}`}
            x={x}
            y={y}
            width={width}
            height={height}
            openValue={openValue}
            closeValue={closeValue}
            highValue={highValue}
            lowValue={lowValue}
            upColor={upColor}
            downColor={downColor}
            index={index}
          />
        );
      })}
    </Layer>
  );
};
