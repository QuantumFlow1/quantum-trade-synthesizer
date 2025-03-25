
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, BarChart, ListFilter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const MarketPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Market Overview</h1>
        <div className="flex items-center space-x-2">
          <Input
            className="w-64"
            placeholder="Search markets..."
          />
          <Button variant="outline" size="icon">
            <ListFilter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">BTC/USD</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-baseline mb-2">
              <div className="text-2xl font-bold">$51,243.65</div>
              <div className="text-green-600 text-sm">+2.4%</div>
            </div>
            <div className="h-24 bg-gray-100 rounded-md flex items-center justify-center">
              <p className="text-xs text-gray-500">Price chart will be displayed here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ETH/USD</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-baseline mb-2">
              <div className="text-2xl font-bold">$2,843.21</div>
              <div className="text-green-600 text-sm">+1.8%</div>
            </div>
            <div className="h-24 bg-gray-100 rounded-md flex items-center justify-center">
              <p className="text-xs text-gray-500">Price chart will be displayed here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">S&P 500</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-baseline mb-2">
              <div className="text-2xl font-bold">4,782.65</div>
              <div className="text-red-600 text-sm">-0.3%</div>
            </div>
            <div className="h-24 bg-gray-100 rounded-md flex items-center justify-center">
              <p className="text-xs text-gray-500">Price chart will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Market Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="price">
            <TabsList>
              <TabsTrigger value="price" className="flex items-center">
                <LineChart className="h-4 w-4 mr-2" />
                Price Analysis
              </TabsTrigger>
              <TabsTrigger value="volume" className="flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                Volume Analysis
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="price" className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">Price analysis chart will be displayed here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="volume" className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">Volume analysis chart will be displayed here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Market Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Asset</th>
                  <th scope="col" className="px-6 py-3">Price</th>
                  <th scope="col" className="px-6 py-3">24h Change</th>
                  <th scope="col" className="px-6 py-3">Market Cap</th>
                  <th scope="col" className="px-6 py-3">Volume (24h)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium">Bitcoin</td>
                  <td className="px-6 py-4">$51,243.65</td>
                  <td className="px-6 py-4 text-green-600">+2.4%</td>
                  <td className="px-6 py-4">$976.5B</td>
                  <td className="px-6 py-4">$32.1B</td>
                </tr>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium">Ethereum</td>
                  <td className="px-6 py-4">$2,843.21</td>
                  <td className="px-6 py-4 text-green-600">+1.8%</td>
                  <td className="px-6 py-4">$345.2B</td>
                  <td className="px-6 py-4">$15.7B</td>
                </tr>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium">BNB</td>
                  <td className="px-6 py-4">$412.87</td>
                  <td className="px-6 py-4 text-red-600">-0.7%</td>
                  <td className="px-6 py-4">$67.8B</td>
                  <td className="px-6 py-4">$5.3B</td>
                </tr>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium">Solana</td>
                  <td className="px-6 py-4">$84.32</td>
                  <td className="px-6 py-4 text-green-600">+3.5%</td>
                  <td className="px-6 py-4">$35.6B</td>
                  <td className="px-6 py-4">$2.8B</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 font-medium">Cardano</td>
                  <td className="px-6 py-4">$0.65</td>
                  <td className="px-6 py-4 text-red-600">-1.2%</td>
                  <td className="px-6 py-4">$21.2B</td>
                  <td className="px-6 py-4">$854.3M</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
