
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, QrCode } from "lucide-react";

interface DepositAddressProps {
  walletAddress: string;
  copyToClipboard: (text: string) => void;
  showQRCode: boolean;
  toggleQRCode: () => void;
}

export const DepositAddress = ({ 
  walletAddress,
  copyToClipboard,
  showQRCode,
  toggleQRCode
}: DepositAddressProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="receive-address">Your Deposit Address</Label>
      <div className="flex">
        <Input 
          id="receive-address" 
          value={walletAddress}
          readOnly
          className="font-mono text-sm"
        />
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => copyToClipboard(walletAddress)}
          className="ml-2"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={toggleQRCode}
          className="ml-2"
        >
          <QrCode className="h-4 w-4" />
        </Button>
      </div>

      {showQRCode && (
        <div className="flex justify-center p-4 bg-white rounded-md">
          {/* Mock QR code - in a real app, use a proper QR code generator */}
          <div className="w-48 h-48 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iNDAiIHk9IjIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSI2MCIgeT0iMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjgwIiB5PSIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iMTAwIiB5PSIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iMTQwIiB5PSIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iMTYwIiB5PSIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iMjAiIHk9IjQwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSI2MCIgeT0iNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjgwIiB5PSI0MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iMTIwIiB5PSI0MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iMTYwIiB5PSI0MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iMjAiIHk9IjYwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSI2MCIgeT0iNjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjEwMCIgeT0iNjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjEyMCIgeT0iNjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjE2MCIgeT0iNjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjIwIiB5PSI4MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iNDAiIHk9IjgwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSI2MCIgeT0iODAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjEwMCIgeT0iODAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjE2MCIgeT0iODAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjIwIiB5PSIxMDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjYwIiB5PSIxMDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjgwIiB5PSIxMDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjE0MCIgeT0iMTAwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSIyMCIgeT0iMTIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSI0MCIgeT0iMTIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSI2MCIgeT0iMTIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSI4MCIgeT0iMTIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSIxMDAiIHk9IjEyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iMTIwIiB5PSIxMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjE0MCIgeT0iMTIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSIxNjAiIHk9IjEyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iNDAiIHk9IjE0MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iNjAiIHk9IjE0MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iMTAwIiB5PSIxNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IHg9IjEyMCIgeT0iMTQwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSIyMCIgeT0iMTYwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSI2MCIgeT0iMTYwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSI4MCIgeT0iMTYwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSIxMDAiIHk9IjE2MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIi8+PHJlY3QgeD0iMTQwIiB5PSIxNjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjwvc3ZnPg==')] bg-contain"></div>
        </div>
      )}
    </div>
  );
};
