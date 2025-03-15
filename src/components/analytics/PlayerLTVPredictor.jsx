import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  DollarSign, 
  Download, 
  Calendar, 
  Filter, 
  Users, 
  TrendingUp, 
  Clock,
  Gauge
} from 'lucide-react';

export default function PlayerLTVPredictor() {
  const [timeframe, setTimeframe] = useState('180d');
  const [segmentFilter, setSegmentFilter] = useState('all');
  
  // Sample LTV prediction data
  const sampleLtvData = [
    { month: 1, value: 38, acquisition: "Organic" },
    { month: 2, value: 52, acquisition: "Organic" },
    { month: 3, value: 61, acquisition: "Organic" },
    { month: 4, value: 75, acquisition: "Organic" },
    { month: 5, value: 85, acquisition: "Organic" },
    { month: 6, value: 94, acquisition: "Organic" },
    { month: 1, value: 42, acquisition: "Affiliates" },
    { month: 2, value: 63, acquisition: "Affiliates" },
    { month: 3, value: 88, acquisition: "Affiliates" },
    { month: 4, value: 109, acquisition: "Affiliates" },
    { month: 5, value: 126, acquisition: "Affiliates" },
    { month: 6, value: 141, acquisition: "Affiliates" },
    { month: 1, value: 28, acquisition: "Social" },
    { month: 2, value: 43, acquisition: "Social" },
    { month: 3, value: 54, acquisition: "Social" },
    { month: 4, value: 64, acquisition: "Social" },
    { month: 5, value: 72, acquisition: "Social" },
    { month: 6, value: 78, acquisition: "Social" }
  ];
  
  // Sample cohort data
  const sampleCohortData = [
    { cohort: 'Jan 2023', players: 845, m1_ltv: 42, m3_ltv: 78, m6_ltv: 112, predicted_12m: 164 },
    { cohort: 'Feb 2023', players: 1023, m1_ltv: 38, m3_ltv: 73, m6_ltv: 104, predicted_12m: 152 },
    { cohort: 'Mar 2023', players: 936, m1_ltv: 45, m3_ltv: 84, m6_ltv: 118, predicted_12m: 176 },
    { cohort: 'Apr 2023', players: 1104, m1_ltv: 40, m3_ltv: 76, m6_ltv: 108, predicted_12m: 160 }
  ];
  
  // Filter the LTV data by selected acquisition source
  const filteredLtvData = segmentFilter === 'all' 
    ? sampleLtvData 
    : sampleLtvData.filter(data => data.acquisition.toLowerCase() === segmentFilter);
  
  // Transform data for charts
  const organicData = sampleLtvData.filter(d => d.acquisition === "Organic");
  const affiliatesData = sampleLtvData.filter(d => d.acquisition === "Affiliates");
  const socialData = sampleLtvData.filter(d => d.acquisition === "Social");
  
  // Calculate 6-month LTV for each acquisition source (last month value)
  const ltv6mBySource = [
    { source: 'Organic', value: organicData[organicData.length - 1].value, color: '#3b82f6' },
    { source: 'Affiliates', value: affiliatesData[affiliatesData.length - 1].value, color: '#8b5cf6' },
    { source: 'Social', value: socialData[socialData.length - 1].value, color: '#f97316' }
  ];
  
  // First deposit percentiles data
  const firstDepositData = [
    { name: 'P10', value: 20 },
    { name: 'P25', value: 35 },
    { name: 'P50', value: 50 },
    { name: 'P75', value: 80 },
    { name: 'P90', value: 150 }
  ];
  
  // Create a combined dataset for line chart
  const combinedLtvData = [];
  for (let i = 1; i <= 6; i++) {
    combinedLtvData.push({
      month: i,
      Organic: organicData.find(d => d.month === i).value,
      Affiliates: affiliatesData.find(d => d.month === i).value,
      Social: socialData.find(d => d.month === i).value
    });
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Player Lifetime Value Prediction
            </CardTitle>
            <CardDescription>
              AI-powered LTV forecasting to optimize marketing and retention
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="180d">180 Days</SelectItem>
                <SelectItem value="365d">365 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9">
              <Calendar className="h-4 w-4 mr-2" />
              Custom Range
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">
              Overview
            </TabsTrigger>
            <TabsTrigger value="cohorts">
              Cohort Analysis
            </TabsTrigger>
            <TabsTrigger value="predictors">
              Value Predictors
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Avg. 180-Day LTV</p>
                      <div className="text-2xl font-bold mt-1">$104.32</div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8.3%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Projected 1-Year LTV</p>
                      <div className="text-2xl font-bold mt-1">$163.18</div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +5.1%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">First Month Prediction Accuracy</p>
                      <div className="text-2xl font-bold mt-1">92.4%</div>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Gauge className="h-3 w-3 mr-1" />
                      Model
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">30-Day Retention Rate</p>
                      <div className="text-2xl font-bold mt-1">42.8%</div>
                    </div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +2.3%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">LTV Growth by Acquisition Source</CardTitle>
                    <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                      <SelectTrigger className="h-8 w-[140px]">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="organic">Organic</SelectItem>
                        <SelectItem value="affiliates">Affiliates</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={combinedLtvData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
                          label={{ value: 'Month', position: 'insideBottom', offset: -5 }} 
                        />
                        <YAxis 
                          label={{ value: 'LTV ($)', angle: -90, position: 'insideLeft', offset: 10 }} 
                        />
                        <Tooltip formatter={(value) => [`$${value}`, undefined]} />
                        <Legend />
                        {segmentFilter === 'all' || segmentFilter === 'organic' ? (
                          <Line 
                            type="monotone" 
                            dataKey="Organic" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            activeDot={{ r: 8 }} 
                          />
                        ) : null}
                        {segmentFilter === 'all' || segmentFilter === 'affiliates' ? (
                          <Line 
                            type="monotone" 
                            dataKey="Affiliates" 
                            stroke="#8b5cf6" 
                            strokeWidth={2}
                            activeDot={{ r: 8 }} 
                          />
                        ) : null}
                        {segmentFilter === 'all' || segmentFilter === 'social' ? (
                          <Line 
                            type="monotone" 
                            dataKey="Social" 
                            stroke="#f97316" 
                            strokeWidth={2}
                            activeDot={{ r: 8 }} 
                          />
                        ) : null}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">6-Month LTV by Source</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ltv6mBySource}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({source, value}) => `${source}: $${value}`}
                        >
                          {ltv6mBySource.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value}`, 'LTV']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Insights & Recommendations</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                    <h3 className="font-medium text-blue-800 mb-2">Acquisition Strategy</h3>
                    <p className="text-sm text-blue-600 mb-4">
                      Affiliate-referred players show 50% higher LTV over 6 months compared to social media acquisitions.
                      Consider increasing affiliate budget allocation by 20%.
                    </p>
                    <div className="bg-white rounded-md p-2 text-xs text-blue-800">
                      <div className="font-medium mb-1">Key Metrics:</div>
                      <div className="grid grid-cols-2 gap-1">
                        <div>Affiliate LTV:</div>
                        <div className="text-right font-medium">$141</div>
                        <div>Social LTV:</div>
                        <div className="text-right font-medium">$78</div>
                        <div>ROI Difference:</div>
                        <div className="text-right font-medium">+80.8%</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-100 rounded-md p-4">
                    <h3 className="font-medium text-purple-800 mb-2">First Week Engagement</h3>
                    <p className="text-sm text-purple-600 mb-4">
                      Players who make 2+ deposits in the first week have 2.3x higher predicted LTV.
                      Focus retention efforts on one-time depositors with targeted second deposit bonuses.
                    </p>
                    <div className="bg-white rounded-md p-2 text-xs text-purple-800">
                      <div className="font-medium mb-1">Key Metrics:</div>
                      <div className="grid grid-cols-2 gap-1">
                        <div>1 Deposit LTV:</div>
                        <div className="text-right font-medium">$72</div>
                        <div>2+ Deposits LTV:</div>
                        <div className="text-right font-medium">$166</div>
                        <div>Conversion Rate:</div>
                        <div className="text-right font-medium">23%</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-100 rounded-md p-4">
                    <h3 className="font-medium text-green-800 mb-2">Game Preference Impact</h3>
                    <p className="text-sm text-green-600 mb-4">
                      Players who play 3+ different game categories in first month show 35% higher retention.
                      Create cross-category promotional campaigns to encourage exploration.
                    </p>
                    <div className="bg-white rounded-md p-2 text-xs text-green-800">
                      <div className="font-medium mb-1">Key Metrics:</div>
                      <div className="grid grid-cols-2 gap-1">
                        <div>Single Category:</div>
                        <div className="text-right font-medium">$94</div>
                        <div>Multi-Category:</div>
                        <div className="text-right font-medium">$127</div>
                        <div>LTV Increase:</div>
                        <div className="text-right font-medium">+35.1%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cohorts" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Cohort LTV Progression</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cohort</TableHead>
                        <TableHead>Players</TableHead>
                        <TableHead>1-Month LTV</TableHead>
                        <TableHead>3-Month LTV</TableHead>
                        <TableHead>6-Month LTV</TableHead>
                        <TableHead>Predicted 12-Month</TableHead>
                        <TableHead>Growth Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleCohortData.map((cohort) => (
                        <TableRow key={cohort.cohort} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{cohort.cohort}</TableCell>
                          <TableCell>{cohort.players}</TableCell>
                          <TableCell>${cohort.m1_ltv}</TableCell>
                          <TableCell>${cohort.m3_ltv}</TableCell>
                          <TableCell>${cohort.m6_ltv}</TableCell>
                          <TableCell className="font-medium">${cohort.predicted_12m}</TableCell>
                          <TableCell className="text-green-600">
                            +{((cohort.predicted_12m / cohort.m1_ltv - 1) * 100).toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="h-[300px] mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={sampleCohortData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="cohort" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, undefined]} />
                      <Legend />
                      <Bar dataKey="m1_ltv" name="1-Month LTV" stackId="a" fill="#818cf8" />
                      <Bar dataKey="m3_ltv" name="3-Month LTV" stackId="a" fill="#3b82f6" />
                      <Bar dataKey="m6_ltv" name="6-Month LTV" stackId="a" fill="#8b5cf6" />
                      <Bar dataKey="predicted_12m" name="Predicted 12-Month" stackId="a" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">First Deposit Influence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={firstDepositData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'First Deposit']} />
                        <Bar dataKey="value" name="First Deposit ($)" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 p-4 border rounded-md bg-gray-50">
                    <h3 className="font-medium mb-2">First Deposit Impact</h3>
                    <p className="text-sm text-gray-600">
                      Players with first deposits above the 75th percentile ($80) show a 2.8x higher 6-month LTV 
                      compared to those below the 25th percentile ($35). Focus on incentivizing higher initial deposits.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Retention to LTV Correlation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { days: 1, ltv: 10 },
                          { days: 7, ltv: 32 },
                          { days: 14, ltv: 48 },
                          { days: 30, ltv: 76 },
                          { days: 60, ltv: 105 },
                          { days: 90, ltv: 124 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="days" label={{ value: 'Days Retained', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'LTV ($)', angle: -90, position: 'insideLeft', offset: 10 }} />
                        <Tooltip formatter={(value, name) => [name === 'ltv' ? `$${value}` : value, name === 'ltv' ? 'LTV' : 'Days']} />
                        <Line type="monotone" dataKey="ltv" stroke="#8b5cf6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 p-4 border rounded-md bg-gray-50">
                    <h3 className="font-medium mb-2">Critical Milestones</h3>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-blue-50 rounded-md">
                        <div className="text-sm text-gray-600">7-Day Mark</div>
                        <div className="font-medium text-blue-600">$32</div>
                      </div>
                      <div className="p-2 bg-purple-50 rounded-md">
                        <div className="text-sm text-gray-600">30-Day Mark</div>
                        <div className="font-medium text-purple-600">$76</div>
                      </div>
                      <div className="p-2 bg-green-50 rounded-md">
                        <div className="text-sm text-gray-600">90-Day Mark</div>
                        <div className="font-medium text-green-600">$124</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="predictors" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">LTV Prediction Model</CardTitle>
                <CardDescription>Key factors influencing LTV prediction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      layout="vertical"
                      data={[
                        { factor: 'First Deposit Amount', importance: 82 },
                        { factor: 'First Week Deposit Frequency', importance: 76 },
                        { factor: 'Game Category Mix', importance: 68 },
                        { factor: 'Acquisition Source', importance: 61 },
                        { factor: 'Registration to First Deposit Time', importance: 57 },
                        { factor: 'Time of Day Activity', importance: 42 },
                        { factor: 'Bonus Usage Pattern', importance: 38 },
                        { factor: 'Device Type', importance: 31 }
                      ]}
                      margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} label={{ value: 'Relative Importance (%)', position: 'insideBottom', offset: -5 }} />
                      <YAxis type="category" dataKey="factor" width={150} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Importance']} />
                      <Bar dataKey="importance" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 border rounded-md bg-blue-50">
                    <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Player Segmentation Impact
                    </h3>
                    <p className="text-sm text-blue-700 mb-4">
                      LTV prediction accuracy increases by 37% when including player segmentation data.
                      Key segments with distinct LTV patterns:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-2 rounded-md">
                        <div className="text-sm font-medium text-gray-800">High-Rollers</div>
                        <div className="text-xs text-gray-600">6-Month LTV: $340</div>
                        <div className="text-xs text-gray-600">2.7% of players</div>
                      </div>
                      <div className="bg-white p-2 rounded-md">
                        <div className="text-sm font-medium text-gray-800">Bonus Hunters</div>
                        <div className="text-xs text-gray-600">6-Month LTV: $76</div>
                        <div className="text-xs text-gray-600">14.3% of players</div>
                      </div>
                      <div className="bg-white p-2 rounded-md">
                        <div className="text-sm font-medium text-gray-800">Weekend Warriors</div>
                        <div className="text-xs text-gray-600">6-Month LTV: $128</div>
                        <div className="text-xs text-gray-600">31.6% of players</div>
                      </div>
                      <div className="bg-white p-2 rounded-md">
                        <div className="text-sm font-medium text-gray-800">Casual Players</div>
                        <div className="text-xs text-gray-600">6-Month LTV: $64</div>
                        <div className="text-xs text-gray-600">51.4% of players</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md bg-purple-50">
                    <h3 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Early Behavior Indicators
                    </h3>
                    <p className="text-sm text-purple-700 mb-4">
                      First 7 days of player behavior accurately predicts 12-month LTV with 84% confidence.
                      Critical early indicators:
                    </p>
                    <div className="space-y-2">
                      <div className="bg-white p-2 rounded-md flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-800">Multi-game exploration</div>
                          <div className="text-xs text-gray-600">3+ game types = 1.8x higher LTV</div>
                        </div>
                        <div className="text-sm font-medium text-purple-600">+80%</div>
                      </div>
                      <div className="bg-white p-2 rounded-md flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-800">Second deposit timing</div>
                          <div className="text-xs text-gray-600">Within 48h = 2.3x higher LTV</div>
                        </div>
                        <div className="text-sm font-medium text-purple-600">+130%</div>
                      </div>
                      <div className="bg-white p-2 rounded-md flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-800">Session frequency</div>
                          <div className="text-xs text-gray-600">3+ sessions/week = 1.6x higher LTV</div>
                        </div>
                        <div className="text-sm font-medium text-purple-600">+60%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}