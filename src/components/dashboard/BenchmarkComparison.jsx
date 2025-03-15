import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function BenchmarkComparison({ data, period, onPeriodChange }) {
  // Sample benchmark data
  const benchmarkData = [
    { metric: 'Conversion Rate', value: 8.5, industry: 6.2, percentile: 85 },
    { metric: 'ARPU', value: 68, industry: 52, percentile: 78 },
    { metric: 'Retention Rate', value: 42, industry: 38, percentile: 69 },
    { metric: 'Deposit Success', value: 92, industry: 88, percentile: 81 },
    { metric: 'Withdrawal Speed', value: 95, industry: 76, percentile: 92 },
    { metric: 'Bonus Efficiency', value: 74, industry: 65, percentile: 75 }
  ];
  
  const radarData = [
    { subject: 'Conversion', A: 8.5, B: 6.2, fullMark: 12 },
    { subject: 'ARPU', A: 68, B: 52, fullMark: 100 },
    { subject: 'Retention', A: 42, B: 38, fullMark: 60 },
    { subject: 'Deposit %', A: 92, B: 88, fullMark: 100 },
    { subject: 'Withdrawal', A: 95, B: 76, fullMark: 100 },
    { subject: 'Bonus Eff.', A: 74, B: 65, fullMark: 100 }
  ];
  
  const getPercentileColor = (percentile) => {
    if (percentile >= 80) return 'bg-green-100 text-green-800';
    if (percentile >= 60) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <CardTitle>Industry Benchmark Comparison</CardTitle>
              <CardDescription>How your platform compares to industry averages</CardDescription>
            </div>
            <div className="mt-2 md:mt-0">
              <Select defaultValue="igaming" disabled={false}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="igaming">iGaming Industry</SelectItem>
                  <SelectItem value="casino">Casino Only</SelectItem>
                  <SelectItem value="sports">Sports Betting</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                <Radar 
                  name="Your Platform" 
                  dataKey="A" 
                  stroke="#4f46e5" 
                  fill="#4f46e5" 
                  fillOpacity={0.6} 
                />
                <Radar 
                  name="Industry Average" 
                  dataKey="B" 
                  stroke="#f43f5e" 
                  fill="#f43f5e" 
                  fillOpacity={0.3} 
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benchmarkData.map((metric) => (
              <Card key={metric.metric}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm text-gray-500">{metric.metric}</h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold">
                          {metric.value}
                          {metric.metric === 'ARPU' ? '$' : '%'}
                        </span>
                        <span className="text-gray-400 text-sm">
                          vs {metric.industry}
                          {metric.metric === 'ARPU' ? '$' : '%'}
                        </span>
                      </div>
                    </div>
                    <Badge className={getPercentileColor(metric.percentile)}>
                      {metric.percentile}th percentile
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}