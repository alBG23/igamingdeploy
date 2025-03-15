import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, TrendingUp, TrendingDown, Filter, Eye, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function AffiliateOptimization({ groupBy = 'none', period = '30d' }) {
  const [isLoading, setIsLoading] = useState(true);
  const [affiliateData, setAffiliateData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  // Load mock data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const mockData = [
        { 
          id: 'aff1', 
          name: 'BestCasinos.com', 
          clicks: 45280, 
          registrations: 2160, 
          conversion: 4.77, 
          ftd_count: 842, 
          ftd_rate: 38.98, 
          avg_deposit: 89.42,
          total_cost: 15000,
          roi: 3.42,
          trend: 'up',
          performance_score: 92,
          category: 'SEO',
          country: 'US'
        },
        { 
          id: 'aff2', 
          name: 'GamersChoice', 
          clicks: 38750, 
          registrations: 1690, 
          conversion: 4.36, 
          ftd_count: 620, 
          ftd_rate: 36.69, 
          avg_deposit: 72.18,
          total_cost: 12000,
          roi: 2.89,
          trend: 'up',
          performance_score: 86,
          category: 'Review Sites',
          country: 'DE'
        },
        { 
          id: 'aff3', 
          name: 'CasinoAffiliates', 
          clicks: 28420, 
          registrations: 1245, 
          conversion: 4.38, 
          ftd_count: 490, 
          ftd_rate: 39.36, 
          avg_deposit: 65.75,
          total_cost: 8500,
          roi: 2.56,
          trend: 'down',
          performance_score: 72,
          category: 'Media Buying',
          country: 'UK'
        },
        { 
          id: 'aff4', 
          name: 'SlotMasters', 
          clicks: 18920, 
          registrations: 865, 
          conversion: 4.57, 
          ftd_count: 310, 
          ftd_rate: 35.84, 
          avg_deposit: 81.92,
          total_cost: 6200,
          roi: 3.12,
          trend: 'up',
          performance_score: 88,
          category: 'Influencers',
          country: 'CA'
        },
        { 
          id: 'aff5', 
          name: 'BonusHunters', 
          clicks: 15780, 
          registrations: 720, 
          conversion: 4.56, 
          ftd_count: 275, 
          ftd_rate: 38.19, 
          avg_deposit: 68.45,
          total_cost: 5400,
          roi: 2.78,
          trend: 'down',
          performance_score: 69,
          category: 'Bonus Sites',
          country: 'AU'
        },
        { 
          id: 'aff6', 
          name: 'GamblingEmpire', 
          clicks: 12450, 
          registrations: 580, 
          conversion: 4.66, 
          ftd_count: 210, 
          ftd_rate: 36.21, 
          avg_deposit: 76.32,
          total_cost: 4200,
          roi: 3.05,
          trend: 'up',
          performance_score: 82,
          category: 'SEO',
          country: 'US'
        },
        { 
          id: 'aff7', 
          name: 'CasinoStreamers', 
          clicks: 10250, 
          registrations: 470, 
          conversion: 4.59, 
          ftd_count: 180, 
          ftd_rate: 38.3, 
          avg_deposit: 92.15,
          total_cost: 3600,
          roi: 3.67,
          trend: 'up',
          performance_score: 93,
          category: 'Streamers',
          country: 'SE'
        },
        { 
          id: 'aff8', 
          name: 'JackpotSeekers', 
          clicks: 9340, 
          registrations: 410, 
          conversion: 4.39, 
          ftd_count: 145, 
          ftd_rate: 35.37, 
          avg_deposit: 62.89,
          total_cost: 2900,
          roi: 2.35,
          trend: 'down',
          performance_score: 65,
          category: 'Bonus Sites',
          country: 'UK'
        },
      ];
      
      setAffiliateData(mockData);
      setFilteredData(mockData);
      setIsLoading(false);
    }, 1000);
  }, [period]);
  
  // Group data based on groupBy parameter
  useEffect(() => {
    if (groupBy === 'none' || !affiliateData.length) {
      setFilteredData(affiliateData);
      return;
    }
    
    if (groupBy === 'affiliate') {
      setFilteredData(affiliateData);
      return;
    }
    
    // Group by other criteria (country, category, etc.)
    const groupedData = [];
    const groupMap = {};
    
    affiliateData.forEach(affiliate => {
      const groupKey = affiliate[groupBy];
      if (!groupMap[groupKey]) {
        groupMap[groupKey] = {
          id: `group-${groupKey}`,
          name: groupKey,
          clicks: 0,
          registrations: 0,
          ftd_count: 0,
          total_cost: 0,
          affiliates: 0,
          country: groupBy === 'country' ? groupKey : 'Various',
          category: groupBy === 'category' ? groupKey : 'Various'
        };
        groupedData.push(groupMap[groupKey]);
      }
      
      // Sum up the values
      groupMap[groupKey].clicks += affiliate.clicks;
      groupMap[groupKey].registrations += affiliate.registrations;
      groupMap[groupKey].ftd_count += affiliate.ftd_count;
      groupMap[groupKey].total_cost += affiliate.total_cost;
      groupMap[groupKey].affiliates += 1;
    });
    
    // Calculate derived metrics
    groupedData.forEach(group => {
      group.conversion = (group.registrations / group.clicks * 100).toFixed(2);
      group.ftd_rate = (group.ftd_count / group.registrations * 100).toFixed(2);
      group.avg_deposit = ((group.total_cost * group.roi) / group.ftd_count).toFixed(2);
      group.roi = (group.affiliates > 0 ? 
        affiliateData.filter(a => a[groupBy] === group.name).reduce((sum, a) => sum + a.roi, 0) / 
        affiliateData.filter(a => a[groupBy] === group.name).length : 0).toFixed(2);
      group.performance_score = Math.round(
        affiliateData.filter(a => a[groupBy] === group.name).reduce((sum, a) => sum + a.performance_score, 0) / 
        affiliateData.filter(a => a[groupBy] === group.name).length
      );
      group.trend = group.performance_score > 80 ? 'up' : 'down';
    });
    
    setFilteredData(groupedData);
  }, [groupBy, affiliateData]);
  
  // Chart data preparation
  const chartData = filteredData.map(affiliate => ({
    name: affiliate.name.length > 12 ? affiliate.name.substring(0, 12) + '...' : affiliate.name,
    conversion: parseFloat(affiliate.conversion),
    roi: parseFloat(affiliate.roi),
    ftd_rate: parseFloat(affiliate.ftd_rate)
  }));
  
  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Affiliate Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                {filteredData.reduce((sum, affiliate) => sum + affiliate.clicks, 0).toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                {filteredData.reduce((sum, affiliate) => sum + affiliate.registrations, 0).toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Avg. Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                {(filteredData.reduce((sum, affiliate) => sum + parseFloat(affiliate.conversion), 0) / filteredData.length).toFixed(2)}%
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Average ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                {(filteredData.reduce((sum, affiliate) => sum + parseFloat(affiliate.roi), 0) / filteredData.length).toFixed(2)}x
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Affiliate Performance Metrics</CardTitle>
          <CardDescription>
            Comparing conversion rates, FTD rates, and ROI across {groupBy !== 'none' ? groupBy : 'affiliates'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="w-full h-[300px] flex items-center justify-center">
              <div className="space-y-2 w-full">
                <Skeleton className="h-[300px] w-full" />
              </div>
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="conversion" name="Conversion Rate (%)" fill="#4F46E5" />
                  <Bar dataKey="ftd_rate" name="FTD Rate (%)" fill="#10B981" />
                  <Bar dataKey="roi" name="ROI" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Detailed Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Affiliate Details</CardTitle>
            <CardDescription>
              {groupBy !== 'none' 
                ? `Data grouped by ${groupBy}` 
                : 'Detailed performance data for each affiliate'}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">Registrations</TableHead>
                    <TableHead className="text-right">Conv. Rate</TableHead>
                    <TableHead className="text-right">FTD Count</TableHead>
                    <TableHead className="text-right">FTD Rate</TableHead>
                    <TableHead className="text-right">Avg. Deposit</TableHead>
                    <TableHead className="text-right">ROI</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((affiliate) => (
                    <TableRow key={affiliate.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{affiliate.name}</span>
                          {groupBy !== 'none' && (
                            <span className="text-xs text-gray-500 mt-1">
                              {affiliate.affiliates > 0 ? `${affiliate.affiliates} affiliates` : ''}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{affiliate.clicks.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{affiliate.registrations.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{affiliate.conversion}%</TableCell>
                      <TableCell className="text-right">{affiliate.ftd_count.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{affiliate.ftd_rate}%</TableCell>
                      <TableCell className="text-right">${affiliate.avg_deposit}</TableCell>
                      <TableCell className="text-right">{affiliate.roi}x</TableCell>
                      <TableCell>
                        {affiliate.trend === 'up' ? (
                          <Badge className="bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                            <TrendingUp className="h-3 w-3" />
                            Up
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-600 border-red-200 flex items-center gap-1 w-fit">
                            <TrendingDown className="h-3 w-3" />
                            Down
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          className={`
                            ${affiliate.performance_score >= 90 ? 'bg-green-100 text-green-800' : 
                            affiliate.performance_score >= 80 ? 'bg-blue-100 text-blue-800' :
                            affiliate.performance_score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}
                          `}
                        >
                          {affiliate.performance_score}/100
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}