
import React, { memo } from "react";
import MarketArrow from "./MarketArrow";
import NextHalvingInfo from "./NextHalvingInfo";
import GasPriceInfo from "./GasPriceInfo";
import useAssetStore from "../stores/useAssetStore";

const InfoBar = memo(() => {
  const {
    totalMarketCap,
    btcDominance,
    ethDominance,
    totalVolume,
    marketDirection,
  } = useAssetStore((state) => ({
    totalMarketCap: state.totalMarketCap,
    btcDominance: state.btcDominance,
    ethDominance: state.ethDominance,
    totalVolume: state.totalVolume,
    marketDirection: state.marketDirection,
  }));

  return (
    <div className="flex items-center px-4 py-2 text-sm bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="mr-4">
        <span className="font-bold">BTC</span> {btcDominance}%
      </div>
      <div className="mr-4">
        <span className="font-bold">ETH</span> {ethDominance}%
      </div>
      <div className="mr-4">
        24h Vol: <span className="font-bold">${totalVolume} Billion</span>
      </div>
      <div className="mr-4">
        Total Market Cap: <span className="font-bold">${totalMarketCap} Trillion</span> <MarketArrow marketDirection={marketDirection} />
      </div>
      <div className="mr-4">
        <NextHalvingInfo showTooltip={true} />
      </div>
      <div>
        <GasPriceInfo showTooltip={true} />
      </div>
    </div>
  );
});

export default InfoBar;
