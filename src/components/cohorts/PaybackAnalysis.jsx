import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function PaybackAnalysis({ data }) {
  // Process data for payback analysis
  const analysisData = useMemo(() => {
    if (!data || data.length === 0) return { paybackTable: [], paybackChart: [] };
    
    // Get all cohorts (unique FTD months)
    const cohorts = [...new Set(data.map(d => d.ftd_month))].sort();
    
    // Get all month numbers
    const monthNumbers = [...new Set(data.map(d => d.month_number))].sort((a, b) => a - b);
    
    // Calculate cumulative metrics for each cohort
    const paybackTable = cohorts.map(cohort => {
      const cohortData = data.filter(d => d.ftd_month === cohort);
      
      // Skip if no data found
      if (!cohortData.length) return null;
      
      const marketingSpend = cohortData.find(d => d.month_number === 0)?.marketing_spend || 0;
      
      // Skip if no marketing spend
      if (marketingSpend === 0) return null;
      
      const monthlyData = monthNumbers.map(month => {
        const monthRecords = cohortData.filter(d => d.month_number <= month);
        
        if (!monthRecords.length) return { month, cumulativeDeposits: 0, cumulativeNGR: 0, depositsPaybackPct: 0, ngrPaybackPct: 0 };
        
        const cumulativeDeposits = monthRecords.reduce((sum, d) => sum + (d.deposits_amount || 0), 0);
        const cumulativeNGR = monthRecords.reduce((sum, d) => sum + (d.ngr || 0), 0);
        
        const depositsPaybackPct = (cumulativeDeposits / marketingSpend) * 100;
        const ngrPaybackPct = (cumulativeNGR / marketingSpend) * 100;
        
        return {
          month,
          cumulativeDeposits,
          cumulativeNGR,
          depositsPaybackPct,
          ngrPaybackPct
        };
      });
      
      // Find payback month (when NGR exceeds marketing spend)
      let ngrPaybackMonth = null;
      let depositsPaybackMonth = null;
      
      for (const monthData of monthlyData) {
        if (ngrPaybackMonth === null && monthData.ngrPaybackPct >= 100) {
          ngrPaybackMonth = monthData.month;
        }
        
        if (depositsPaybackMonth === null && monthData.depositsPaybackPct >= 100) {
          depositsPaybackMonth = monthData.month;
        }
        
        if (ngrPaybackMonth !== null && depositsPaybackMonth !== null) {
          break;
        }
      }
      
      // Calculate current ROI if we have data
      const latestMonth = monthlyData[monthlyData.length - 1];
      const currentROI = latestMonth ? (latestMonth.cumulativeNGR / marketingSpend) - 1 : -1;
      
      return {
        cohort,
        marketingSpend,
        monthlyData,
        ngrPaybackMonth,
        depositsPaybackMonth,
        currentROI
      };
    }).filter(Boolean); // Filter out any null values
    
    // Create chart data
    const paybackChart = [];
    
    if (paybackTable.length > 0) {
      const maxMonths = Math.max(...monthNumbers);
      
      for (let month = 0; month <= maxMonths; month++) {
        const dataPoint = {
          month: `Month ${month}`,
        };
        
        // Average across all cohorts
        let totalDepositsPayback = 0;
        let totalNGRPayback = 0;
        let cohortCount = 0;
        
        paybackTable.forEach(cohortData => {
          if (!cohortData || !cohortData.monthlyData) return;
          
          const monthData = cohortData.monthlyData.find(m => m && m.month === month);
          if (monthData) {
            totalDepositsPayback += monthData.depositsPaybackPct || 0;
            totalNGRPayback += monthData.ngrPaybackPct || 0;
            cohortCount++;
          }
        });
        
        if (cohortCount > 0) {
          dataPoint.avgDepositsPayback = totalDepositsPayback / cohortCount;
          dataPoint.avgNGRPayback = totalNGRPayback / cohortCount;
        } else {
          dataPoint.avgDepositsPayback = 0;
          dataPoint.avgNGRPayback = 0;
        }
        
        paybackChart.push(dataPoint);
      }
    }
    
    return {
      paybackTable,
      paybackChart
    };
  }, [data]);
  
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payback Analysis</CardTitle>
          <CardDescription>Return on Marketing Investment Analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-10 text-gray-500">No data available for the selected filters</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Marketing ROI Payback Timeline</CardTitle>
          <CardDescription>
            Showing how quickly marketing spend is recovered through deposits and NGR
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analysisData.paybackChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(2)}%`, undefined]}
                />
                <Legend />
                <ReferenceLine y={100} stroke="#888" strokeDasharray="3 3" />
                <Line 
                  type="monotone" 
                  dataKey="avgDepositsPayback" 
                  name="Deposits Payback %" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgNGRPayback" 
                  name="NGR Payback %" 
                  stroke="#f43f5e" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cohort (FTD Month)</TableHead>
                <TableHead>Marketing Spend</TableHead>
                <TableHead>Deposits Payback</TableHead>
                <TableHead>NGR Payback</TableHead>
                <TableHead>Current ROI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysisData.paybackTable.map((cohort) => (
                <TableRow key={cohort.cohort}>
                  <TableCell className="font-medium">{cohort.cohort}</TableCell>
                  <TableCell>${cohort.marketingSpend.toLocaleString()}</TableCell>
                  <TableCell>
                    {cohort.depositsPaybackMonth !== null ? (
                      <Badge className="bg-green-100 text-green-800">
                        Month {cohort.depositsPaybackMonth}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not yet</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {cohort.ngrPaybackMonth !== null ? (
                      <Badge className="bg-green-100 text-green-800">
                        Month {cohort.ngrPaybackMonth}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not yet</Badge>
                    )}
                  </TableCell>
                  <TableCell className={cohort.currentROI >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {(cohort.currentROI * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Monthly Payback Breakdown</CardTitle>
          <CardDescription>
            Detailed monthly breakdown of marketing spend recovery
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {analysisData.paybackTable.map((cohort) => (
            <div key={cohort.cohort} className="mb-8">
              <h3 className="font-medium text-lg mb-3">
                {cohort.cohort} Cohort (${cohort.marketingSpend.toLocaleString()} spent)
              </h3>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Deposits</TableHead>
                    <TableHead>NGR</TableHead>
                    <TableHead>Deposits Payback</TableHead>
                    <TableHead>NGR Payback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cohort.monthlyData.map((month) => (
                    <TableRow key={month.month}>
                      <TableCell>Month {month.month}</TableCell>
                      <TableCell>${month.cumulativeDeposits.toLocaleString()}</TableCell>
                      <TableCell>${month.cumulativeNGR.toLocaleString()}</TableCell>
                      <TableCell 
                        className={month.depositsPaybackPct >= 100 ? 'text-green-600 font-medium' : ''}
                      >
                        {month.depositsPaybackPct.toFixed(1)}%
                      </TableCell>
                      <TableCell 
                        className={month.ngrPaybackPct >= 100 ? 'text-green-600 font-medium' : ''}
                      >
                        {month.ngrPaybackPct.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}