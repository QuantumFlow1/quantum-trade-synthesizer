
import React, { useEffect, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface BulkOrderModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BulkOrderModal = ({ isOpen, onOpenChange }: BulkOrderModalProps) => {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus het input veld wanneer de modal opent
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementeer hier de bulk order logica
    toast({
      title: "Bulk order geplaatst",
      description: "Uw bulk order is succesvol verwerkt",
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Bulk Order Plaatsen</SheetTitle>
          <SheetDescription>
            Plaats meerdere orders tegelijk met dezelfde parameters.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="aantal">Aantal Orders</Label>
            <Input
              ref={inputRef}
              id="aantal"
              type="number"
              placeholder="Voer het aantal orders in"
              className="col-span-3"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="volume">Volume per Order</Label>
            <Input
              id="volume"
              type="number"
              placeholder="Voer het volume per order in"
              className="col-span-3"
            />
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuleren
            </Button>
            <Button type="submit">
              Orders Plaatsen
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
