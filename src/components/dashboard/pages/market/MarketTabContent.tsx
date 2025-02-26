
import { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface MarketTabContentProps {
  icon: ReactNode;
  title: string;
  description: string[];
  buttonText: string;
}

export const MarketTabContent = ({
  icon,
  title,
  description,
  buttonText,
}: MarketTabContentProps) => {
  return (
    <Alert>
      {icon}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p className="mb-2">{description[0]}</p>
        <ul className="list-disc pl-5 space-y-1">
          {description.slice(1).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <Button className="mt-4" variant="outline">
          {buttonText}
        </Button>
      </AlertDescription>
    </Alert>
  );
};
