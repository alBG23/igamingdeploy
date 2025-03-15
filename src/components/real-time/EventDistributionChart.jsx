import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip } from 'recharts';

export default function EventDistributionChart({ data = [], isLoading = false, title = "Event Distribution" }) {
  const [chartType, setChartType] = React.useState('gameType');
  
  const getChartData = () => {
    if (!data.length) return [];
    
    let groupedData;
    
    if (chartType === 'gameType') {
      groupedData = data.reduce((acc, event) => {
        const type = event.gameType || 'Unknown';
        if (!acc[type]) acc[type] = 0;
        acc[type] += event.count || 1;
        return acc;
      }, {});
    } else if (chartType === 'device') {
      groupedData = data.reduce((acc, event) => {
        const device = event.device || 'Unknown';
        if (!acc[device]) acc[device] = 0;
        acc[device] += event.count || 1;
        return acc;
      }, {});
    } else if (chartType === 'country') {
      groupedData = data.reduce((acc, event) => {
        const country = event.country || 'Unknown';
        if (!acc[country]) acc[country] = 0;
        acc[country] += event.count || 1;
        return acc;
      }, {});
    }
    
    // Convert to array format for Recharts
    return Object.entries(groupedData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };
  
  const chartData = getChartData();
  
  // Colors for pie chart
  const COLORS = ['#4f46e5', '#06b6d4', '#8b5cf6', '#f43f5e', '#f59e0b', '#10b981', '#6366f1'];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gameType">Game Types</SelectItem>
              <SelectItem value="device">Device Types</SelectItem>
              <SelectItem value="country">Countries</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {chartData.map((item, index) => (
                <Badge 
                  key={item.name}
                  variant="outline" 
                  className="flex items-center gap-1"
                  style={{ borderColor: COLORS[index % COLORS.length], color: COLORS[index % COLORS.length] }}
                >
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {item.name}: {item.value}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}