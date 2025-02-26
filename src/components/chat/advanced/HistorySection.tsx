
import { HistorySectionProps } from "./types";
import { formatTaskForHistory, truncateMessage } from "./utils";

export default function HistorySection({ history }: HistorySectionProps) {
  if (history.length === 0) {
    return (
      <div className="border rounded-md p-4 bg-gray-50 h-full flex items-center justify-center">
        <p className="text-gray-500 text-center">Your generation history will appear here</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-y-auto h-full max-h-[400px]">
      <div className="p-2 bg-gray-100 border-b sticky top-0">
        <h3 className="font-medium text-sm">Generation History</h3>
      </div>
      <div className="divide-y">
        {history.map((item, index) => (
          <div key={index} className="p-3 hover:bg-gray-50">
            <p className="text-sm font-medium truncate">
              {formatTaskForHistory(item.task)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {truncateMessage(item.output, 120)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
