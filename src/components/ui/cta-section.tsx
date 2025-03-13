
import React from "react";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  topic: string;
  title: string;
  buttonName: string;
  buttonRoute?: string;
  children: React.ReactNode;
  onButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const CTASection: React.FC<CTASectionProps> = ({ 
  topic, 
  title, 
  buttonName, 
  buttonRoute, 
  children, 
  onButtonClick 
}) => {
  return (
    <div className="w-full py-10 md:py-20 px-4 text-center bg-primary text-primary-foreground">
      <h3 className="text-xl font-bold mb-4 text-center">{topic}</h3>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">
          {title}
        </h2>
        <p className="text-md md:text-lg mb-4 text-center text-primary-foreground">
          {children}
        </p>
      </div>
      <Button 
        variant="secondary" 
        className="font-bold hover:shadow-lg transition-shadow"
        onClick={onButtonClick}
      >
        {buttonName}
      </Button>
    </div>
  );
};

export default CTASection;
