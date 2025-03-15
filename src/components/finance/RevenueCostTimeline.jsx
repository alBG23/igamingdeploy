import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function RevenueCostTimeline({ data, period, onPeriodChange }) {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Revenue vs Costs Timeline</CardTitle>
          <CardDescription>Revenue and costs over time</CardDescription>
        </div>
        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
            <SelectItem value="2years">Last 2 Years</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorCosts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value) => `$${(value/1000)}k`}
              />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, undefined]} />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#4f46e5"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="costs"
                name="Costs"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorCosts)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Average Revenue</p>
            <p className="text-xl font-bold">
              ${Math.round(data.reduce((sum, item) => sum + item.revenue, 0) / data.length).toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Average Costs</p>
            <p className="text-xl font-bold">
              ${Math.round(data.reduce((sum, item) => sum + item.costs, 0) / data.length).toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Average Profit Margin</p>
            <p className="text-xl font-bold">
              {Math.round((1 - (data.reduce((sum, item) => sum + item.costs, 0) / data.reduce((sum, item) => sum + item.revenue, 0))) * 100)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}