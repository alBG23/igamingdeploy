import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Download } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function AffiliatePerformance({ data, period, onPeriodChange }) {
  const [isLoading, setIsLoading] = useState(false);
  const [affiliateData, setAffiliateData] = useState([]);
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    // Simulate fetching data from SoftSwiss replica
    setIsLoading(true);
    
    setTimeout(() => {
      // This would be replaced with actual data from your SoftSwiss replica database
      // The schema would match replica_views.affiliate_performance
      
      const newAffiliateData = [
        { id: 'AF001', name: 'BetFinder', clicks: 5420, registrations: 210, ftds: 84, deposits: 18600, revenue: 4250, roi: 2.1, commission_model: 'revenue_share', commission_rate: 25 },
        { id: 'AF002', name: 'GamingSites', clicks: 4180, registrations: 183, ftds: 61, deposits: 14500, revenue: 3100, roi: 1.8, commission_model: 'revenue_share', commission_rate: 20 },
        { id: 'AF003', name: 'CasinoAffs', clicks: 6320, registrations: 274, ftds: 98, deposits: 22400, revenue: 5600, roi: 2.6, commission_model: 'cpa', commission_rate: 50 },
        { id: 'AF004', name: 'BetDeals', clicks: 3910, registrations: 142, ftds: 48, deposits: 10800, revenue: 2350, roi: 1.5, commission_model: 'hybrid', commission_rate: '30+$20' },
        { id: 'AF005', name: 'SlotPartners', clicks: 5180, registrations: 226, ftds: 82, deposits: 19200, revenue: 4790, roi: 2.3, commission_model: 'revenue_share', commission_rate: 30 }
      ];
      
      setAffiliateData(newAffiliateData);
      
      // Create chart data
      setChartData(newAffiliateData.map(affiliate => ({
        name: affiliate.name,
        ftd: affiliate.ftds,
        rev: affiliate.revenue
      })));
      
      setIsLoading(false);
    }, 1200);
  }, [period]);
  
  const getRoiColor = (roi) => {
    if (roi >= 2.0) return 'text-green-600';
    if (roi >= 1.5) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const getCommissionLabel = (affiliate) => {
    switch (affiliate.commission_model) {
      case 'revenue_share':
        return `${affiliate.commission_rate}% Revenue Share`;
      case 'cpa':
        return `$${affiliate.commission_rate} CPA`;
      case 'hybrid':
        return `Hybrid: ${affiliate.commission_rate}`;
      default:
        return 'Custom';
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <CardTitle>Affiliate Performance</CardTitle>
              <CardDescription>Top performing affiliate partners</CardDescription>
            </div>
            <div className="mt-2 md:mt-0 flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                View All Affiliates
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[250px] w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <>
              <div className="h-[250px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value, name) => [
                      name === 'ftd' ? value : `$${value}`,
                      name === 'ftd' ? 'First Time Depositors' : 'Revenue'
                    ]} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="ftd" name="First Time Depositors" fill="#4f46e5" />
                    <Bar yAxisId="right" dataKey="rev" name="Revenue ($)" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Registrations</TableHead>
                    <TableHead>FTDs</TableHead>
                    <TableHead>Deposits</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>ROI</TableHead>
                    <TableHead>Commission</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliateData.map((affiliate) => (
                    <TableRow key={affiliate.id} className="hover:bg-gray-50 cursor-pointer">
                      <TableCell className="font-medium">{affiliate.name}</TableCell>
                      <TableCell>{affiliate.registrations}</TableCell>
                      <TableCell>{affiliate.ftds}</TableCell>
                      <TableCell>${affiliate.deposits.toLocaleString()}</TableCell>
                      <TableCell>${affiliate.revenue.toLocaleString()}</TableCell>
                      <TableCell className={getRoiColor(affiliate.roi)}>
                        {affiliate.roi.toFixed(1)}x
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getCommissionLabel(affiliate)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}