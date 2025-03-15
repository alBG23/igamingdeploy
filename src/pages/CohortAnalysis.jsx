
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, parseISO, subMonths } from 'date-fns';
import { CohortData } from '@/api/entities';
import { Loader2, Download, Filter, Calendar, DollarSign, Users, TrendingUp, Percent } from 'lucide-react';

// Basic sample data for cohort analysis
const sampleCohortData = [
  // January 2023 Cohort
  {
    ftd_month: "2023-01", cohort_size: 320, affiliate_id: "AFF001", affiliate_name: "TopCasinoGuide",
    stag: "social", brand: "Lucky Casino", month_number: 0, deposits_amount: 38400, ngr: 7680, 
    unique_depositors: 320, marketing_spend: 12000
  },
  {
    ftd_month: "2023-01", cohort_size: 320, affiliate_id: "AFF001", affiliate_name: "TopCasinoGuide",
    stag: "social", brand: "Lucky Casino", month_number: 1, deposits_amount: 28800, ngr: 6048, 
    unique_depositors: 224, marketing_spend: 0
  },
  {
    ftd_month: "2023-01", cohort_size: 320, affiliate_id: "AFF001", affiliate_name: "TopCasinoGuide",
    stag: "social", brand: "Lucky Casino", month_number: 2, deposits_amount: 21600, ngr: 4752, 
    unique_depositors: 157, marketing_spend: 0
  },
  {
    ftd_month: "2023-01", cohort_size: 320, affiliate_id: "AFF001", affiliate_name: "TopCasinoGuide",
    stag: "social", brand: "Lucky Casino", month_number: 3, deposits_amount: 16200, ngr: 3645, 
    unique_depositors: 110, marketing_spend: 0
  },
  
  // February 2023 Cohort
  {
    ftd_month: "2023-02", cohort_size: 280, affiliate_id: "AFF002", affiliate_name: "SlotReviewer",
    stag: "blog", brand: "VIP Slots", month_number: 0, deposits_amount: 33600, ngr: 6720, 
    unique_depositors: 280, marketing_spend: 11200
  },
  {
    ftd_month: "2023-02", cohort_size: 280, affiliate_id: "AFF002", affiliate_name: "SlotReviewer",
    stag: "blog", brand: "VIP Slots", month_number: 1, deposits_amount: 25200, ngr: 5292, 
    unique_depositors: 196, marketing_spend: 0
  },
  {
    ftd_month: "2023-02", cohort_size: 280, affiliate_id: "AFF002", affiliate_name: "SlotReviewer",
    stag: "blog", brand: "VIP Slots", month_number: 2, deposits_amount: 18900, ngr: 4095, 
    unique_depositors: 137, marketing_spend: 0
  },
  
  // March 2023 Cohort
  {
    ftd_month: "2023-03", cohort_size: 350, affiliate_id: "AFF003", affiliate_name: "GamingPartners",
    stag: "email", brand: "Lucky Casino", month_number: 0, deposits_amount: 42000, ngr: 8400, 
    unique_depositors: 350, marketing_spend: 14000
  },
  {
    ftd_month: "2023-03", cohort_size: 350, affiliate_id: "AFF003", affiliate_name: "GamingPartners",
    stag: "email", brand: "Lucky Casino", month_number: 1, deposits_amount: 31500, ngr: 6615, 
    unique_depositors: 245, marketing_spend: 0
  }
];

export default function CohortAnalysis() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('deposits');
  const [cohortData, setCohortData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState({
    stag: 'all',
    affiliateId: 'all',
    brand: 'all'
  });

  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    stags: [],
    affiliateIds: [],
    brands: []
  });

  useEffect(() => {
    // Load data
    setTimeout(() => {
      setCohortData(sampleCohortData);
      setFilteredData(sampleCohortData);
      
      // Extract filter options
      const stags = [...new Set(sampleCohortData.map(d => d.stag))];
      const affiliateIds = [...new Set(sampleCohortData.map(d => d.affiliate_id))];
      const brands = [...new Set(sampleCohortData.map(d => d.brand))];
      
      setFilterOptions({
        stags,
        affiliateIds,
        brands
      });
      
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter data based on user selections
  const applyFilters = () => {
    let filtered = [...cohortData];
    
    if (filter.stag !== 'all') {
      filtered = filtered.filter(d => d.stag === filter.stag);
    }
    
    if (filter.affiliateId !== 'all') {
      filtered = filtered.filter(d => d.affiliate_id === filter.affiliateId);
    }
    
    if (filter.brand !== 'all') {
      filtered = filtered.filter(d => d.brand === filter.brand);
    }
    
    setFilteredData(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    setFilter(prev => {
      const newFilter = { ...prev, [filterKey]: value };
      
      // Apply filters with short delay
      setTimeout(() => {
        let filtered = [...cohortData];
        
        if (newFilter.stag !== 'all') {
          filtered = filtered.filter(d => d.stag === newFilter.stag);
        }
        
        if (newFilter.affiliateId !== 'all') {
          filtered = filtered.filter(d => d.affiliate_id === newFilter.affiliateId);
        }
        
        if (newFilter.brand !== 'all') {
          filtered = filtered.filter(d => d.brand === newFilter.brand);
        }
        
        setFilteredData(filtered);
      }, 0);
      
      return newFilter;
    });
  };

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Process data to display in cohort tables
  const getProcessedCohortData = () => {
    // Get unique cohorts (FTD months) and sort chronologically
    const cohorts = [...new Set(filteredData.map(d => d.ftd_month))].sort();
    
    // Get all month numbers and sort
    const monthNumbers = [...new Set(filteredData.map(d => d.month_number))].sort((a, b) => a - b);
    
    // Create tables for each metric
    const depositsTable = {};
    const ngrTable = {};
    const depositorsTable = {};
    
    cohorts.forEach(cohort => {
      depositsTable[cohort] = {};
      ngrTable[cohort] = {};
      depositorsTable[cohort] = {};
      
      monthNumbers.forEach(month => {
        const record = filteredData.find(d => d.ftd_month === cohort && d.month_number === month);
        
        depositsTable[cohort][month] = record ? record.deposits_amount : null;
        ngrTable[cohort][month] = record ? record.ngr : null;
        depositorsTable[cohort][month] = record ? record.unique_depositors : null;
      });
    });
    
    return {
      cohorts,
      monthNumbers,
      depositsTable,
      ngrTable,
      depositorsTable
    };
  };

  // Processed data
  const processedData = getProcessedCohortData();

  // Render cohort table
  const renderCohortTable = (title, description, dataTable, formatter = formatCurrency) => {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-medium">FTD Cohort</th>
                {processedData.monthNumbers.map(month => (
                  <th key={month} className="text-right py-2 px-3 font-medium">
                    {month === 0 ? 'Month 0' : `M+${month}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedData.cohorts.map(cohort => (
                <tr key={cohort} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium">
                    {cohort}
                  </td>
                  {processedData.monthNumbers.map(month => (
                    <td key={month} className="text-right py-2 px-3">
                      {dataTable[cohort][month] !== null 
                        ? formatter(dataTable[cohort][month]) 
                        : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    );
  };

  // Calculate marketing ROI data
  const calculatePaybackData = () => {
    const paybackData = {};
    
    processedData.cohorts.forEach(cohort => {
      const cohortData = filteredData.filter(d => d.ftd_month === cohort);
      if (cohortData.length === 0) return;
      
      const marketingSpend = cohortData.find(d => d.month_number === 0)?.marketing_spend || 0;
      if (marketingSpend === 0) return;
      
      paybackData[cohort] = {
        marketingSpend,
        months: {}
      };
      
      // Calculate each month's contribution and cumulative payback
      processedData.monthNumbers.forEach(month => {
        // Get data for this specific month
        const monthRecord = cohortData.find(d => d.month_number === month);
        
        // Monthly contribution (not cumulative)
        const monthlyDeposits = monthRecord?.deposits_amount || 0;
        const monthlyNGR = monthRecord?.ngr || 0;
        
        // Monthly payback percentages
        const monthlyDepositsPayback = (monthlyDeposits / marketingSpend) * 100;
        const monthlyNGRPayback = (monthlyNGR / marketingSpend) * 100;
        
        // Add to months data
        paybackData[cohort].months[month] = {
          monthlyDeposits,
          monthlyNGR,
          monthlyDepositsPayback,
          monthlyNGRPayback
        };
      });
      
      // Calculate cumulative values
      let cumulativeDepositsPayback = 0;
      let cumulativeNGRPayback = 0;
      
      processedData.monthNumbers.forEach(month => {
        const monthData = paybackData[cohort].months[month];
        
        // Add this month's contribution to the cumulative total
        cumulativeDepositsPayback += monthData.monthlyDepositsPayback;
        cumulativeNGRPayback += monthData.monthlyNGRPayback;
        
        // Update the month data with cumulative figures
        monthData.cumulativeDepositsPayback = cumulativeDepositsPayback;
        monthData.cumulativeNGRPayback = cumulativeNGRPayback;
      });
    });
    
    return paybackData;
  };

  const paybackData = calculatePaybackData();

  // Find payback month for each cohort
  const getPaybackInfo = () => {
    const info = {};
    
    Object.entries(paybackData).forEach(([cohort, data]) => {
      let depositsPaybackMonth = null;
      let ngrPaybackMonth = null;
      
      Object.entries(data.months).forEach(([month, metrics]) => {
        if (depositsPaybackMonth === null && metrics.cumulativeDepositsPayback >= 100) {
          depositsPaybackMonth = parseInt(month);
        }
        
        if (ngrPaybackMonth === null && metrics.cumulativeNGRPayback >= 100) {
          ngrPaybackMonth = parseInt(month);
        }
      });
      
      info[cohort] = {
        depositsPaybackMonth,
        ngrPaybackMonth,
        marketingSpend: data.marketingSpend,
        latestMonth: Math.max(...Object.keys(data.months).map(Number)),
        latestData: data.months[Math.max(...Object.keys(data.months).map(Number))]
      };
    });
    
    return info;
  };

  const paybackInfo = getPaybackInfo();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cohort Analysis</h1>
            <p className="text-gray-500">
              Track player behavior and financial performance over time
            </p>
          </div>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sub-Affiliate Tag</label>
                <Select 
                  value={filter.stag} 
                  onValueChange={(value) => handleFilterChange('stag', value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {filterOptions.stags.map(stag => (
                      <SelectItem key={stag} value={stag}>{stag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Affiliate</label>
                <Select 
                  value={filter.affiliateId} 
                  onValueChange={(value) => handleFilterChange('affiliateId', value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select affiliate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Affiliates</SelectItem>
                    {filterOptions.affiliateIds.map(id => (
                      <SelectItem key={id} value={id}>
                        {cohortData.find(d => d.affiliate_id === id)?.affiliate_name || id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <Select 
                  value={filter.brand} 
                  onValueChange={(value) => handleFilterChange('brand', value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {filterOptions.brands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
            <span className="ml-2 text-lg text-gray-500">Loading cohort data...</span>
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="deposits">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Deposits
                </TabsTrigger>
                <TabsTrigger value="ngr">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  NGR
                </TabsTrigger>
                <TabsTrigger value="depositors">
                  <Users className="w-4 h-4 mr-1" />
                  Depositors
                </TabsTrigger>
                <TabsTrigger value="payback">
                  <Percent className="w-4 h-4 mr-1" />
                  Payback Analysis
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {activeTab === 'deposits' && (
              renderCohortTable(
                'Total Deposits Amount Breakdown',
                'How much money players from each cohort deposit over time',
                processedData.depositsTable
              )
            )}

            {activeTab === 'ngr' && (
              renderCohortTable(
                'Total NGR Breakdown',
                'Net Gaming Revenue generated by each cohort over time',
                processedData.ngrTable
              )
            )}

            {activeTab === 'depositors' && (
              renderCohortTable(
                'Unique Depositors Count',
                'Number of unique players making deposits each month',
                processedData.depositorsTable,
                value => value.toLocaleString()
              )
            )}

            {activeTab === 'payback' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Marketing ROI Analysis</CardTitle>
                    <CardDescription>
                      Return on marketing investment over time - showing monthly and cumulative percentage of marketing spend recovered
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 font-medium">FTD Cohort</th>
                          <th className="text-left py-2 px-3 font-medium">Marketing Spend</th>
                          <th className="text-left py-2 px-3 font-medium">Deposits Recovery</th>
                          <th className="text-left py-2 px-3 font-medium">NGR Recovery</th>
                          <th className="text-left py-2 px-3 font-medium">Current ROI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(paybackInfo).map(([cohort, info]) => {
                          const latestData = info.latestData;
                          const roi = latestData ? (latestData.cumulativeNGRPayback / 100) - 1 : -1;
                          
                          return (
                            <tr key={cohort} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-3 font-medium">{cohort}</td>
                              <td className="py-3 px-3">{formatCurrency(info.marketingSpend)}</td>
                              <td className="py-3 px-3">
                                {info.depositsPaybackMonth !== null ?
                                  `Month ${info.depositsPaybackMonth} (${latestData.cumulativeDepositsPayback.toFixed(1)}%)` :
                                  `${latestData.cumulativeDepositsPayback.toFixed(1)}% so far`
                                }
                              </td>
                              <td className="py-3 px-3">
                                {info.ngrPaybackMonth !== null ?
                                  `Month ${info.ngrPaybackMonth} (${latestData.cumulativeNGRPayback.toFixed(1)}%)` :
                                  `${latestData.cumulativeNGRPayback.toFixed(1)}% so far`
                                }
                              </td>
                              <td className={`py-3 px-3 font-medium ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {(roi * 100).toFixed(1)}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Payback Breakdown by Month</CardTitle>
                    <CardDescription>
                      Monthly and cumulative payback percentages for each cohort
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    {Object.entries(paybackData).map(([cohort, data]) => (
                      <div key={cohort} className="mb-8">
                        <h3 className="text-lg font-semibold mb-3">Cohort: {cohort} (Marketing Spend: {formatCurrency(data.marketingSpend)})</h3>
                        <table className="w-full border-collapse mb-6">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-3 font-medium">Month</th>
                              {processedData.monthNumbers.map(month => (
                                <th key={month} className="text-center py-2 px-3 font-medium">
                                  {month === 0 ? 'Month 0' : `M+${month}`}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b hover:bg-gray-50">
                              <td className="py-2 px-3 font-medium">Monthly NGR %</td>
                              {processedData.monthNumbers.map(month => (
                                <td key={month} className="text-center py-2 px-3">
                                  {data.months[month]?.monthlyNGRPayback.toFixed(1)}%
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b hover:bg-gray-50 bg-gray-50">
                              <td className="py-2 px-3 font-medium">Cumulative NGR %</td>
                              {processedData.monthNumbers.map(month => (
                                <td key={month} className={`text-center py-2 px-3 ${data.months[month]?.cumulativeNGRPayback >= 100 ? 'bg-green-100 font-medium' : ''}`}>
                                  {data.months[month]?.cumulativeNGRPayback.toFixed(1)}%
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                              <td className="py-2 px-3 font-medium">Monthly Deposits %</td>
                              {processedData.monthNumbers.map(month => (
                                <td key={month} className="text-center py-2 px-3">
                                  {data.months[month]?.monthlyDepositsPayback.toFixed(1)}%
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b hover:bg-gray-50 bg-gray-50">
                              <td className="py-2 px-3 font-medium">Cumulative Deposits %</td>
                              {processedData.monthNumbers.map(month => (
                                <td key={month} className={`text-center py-2 px-3 ${data.months[month]?.cumulativeDepositsPayback >= 100 ? 'bg-green-100 font-medium' : ''}`}>
                                  {data.months[month]?.cumulativeDepositsPayback.toFixed(1)}%
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
