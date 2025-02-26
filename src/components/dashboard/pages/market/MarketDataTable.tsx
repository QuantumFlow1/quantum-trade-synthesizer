
import { MarketData } from "@/components/market/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MarketDataTableProps {
  isLoading: boolean;
  data: MarketData[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSortChange: (field: string) => void;
}

export const MarketDataTable = ({
  isLoading,
  data,
  sortField,
  sortDirection,
  onSortChange,
}: MarketDataTableProps) => {
  const renderSortIcon = (field: string) => {
    if (sortField === field) {
      return sortDirection === "asc" ? "↑" : "↓";
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex space-x-4">
            <Skeleton className="h-12 w-[250px]" />
            <Skeleton className="h-12 w-[150px]" />
            <Skeleton className="h-12 w-[150px]" />
            <Skeleton className="h-12 w-[150px]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer hover:bg-secondary/20"
              onClick={() => onSortChange("market")}
            >
              Market {renderSortIcon("market")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-secondary/20"
              onClick={() => onSortChange("symbol")}
            >
              Symbol {renderSortIcon("symbol")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-secondary/20 text-right"
              onClick={() => onSortChange("price")}
            >
              Price {renderSortIcon("price")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-secondary/20 text-right"
              onClick={() => onSortChange("volume")}
            >
              Volume {renderSortIcon("volume")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-secondary/20 text-right"
              onClick={() => onSortChange("change24h")}
            >
              24h Change {renderSortIcon("change24h")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-secondary/20 text-right"
              onClick={() => onSortChange("high24h")}
            >
              24h High {renderSortIcon("high24h")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-secondary/20 text-right"
              onClick={() => onSortChange("low24h")}
            >
              24h Low {renderSortIcon("low24h")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow key={`${item.market}-${item.symbol}`}>
                <TableCell>{item.market}</TableCell>
                <TableCell>{item.symbol}</TableCell>
                <TableCell className="text-right">{item.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">{item.volume.toLocaleString()}</TableCell>
                <TableCell
                  className={`text-right ${
                    item.change24h > 0
                      ? "text-green-500"
                      : item.change24h < 0
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  {item.change24h > 0 ? "+" : ""}
                  {item.change24h.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right">{item.high24h.toFixed(2)}</TableCell>
                <TableCell className="text-right">{item.low24h.toFixed(2)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                No market data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
