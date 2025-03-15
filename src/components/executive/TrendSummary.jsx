import React from 'react';
import { TrendingUp, TrendingDown, Users, CreditCard, BarChart4, DollarSign } from 'lucide-react';

export default function TrendSummary({ data }) {
  if (!data) {
    return <div className="h-[250px] flex items-center justify-center text-gray-500">No summary data available</div>;
  }
  
  const getTrendIcon = (value) => {
    if (value > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (value < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };
  
  const getTrendText = (value) => {
    const absValue = Math.abs(value);
    if (value > 0) {
      return <span className="text-green-500">+{absValue.toFixed(1)}%</span>;
    } else if (value < 0) {
      return <span className="text-red-500">-{absValue.toFixed(1)}%</span>;
    }
    return <span className="text-gray-500">0%</span>;
  };
  
  const formatCurrency = (value) => {
    return '€' + value.toLocaleString();
  };
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-500 text-sm">Conversion Rate</div>
          <div className="bg-indigo-100 p-1.5 rounded-full">
            <Users className="h-4 w-4 text-indigo-700" />
          </div>
        </div>
        <div className="text-2xl font-bold">{data.conversionRate.toFixed(1)}%</div>
        <div className="flex items-center gap-1 mt-1 text-xs">
          {getTrendIcon(data.conversionTrend)}
          {getTrendText(data.conversionTrend)} from previous period
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-500 text-sm">FTD Count</div>
          <div className="bg-green-100 p-1.5 rounded-full">
            <CreditCard className="h-4 w-4 text-green-700" />
          </div>
        </div>
        <div className="text-2xl font-bold">{data.deposits.toLocaleString()}</div>
        <div className="flex items-center gap-1 mt-1 text-xs">
          {getTrendIcon(data.depositsTrend)}
          {getTrendText(data.depositsTrend)} from previous period
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-500 text-sm">NGR</div>
          <div className="bg-pink-100 p-1.5 rounded-full">
            <DollarSign className="h-4 w-4 text-pink-700" />
          </div>
        </div>
        <div className="text-2xl font-bold">{formatCurrency(data.totalNGR)}</div>
        <div className="flex items-center gap-1 mt-1 text-xs">
          {getTrendIcon(data.ngrTrend)}
          {getTrendText(data.ngrTrend)} from previous period
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-500 text-sm">Traffic</div>
          <div className="bg-blue-100 p-1.5 rounded-full">
            <BarChart4 className="h-4 w-4 text-blue-700" />
          </div>
        </div>
        <div className="text-2xl font-bold">{data.totalTraffic.toLocaleString()}</div>
        <div className="flex items-center gap-1 mt-1 text-xs">
          {getTrendIcon(data.trafficGrowth)}
          {getTrendText(data.trafficGrowth)} from previous period
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-500 text-sm">Avg. Player Value</div>
          <div className="bg-amber-100 p-1.5 rounded-full">
            <Users className="h-4 w-4 text-amber-700" />
          </div>
        </div>
        <div className="text-2xl font-bold">{formatCurrency(data.avgPlayerValue)}</div>
        <div className="flex items-center gap-1 mt-1 text-xs">
          {getTrendIcon(data.playerValueTrend)}
          {getTrendText(data.playerValueTrend)} from previous period
        </div>
      </div>
    </div>
  );
}