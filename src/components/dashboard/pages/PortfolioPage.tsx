
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, BarChart, PieChart } from 'lucide-react';

export const PortfolioPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center">
                <LineChart className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="returns" className="flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                Returns
              </TabsTrigger>
              <TabsTrigger value="allocation" className="flex items-center">
                <PieChart className="h-4 w-4 mr-2" />
                Allocation
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">Portfolio performance chart will be displayed here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="returns" className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">Returns analysis will be displayed here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="allocation" className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">Asset allocation will be displayed here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">$125,430.56</p>
              <p className="text-sm text-green-600">+2.3% ($2,845.23)</p>
            </div>
            
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">Asset Classes</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="text-sm">Stocks</p>
                  <p className="font-medium">60%</p>
                </div>
                <div>
                  <p className="text-sm">Crypto</p>
                  <p className="font-medium">20%</p>
                </div>
                <div>
                  <p className="text-sm">Bonds</p>
                  <p className="font-medium">15%</p>
                </div>
                <div>
                  <p className="text-sm">Cash</p>
                  <p className="font-medium">5%</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">Top Holdings</p>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between">
                  <p className="text-sm">BTC</p>
                  <p className="text-sm font-medium">$25,000</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">AAPL</p>
                  <p className="text-sm font-medium">$18,500</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">MSFT</p>
                  <p className="text-sm font-medium">$12,300</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Asset</th>
                  <th scope="col" className="px-6 py-3">Type</th>
                  <th scope="col" className="px-6 py-3">Value</th>
                  <th scope="col" className="px-6 py-3">Allocation</th>
                  <th scope="col" className="px-6 py-3">Return</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium">Bitcoin (BTC)</td>
                  <td className="px-6 py-4">Crypto</td>
                  <td className="px-6 py-4">$25,000</td>
                  <td className="px-6 py-4">20%</td>
                  <td className="px-6 py-4 text-green-600">+15.4%</td>
                </tr>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium">Apple Inc (AAPL)</td>
                  <td className="px-6 py-4">Stock</td>
                  <td className="px-6 py-4">$18,500</td>
                  <td className="px-6 py-4">14.8%</td>
                  <td className="px-6 py-4 text-green-600">+8.2%</td>
                </tr>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium">Microsoft (MSFT)</td>
                  <td className="px-6 py-4">Stock</td>
                  <td className="px-6 py-4">$12,300</td>
                  <td className="px-6 py-4">9.8%</td>
                  <td className="px-6 py-4 text-green-600">+5.7%</td>
                </tr>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium">Ethereum (ETH)</td>
                  <td className="px-6 py-4">Crypto</td>
                  <td className="px-6 py-4">$10,200</td>
                  <td className="px-6 py-4">8.1%</td>
                  <td className="px-6 py-4 text-red-600">-3.2%</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 font-medium">US Treasury Bonds</td>
                  <td className="px-6 py-4">Bond</td>
                  <td className="px-6 py-4">$15,700</td>
                  <td className="px-6 py-4">12.5%</td>
                  <td className="px-6 py-4 text-green-600">+2.1%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
