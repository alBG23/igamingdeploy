import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie, Legend } from 'recharts';

export default function CostDistributionCharts({ costDistribution, ngrAmount }) {
  const costAsPercentageOfTotal = costDistribution.map(cost => ({
    name: cost.name,
    percentage: (cost.value / costDistribution.reduce((sum, item) => sum + item.value, 0) * 100).toFixed(1),
    color: cost.color
  }));
  
  const costAsPercentageOfNGR = costDistribution.map(cost => ({
    name: cost.name,
    percentage: (cost.value / ngrAmount * 100).toFixed(1),
    color: cost.color
  }));

  const formatPieLabel = (entry) => {
    return `${entry.name}: ${entry.percentage}%`;
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name}: ${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Cost Distribution Analysis</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="ngr">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="ngr" className="w-1/2">% of NGR</TabsTrigger>
            <TabsTrigger value="total" className="w-1/2">% of Total Costs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ngr">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={costAsPercentageOfNGR.sort((a, b) => b.percentage - a.percentage)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage of NGR']}
                    labelFormatter={(label) => `Cost Category: ${label}`}
                  />
                  <Bar dataKey="percentage" fill="#8884d8">
                    {costAsPercentageOfNGR.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="total">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={costAsPercentageOfTotal.sort((a, b) => b.percentage - a.percentage)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage of Total Costs']}
                    labelFormatter={(label) => `Cost Category: ${label}`}
                  />
                  <Bar dataKey="percentage" fill="#8884d8">
                    {costAsPercentageOfTotal.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}