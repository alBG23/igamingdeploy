import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend } from 'recharts';

export default function PaybackTimeChart({ paybackData, ltvPaybackData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Payback Time Analysis</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="monthly">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="monthly" className="w-1/2">Monthly NGR</TabsTrigger>
            <TabsTrigger value="ltv" className="w-1/2">Lifetime Value</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={paybackData.sort((a, b) => b.months - a.months)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${value} mo`} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip 
                    formatter={(value) => [`${value.toFixed(1)} months`, 'Time to Payback']}
                    labelFormatter={(label) => `Cost Category: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="months" name="Months to Payback" fill="#8884d8">
                    {paybackData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Based on average monthly NGR generation from active players.
            </p>
          </TabsContent>
          
          <TabsContent value="ltv">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ltvPaybackData.sort((a, b) => b.months - a.months)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${value} mo`} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip 
                    formatter={(value) => [`${value.toFixed(1)} months`, 'Time to Payback']}
                    labelFormatter={(label) => `Cost Category: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="months" name="Months to Payback (LTV)" fill="#8884d8">
                    {ltvPaybackData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Based on predicted lifetime value (LTV) of players.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}