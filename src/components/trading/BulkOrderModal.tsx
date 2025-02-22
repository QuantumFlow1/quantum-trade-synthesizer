
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

const translations = {
  nl: {
    title: "Bulk Order Plaatsen",
    description: "Plaats meerdere orders tegelijk met dezelfde parameters.",
    orderCount: "Aantal Orders",
    orderCountPlaceholder: "Voer het aantal orders in",
    volumePerOrder: "Volume per Order",
    volumePlaceholder: "Voer het volume per order in",
    cancel: "Annuleren",
    submit: "Orders Plaatsen",
    successTitle: "Bulk order geplaatst",
    successDescription: "Uw bulk order is succesvol verwerkt"
  },
  en: {
    title: "Place Bulk Order",
    description: "Place multiple orders simultaneously with the same parameters.",
    orderCount: "Number of Orders",
    orderCountPlaceholder: "Enter the number of orders",
    volumePerOrder: "Volume per Order",
    volumePlaceholder: "Enter the volume per order",
    cancel: "Cancel",
    submit: "Place Orders",
    successTitle: "Bulk order placed",
    successDescription: "Your bulk order has been processed successfully"
  },
  ru: {
    title: "Размещение Массового Ордера",
    description: "Разместите несколько ордеров одновременно с одинаковыми параметрами.",
    orderCount: "Количество Ордеров",
    orderCountPlaceholder: "Введите количество ордеров",
    volumePerOrder: "Объем на Ордер",
    volumePlaceholder: "Введите объем на ордер",
    cancel: "Отмена",
    submit: "Разместить Ордера",
    successTitle: "Массовый ордер размещен",
    successDescription: "Ваш массовый ордер успешно обработан"
  },
  hy: {
    title: "Զանգվածային Պատվեր Տեղադրել",
    description: "Տեղադրեք մի քանի պատվեր միաժամանակ նույն պարամետրերով։",
    orderCount: "Պատվերների Քանակ",
    orderCountPlaceholder: "Մուտքագրեք պատվերների քանակը",
    volumePerOrder: "Ծավալը Պատվերի Համար",
    volumePlaceholder: "Մուտքագրեք ծավալը պատվերի համար",
    cancel: "Չեղարկել",
    submit: "Տեղադրել Պատվերները",
    successTitle: "Զանգվածային պատվերը տեղադրված է",
    successDescription: "Ձեր զանգվածային պատվերը հաջողությամբ մշակվել է"
  }
};

interface BulkOrderModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BulkOrderModal = ({ isOpen, onOpenChange }: BulkOrderModalProps) => {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const currentLanguage = localStorage.getItem('preferred_language') as keyof typeof translations || 'nl';

  const getText = (key: keyof (typeof translations)['nl']) => {
    return translations[currentLanguage]?.[key] || translations.en[key];
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: getText('successTitle'),
      description: getText('successDescription'),
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{getText('title')}</SheetTitle>
          <SheetDescription>
            {getText('description')}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="aantal">{getText('orderCount')}</Label>
            <Input
              ref={inputRef}
              id="aantal"
              type="number"
              placeholder={getText('orderCountPlaceholder')}
              className="col-span-3"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="volume">{getText('volumePerOrder')}</Label>
            <Input
              id="volume"
              type="number"
              placeholder={getText('volumePlaceholder')}
              className="col-span-3"
            />
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {getText('cancel')}
            </Button>
            <Button type="submit">
              {getText('submit')}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

