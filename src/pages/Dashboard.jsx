import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, BarChart, CheckCircle, Filter, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardType, setDashboardType] = useState('standard');

  const overviewData = [
    { date: "Jan 15", ggr: 2400, ngr: 1800, deposits: 112 },
    { date: "Jan 16", ggr: 1800, ngr: 1300, deposits: 98 },
    { date: "Jan 17", ggr: 3200, ngr: 2800, deposits: 140 },
    { date: "Jan 18", ggr: 2800, ngr: 2300, deposits: 121 },
    { date: "Jan 19", ggr: 3600, ngr: 3100, deposits: 160 },
    { date: "Jan 20", ggr: 3200, ngr: 2700, deposits: 145 }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">iGaming Analytics</h1>
            <p className="text-gray-500">
              Track, analyze, and optimize your gaming operations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last Quarter</SelectItem>
                <SelectItem value="py">Last Year</SelectItem>
                <SelectItem value="cy">Current Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setIsLoading(false)}>Refresh Data</Button>
          </div>
        </div>

        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
            </TabsList>
          
            <TabsContent value="overview">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        GGR (Gross Gaming Revenue)
                      </CardTitle>
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$24,560</div>
                      <p className="text-xs text-green-600">
                        +12.5% from previous period
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        NGR (Net Gaming Revenue)
                      </CardTitle>
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$18,935</div>
                      <p className="text-xs text-green-600">
                        +8.2% from previous period
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Deposits
                      </CardTitle>
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,258</div>
                      <p className="text-xs text-red-600">
                        -2.3% from previous period
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Active Players
                      </CardTitle>
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4,562</div>
                      <p className="text-xs text-green-600">
                        +5.8% from previous period
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={overviewData}>
                              <defs>
                                <linearGradient id="colorGgr" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorNgr" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="date" />
                              <YAxis />
                              <CartesianGrid strokeDasharray="3 3" />
                              <Tooltip />
                              <Legend />
                              <Area
                                type="monotone"
                                dataKey="ggr"
                                stroke="#4F46E5"
                                fillOpacity={1}
                                fill="url(#colorGgr)"
                              />
                              <Area
                                type="monotone"
                                dataKey="ngr"
                                stroke="#06B6D4"
                                fillOpacity={1}
                                fill="url(#colorNgr)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Platform Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span>Data Syncing</span>
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>API Status</span>
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Database Health</span>
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <Button variant="outline" className="w-full mt-4">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View System Status
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="affiliates">
              <div className="flex items-center justify-center h-64 bg-white rounded-lg border">
                <p className="text-gray-500">Affiliate analytics will be displayed here</p>
              </div>
            </TabsContent>

            <TabsContent value="payments">
              <div className="flex items-center justify-center h-64 bg-white rounded-lg border">
                <p className="text-gray-500">Payment analytics will be displayed here</p>
              </div>
            </TabsContent>

            <TabsContent value="benchmarks">
              <div className="flex items-center justify-center h-64 bg-white rounded-lg border">
                <p className="text-gray-500">Benchmark analytics will be displayed here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}