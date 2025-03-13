
import React, { memo } from "react";
import { useThemeString } from "@/hooks/useThemeString";

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year
  const theme = useThemeString();

  return (
    <footer className="bg-background w-full py-1 mt-auto border-t border-border/30">
      <div className="flex justify-center text-foreground">
        <p className="m-4">
          © {currentYear} CryptoMarket.{" "}
          <span className="font-bold text-primary">
            Built with love & AI.🤖
          </span>
        </p>
      </div>
    </footer>
  );
};

export default memo(Footer);
