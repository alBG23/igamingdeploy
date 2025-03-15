import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Download, Settings, DollarSign, PlusCircle, AlertTriangle, Trash2, Check, Save, Target, ArrowRight, Calculator, Zap } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Sample data for P&L statement
const pnlData = [
  {
    month: 'Jan',
    ftds: 100,
    activePlayers: 200,
    deposits: 50000,
    ggr: 15000,
    ngr: 12000,
    acquisitionCosts: -4000,
    gameProviderFees: -1500,
    processingFees: -1000,
    platformFees: -800,
    salaries: -5000,
    overheads: -2000,
    marketingServices: -3000,
    compliance: 0,
    directCosts: -7300,
    fixedCosts: -10000,
    totalCosts: -17300,
    pnl: -5300,
    cumulativePnl: -5300
  },
  {
    month: 'Feb',
    ftds: 120,
    activePlayers: 220,
    deposits: 60000,
    ggr: 18000,
    ngr: 14500,
    acquisitionCosts: -5000,
    gameProviderFees: -1800,
    processingFees: -1200,
    platformFees: -900,
    salaries: -5000,
    overheads: -2000,
    marketingServices: -3500,
    compliance: 0,
    directCosts: -8900,
    fixedCosts: -10500,
    totalCosts: -19400,
    pnl: -4900,
    cumulativePnl: -10200
  },
  {
    month: 'Mar',
    ftds: 140,
    activePlayers: 250,
    deposits: 70000,
    ggr: 21000,
    ngr: 17500,
    acquisitionCosts: -6000,
    gameProviderFees: -2100,
    processingFees: -1400,
    platformFees: -1000,
    salaries: -5000,
    overheads: -2000,
    marketingServices: -4000,
    compliance: 0,
    directCosts: -10500,
    fixedCosts: -11000,
    totalCosts: -21500,
    pnl: -4000,
    cumulativePnl: -14200
  },
  {
    month: 'Apr',
    ftds: 160,
    activePlayers: 270,
    deposits: 80000,
    ggr: 25000,
    ngr: 21000,
    acquisitionCosts: -7000,
    gameProviderFees: -2500,
    processingFees: -1600,
    platformFees: -1200,
    salaries: -5000,
    overheads: -2000,
    marketingServices: -4500,
    compliance: 0,
    directCosts: -12300,
    fixedCosts: -11500,
    totalCosts: -23800,
    pnl: -2800,
    cumulativePnl: -17000
  },
  {
    month: 'May',
    ftds: 180,
    activePlayers: 300,
    deposits: 90000,
    ggr: 28000,
    ngr: 24000,
    acquisitionCosts: -8000,
    gameProviderFees: -2800,
    processingFees: -1800,
    platformFees: -1300,
    salaries: -5000,
    overheads: -2000,
    marketingServices: -5000,
    compliance: 0,
    directCosts: -13900,
    fixedCosts: -12000,
    totalCosts: -25900,
    pnl: -1900,
    cumulativePnl: -18900
  },
  {
    month: 'Jun',
    ftds: 200,
    activePlayers: 320,
    deposits: 100000,
    ggr: 30000,
    ngr: 26000,
    acquisitionCosts: -9000,
    gameProviderFees: -3000,
    processingFees: -2000,
    platformFees: -1500,
    salaries: -5000,
    overheads: -2000,
    marketingServices: -5500,
    compliance: 0,
    directCosts: -15500,
    fixedCosts: -12500,
    totalCosts: -28000,
    pnl: -2000,
    cumulativePnl: -20900
  }
];

// Cost distribution data (last month)
const costDistributionData = [
  { name: 'Acquisition', value: 9000, percentage: 32 },
  { name: 'Game Provider', value: 3000, percentage: 11 },
  { name: 'Processing', value: 2000, percentage: 7 },
  { name: 'Platform', value: 1500, percentage: 5 },
  { name: 'Salaries', value: 5000, percentage: 18 },
  { name: 'Overheads', value: 2000, percentage: 7 },
  { name: 'Marketing Services', value: 5500, percentage: 20 },
];

// Costs as % of NGR
const ngrPercentageData = [
  { name: 'Acquisition', value: 34.6 },
  { name: 'GameProvider', value: 11.5 },
  { name: 'Processing', value: 7.7 },
  { name: 'Platform', value: 5.8 },
  { name: 'Salaries', value: 19.2 },
  { name: 'Overheads', value: 7.7 },
  { name: 'MarketingServices', value: 21.2 },
];

// Enhanced affiliate data with LTV and capacity information
const affiliateData = [
  { 
    id: 1, 
    name: 'TopAffiliates', 
    cpa: 150, 
    revshare: 25, 
    ftds_monthly: 65, 
    avg_ftd_value: 120, 
    retention: 'Medium',
    ltv_6month: 380,
    max_capacity: 120,
    expected_cpa_at_max: 170
  },
  { 
    id: 2, 
    name: 'CasinoPartners', 
    cpa: 180, 
    revshare: 30, 
    ftds_monthly: 45, 
    avg_ftd_value: 140, 
    retention: 'High',
    ltv_6month: 450,
    max_capacity: 90,
    expected_cpa_at_max: 200
  },
  { 
    id: 3, 
    name: 'GamingAffiliates', 
    cpa: 120, 
    revshare: 20, 
    ftds_monthly: 80, 
    avg_ftd_value: 100, 
    retention: 'Low',
    ltv_6month: 290,
    max_capacity: 150,
    expected_cpa_at_max: 130
  },
  { 
    id: 4, 
    name: 'BetPromoters', 
    cpa: 160, 
    revshare: 28, 
    ftds_monthly: 55, 
    avg_ftd_value: 130, 
    retention: 'Medium',
    ltv_6month: 400,
    max_capacity: 100,
    expected_cpa_at_max: 180
  },
  { 
    id: 5, 
    name: 'SlotPartners', 
    cpa: 140, 
    revshare: 22, 
    ftds_monthly: 70, 
    avg_ftd_value: 110, 
    retention: 'Medium',
    ltv_6month: 320,
    max_capacity: 130,
    expected_cpa_at_max: 150
  },
];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a480cf', '#ff6b6b', '#20c997', '#6f42c1'];

export default function PnLDashboard() {
  const [period, setPeriod] = useState('6m');
  const [currency, setCurrency] = useState('eur');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Cost settings state
  const [costSettings, setCostSettings] = useState({
    gameProviderFees: {
      basedOn: 'ggr',
      percentage: 10
    },
    processingFees: {
      basedOn: 'deposits', 
      percentage: 2
    },
    platformFees: {
      basedOn: 'ngr',
      percentage: 6
    },
    fixedCosts: {
      salaries: 5000,
      overheads: 2000
    },
    customCosts: [
      {
        id: 1,
        name: 'Marketing Services',
        type: 'fixed',
        basedOn: null, 
        amount: 3000
      },
      {
        id: 2,
        name: 'Compliance',
        type: 'per_player',
        basedOn: 'active_players',
        amount: 5
      }
    ],
    alertThreshold: 60
  });
  
  // Target Calculator State
  const [targetNGR, setTargetNGR] = useState(800000);
  const [targetProfitMargin, setTargetProfitMargin] = useState(15);
  const [timeframe, setTimeframe] = useState(6); // months
  const [acquisitionCost, setAcquisitionCost] = useState(150); // average CPA
  const [avgDepositValue, setAvgDepositValue] = useState(120); // average first deposit
  const [retentionRate, setRetentionRate] = useState(30); // 30% retained after first month
  
  // Enhanced affiliate planning
  const [affiliates, setAffiliates] = useState(affiliateData.map(aff => ({
    ...aff,
    allocatedFTDs: 0,
    customMaxCapacity: aff.max_capacity,
    customExpectedCPA: aff.expected_cpa_at_max
  })));

  // Calculate summary data
  const totalNGR = pnlData.reduce((sum, month) => sum + month.ngr, 0);
  const totalCosts = pnlData.reduce((sum, month) => sum + month.totalCosts, 0);
  const cumulativePnL = pnlData[pnlData.length - 1].cumulativePnl;
  
  // Calculated values for target calculator
  const targetProfit = targetNGR * (targetProfitMargin / 100);
  const estimatedCosts = targetNGR - targetProfit;
  const requiredFTDs = Math.ceil((targetNGR * 0.5) / avgDepositValue); // Assuming 50% of NGR comes from first deposits
  const requiredFTDsPerMonth = Math.ceil(requiredFTDs / timeframe);
  const totalAllocatedFTDs = affiliates.reduce((sum, affiliate) => sum + affiliate.allocatedFTDs, 0);
  const ftdGap = requiredFTDs - totalAllocatedFTDs;
  const acquisitionBudget = affiliates.reduce((sum, affiliate) => 
    sum + (affiliate.allocatedFTDs * (affiliate.allocatedFTDs >= affiliate.ftds_monthly ? 
      affiliate.customExpectedCPA : affiliate.cpa)), 0);
  const acquisitionBudgetPerMonth = Math.ceil(acquisitionBudget / timeframe);

  // Calculate optimal allocation based on affiliate performance
  const calculateOptimalAllocation = () => {
    // Simple algorithm - allocate FTDs based on cost efficiency (LTV / CPA ratio)
    const affiliatesWithEfficiency = affiliateData.map(aff => ({
      ...aff,
      efficiency: aff.ltv_6month / aff.cpa,
      availableCapacity: aff.max_capacity - aff.ftds_monthly
    }))
    .filter(aff => aff.availableCapacity > 0)
    .sort((a, b) => b.efficiency - a.efficiency);
    
    let remainingFTDs = requiredFTDs;
    const newAllocation = affiliateData.map(aff => ({
      ...aff,
      allocatedFTDs: 0,
      customMaxCapacity: aff.max_capacity,
      customExpectedCPA: aff.expected_cpa_at_max
    }));
    
    // First, allocate the current monthly FTDs
    newAllocation.forEach(aff => {
      aff.allocatedFTDs = aff.ftds_monthly;
      remainingFTDs -= aff.ftds_monthly;
    });
    
    // Then, allocate additional FTDs to most efficient affiliates first
    for (const aff of affiliatesWithEfficiency) {
      if (remainingFTDs <= 0) break;
      
      const thisAffInNewAllocation = newAllocation.find(a => a.id === aff.id);
      const additionalCapacity = aff.availableCapacity;
      const additionalFTDs = Math.min(additionalCapacity, remainingFTDs);
      
      thisAffInNewAllocation.allocatedFTDs += additionalFTDs;
      remainingFTDs -= additionalFTDs;
    }
    
    setAffiliates(newAllocation);
  };
  
  const updateAffiliateAllocation = (id, ftds) => {
    setAffiliates(prev => prev.map(aff => 
      aff.id === id ? { ...aff, allocatedFTDs: parseInt(ftds) || 0 } : aff
    ));
  };
  
  const addCustomCost = () => {
    const newCustomCost = {
      id: Date.now(),
      name: 'New Cost',
      type: 'fixed',
      basedOn: null,
      amount: 0
    };
    
    setCostSettings({
      ...costSettings,
      customCosts: [...costSettings.customCosts, newCustomCost]
    });
  };
  
  const removeCustomCost = (id) => {
    setCostSettings({
      ...costSettings,
      customCosts: costSettings.customCosts.filter(cost => cost.id !== id)
    });
  };
  
  const updateCustomCost = (id, field, value) => {
    setCostSettings({
      ...costSettings,
      customCosts: costSettings.customCosts.map(cost => {
        if (cost.id === id) {
          if (field === 'type' && value === 'fixed') {
            return { ...cost, [field]: value, basedOn: null };
          }
          return { ...cost, [field]: value };
        }
        return cost;
      })
    });
  };
  
  // Function to save cost settings
  const saveSettings = () => {
    // In a real implementation, this would send the cost settings to your backend
    alert('Settings saved successfully');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">P&L Dashboard</h1>
            <p className="text-gray-500">
              Track revenues, costs and profitability over time
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Edit Settings
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">P&L Overview</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Details</TabsTrigger>
            <TabsTrigger value="cost-settings">Cost Settings</TabsTrigger>
            <TabsTrigger value="target-calculator">Target Calculator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total NGR
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€{totalNGR.toLocaleString()}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Costs
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">€{totalCosts.toLocaleString()}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Cumulative P&L
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${cumulativePnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    €{cumulativePnL.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>P&L Statement</CardTitle>
                  <CardDescription>
                    Monthly breakdown of revenues, costs and profit
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Metric</TableHead>
                        {pnlData.map((month) => (
                          <TableHead key={month.month} className="text-right">{month.month}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="bg-gray-50">
                        <TableCell colSpan={7} className="font-medium">Revenue & Player Metrics</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>FTDs Count</TableCell>
                        {pnlData.map((month) => (
                          <TableCell key={month.month} className="text-right">{month.ftds}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>Active Players</TableCell>
                        {pnlData.map((month) => (
                          <TableCell key={month.month} className="text-right">{month.activePlayers}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>Deposits</TableCell>
                        {pnlData.map((month) => (
                          <TableCell key={month.month} className="text-right">€{month.deposits.toLocaleString()}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>Gross Gaming Revenue (GGR)</TableCell>
                        {pnlData.map((month) => (
                          <TableCell key={month.month} className="text-right">€{month.ggr.toLocaleString()}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>Net Gaming Revenue (NGR)</TableCell>
                        {pnlData.map((month) => (
                          <TableCell key={month.month} className="text-right font-medium">€{month.ngr.toLocaleString()}</TableCell>
                        ))}
                      </TableRow>
                      
                      <TableRow className="bg-gray-50">
                        <TableCell colSpan={7} className="font-medium">Costs</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Acquisition Costs</TableCell>
                        {pnlData.map((month) => (
                          <TableCell key={month.month} className="text-right text-red-600">€{month.acquisitionCosts.toLocaleString()}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>Game Provider Fees</TableCell>
                        {pnlData.map((month) => (
                          <TableCell key={month.month} className="text-right text-red-600">€{month.gameProviderFees.toLocaleString()}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>Processing Fees</TableCell>
                        {pnlData.map((month) => (
                          <TableCell key={month.month} className="text-right text-red-600">€{month.processingFees.toLocaleString()}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>Platform Fees</TableCell>
                        {pnlData.map((month) => (
                          <TableCell key={month.month} className="text-right text-red-600">€{month.platformFees.toLocaleString()}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>Salaries</TableCell>
                        {pnlData.map((month) => (
                          <TableCell key={month.month} className="text-right text-red-600">€{month.salaries.toLocaleString()}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>Overheads</TableCell>
                        {pnlData.map((month) => (
                          <TableCell key={month.month} className="text-right text-red-600">€{month.overheads.toLocaleString()}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>Marketing Services</TableCell>
                        {pnlData.map((month) => (
                          <TableCell key={month.month} className="text-right text-red-600">€{month.marketingServices.toLocaleString()}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>Compliance</TableCell>
                        {pnlData.map((month) => (
                          <TableCell key={month.month} className="text-right">€{month.compliance.toLocaleString()}</TableCell>
                        ))}
                      </TableRow>
                      
                      <TableRow className="bg-gray-50">
                        <TableCell colSpan={7} className="font-medium">Summary</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Direct Costs</TableCell>
                        {pnlData.map((month) => (
                          <TableCell key={month.month} className="text-right text-red-600">€{month.directCosts.toLocaleString()}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Fixed Costs</TableCell>
                        {pnlData.map((month) => (
                          <TableCell key={month.month} className="text-right text-red-600">€{month.fixedCosts.toLocaleString()}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Costs</TableCell>
                        {pnlData.map((month) => (
                          <TableCell key={month.month} className="text-right font-medium text-red-600">€{month.totalCosts.toLocaleString()}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>P&L</TableCell>
                        {pnlData.map((month) => (
                          <TableCell key={month.month} className={`text-right font-medium ${month.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            €{month.pnl.toLocaleString()}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>Cumulative P&L</TableCell>
                        {pnlData.map((month) => (
                          <TableCell key={month.month} className={`text-right font-medium ${month.cumulativePnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            €{month.cumulativePnl.toLocaleString()}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue vs Costs</CardTitle>
                  <CardDescription>
                    Monthly breakdown of revenue and costs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={pnlData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `€${Math.abs(value).toLocaleString()}`} />
                        <Legend />
                        <Bar dataKey="ngr" name="NGR" fill="#4F46E5" />
                        <Bar dataKey="totalCosts" name="Total Costs" fill="#EC4899" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>P&L Trend</CardTitle>
                  <CardDescription>
                    Monthly profit and loss with cumulative trend
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={pnlData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip formatter={(value) => `€${value.toLocaleString()}`} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="pnl" name="Monthly P&L" fill="#10B981" />
                        <Line yAxisId="right" type="monotone" dataKey="cumulativePnl" name="Cumulative P&L" stroke="#F59E0B" strokeWidth={2} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of costs as percentages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <h4 className="text-sm font-medium mb-2 text-center">Costs as % of NGR (Latest Month)</h4>
                    <ResponsiveContainer width="100%" height="50%">
                      <BarChart
                        data={ngrPercentageData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Bar dataKey="value" fill="#8884d8">
                          {ngrPercentageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    
                    <div className="mt-8">
                      <h4 className="text-sm font-medium mb-2 text-center">Costs as % of Total Costs (Latest Month)</h4>
                      <ResponsiveContainer width="100%" height="40%">
                        <PieChart>
                          <Pie
                            data={costDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {costDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `€${value.toLocaleString()}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Target Calculator</CardTitle>
                  <CardDescription>
                    Use the Target Calculator tab to plan your profitability targets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Target className="h-12 w-12 text-indigo-600 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Plan Your Financial Targets</h3>
                    <p className="text-gray-500 mb-6 max-w-md">
                      Set NGR goals, profit margin targets, and optimize your affiliate allocation to achieve profitability.
                    </p>
                    <Button onClick={() => setActiveTab('target-calculator')}>
                      <Calculator className="h-4 w-4 mr-2" />
                      Open Target Calculator
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="monthly">
            <Card>
              <CardHeader>
                <CardTitle>Monthly P&L Statement</CardTitle>
                <CardDescription>
                  Detailed monthly breakdown of revenue and cost items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead className="text-right">GGR</TableHead>
                        <TableHead className="text-right">Bonus Cost</TableHead>
                        <TableHead className="text-right">Jackpot</TableHead>
                        <TableHead className="text-right">NGR</TableHead>
                        <TableHead className="text-right">Provider Fees</TableHead>
                        <TableHead className="text-right">Processing</TableHead>
                        <TableHead className="text-right">Platform</TableHead>
                        <TableHead className="text-right">Fixed Costs</TableHead>
                        <TableHead className="text-right">Total Costs</TableHead>
                        <TableHead className="text-right">Profit</TableHead>
                        <TableHead className="text-right">Margin</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pnlData.map((item, index) => {
                        const bonusCost = item.ggr - item.ngr;
                        const jackpot = 0; // Assuming no jackpot for this data
                        const fixedCosts = item.salaries + item.overheads;
                        const margin = ((item.pnl / item.ngr) * 100).toFixed(1);
                        
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.month}</TableCell>
                            <TableCell className="text-right">€{item.ggr.toLocaleString()}</TableCell>
                            <TableCell className="text-right">€{bonusCost.toLocaleString()}</TableCell>
                            <TableCell className="text-right">€{jackpot.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-medium">€{item.ngr.toLocaleString()}</TableCell>
                            <TableCell className="text-right">€{Math.abs(item.gameProviderFees).toLocaleString()}</TableCell>
                            <TableCell className="text-right">€{Math.abs(item.processingFees).toLocaleString()}</TableCell>
                            <TableCell className="text-right">€{Math.abs(item.platformFees).toLocaleString()}</TableCell>
                            <TableCell className="text-right">€{Math.abs(fixedCosts).toLocaleString()}</TableCell>
                            <TableCell className="text-right font-medium">€{Math.abs(item.totalCosts).toLocaleString()}</TableCell>
                            <TableCell className="text-right font-medium text-red-600">€{item.pnl.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <Badge className={
                                parseFloat(margin) > 0 ? "bg-green-100 text-green-800" : 
                                parseFloat(margin) > -10 ? "bg-yellow-100 text-yellow-800" : 
                                parseFloat(margin) > -20 ? "bg-orange-100 text-orange-800" : 
                                "bg-red-100 text-red-800"
                              }>
                                {margin}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cost-settings">
            <Card>
              <CardHeader>
                <CardTitle>Cost Calculation Settings</CardTitle>
                <CardDescription>
                  Configure how costs are calculated in the P&L statement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Game Provider Fees */}
                  <div className="space-y-3">
                    <h3 className="font-medium">Game Provider Fees</h3>
                    <div className="space-y-2">
                      <Label>Calculate Based On</Label>
                      <Select 
                        value={costSettings.gameProviderFees.basedOn} 
                        onValueChange={(value) => setCostSettings({
                          ...costSettings,
                          gameProviderFees: { ...costSettings.gameProviderFees, basedOn: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ggr">Gross Gaming Revenue (GGR)</SelectItem>
                          <SelectItem value="ngr">Net Gaming Revenue (NGR)</SelectItem>
                          <SelectItem value="bets">Total Bets</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Percentage (%)</Label>
                      </div>
                      <div className="flex items-center">
                        <Input 
                          type="number" 
                          value={costSettings.gameProviderFees.percentage}
                          onChange={(e) => setCostSettings({
                            ...costSettings,
                            gameProviderFees: { 
                              ...costSettings.gameProviderFees, 
                              percentage: parseFloat(e.target.value) 
                            }
                          })}
                          min={0}
                          max={100}
                          className="w-20 mr-2"
                        />
                        <span>%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Processing Fees */}
                  <div className="space-y-3">
                    <h3 className="font-medium">Processing Fees</h3>
                    <div className="space-y-2">
                      <Label>Calculate Based On</Label>
                      <Select 
                        value={costSettings.processingFees.basedOn} 
                        onValueChange={(value) => setCostSettings({
                          ...costSettings,
                          processingFees: { ...costSettings.processingFees, basedOn: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="deposits">Deposits</SelectItem>
                          <SelectItem value="withdrawals">Withdrawals</SelectItem>
                          <SelectItem value="transactions">All Transactions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Percentage (%)</Label>
                      </div>
                      <div className="flex items-center">
                        <Input 
                          type="number" 
                          value={costSettings.processingFees.percentage}
                          onChange={(e) => setCostSettings({
                            ...costSettings,
                            processingFees: { 
                              ...costSettings.processingFees, 
                              percentage: parseFloat(e.target.value) 
                            }
                          })}
                          min={0}
                          max={100}
                          className="w-20 mr-2"
                        />
                        <span>%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Platform Fees */}
                  <div className="space-y-3">
                    <h3 className="font-medium">Platform Fees</h3>
                    <div className="space-y-2">
                      <Label>Calculate Based On</Label>
                      <Select 
                        value={costSettings.platformFees.basedOn} 
                        onValueChange={(value) => setCostSettings({
                          ...costSettings,
                          platformFees: { ...costSettings.platformFees, basedOn: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ngr">Net Gaming Revenue (NGR)</SelectItem>
                          <SelectItem value="ggr">Gross Gaming Revenue (GGR)</SelectItem>
                          <SelectItem value="active_players">Active Players</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Percentage (%)</Label>
                      </div>
                      <div className="flex items-center">
                        <Input 
                          type="number" 
                          value={costSettings.platformFees.percentage}
                          onChange={(e) => setCostSettings({
                            ...costSettings,
                            platformFees: { 
                              ...costSettings.platformFees, 
                              percentage: parseFloat(e.target.value) 
                            }
                          })}
                          min={0}
                          max={100}
                          className="w-20 mr-2"
                        />
                        <span>%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Fixed Costs */}
                <div>
                  <h3 className="font-medium mb-3">Fixed Costs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Salaries (Fixed Amount)</Label>
                      <div className="flex items-center">
                        <span className="bg-gray-100 p-2 rounded-l-md border border-r-0">€</span>
                        <Input 
                          type="number" 
                          value={costSettings.fixedCosts.salaries}
                          onChange={(e) => setCostSettings({
                            ...costSettings,
                            fixedCosts: { 
                              ...costSettings.fixedCosts, 
                              salaries: parseInt(e.target.value) 
                            }
                          })}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Overheads (Fixed Amount)</Label>
                      <div className="flex items-center">
                        <span className="bg-gray-100 p-2 rounded-l-md border border-r-0">€</span>
                        <Input 
                          type="number" 
                          value={costSettings.fixedCosts.overheads}
                          onChange={(e) => setCostSettings({
                            ...costSettings,
                            fixedCosts: { 
                              ...costSettings.fixedCosts, 
                              overheads: parseInt(e.target.value) 
                            }
                          })}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Custom Costs */}
                <div>
                  <div className="flex justify-between mb-3">
                    <h3 className="font-medium">Custom Costs</h3>
                    <Button size="sm" variant="outline" onClick={addCustomCost}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Custom Cost
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {costSettings.customCosts.map((cost, index) => (
                      <div key={cost.id} className="bg-gray-50 p-4 rounded-md border">
                        <div className="flex justify-between items-center mb-3">
                          <div className="space-y-2 flex-1">
                            <Label>Cost Name</Label>
                            <Input 
                              value={cost.name}
                              onChange={(e) => updateCustomCost(cost.id, 'name', e.target.value)}
                              className="max-w-sm"
                            />
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeCustomCost(cost.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Cost Type</Label>
                            <Select 
                              value={cost.type} 
                              onValueChange={(value) => updateCustomCost(cost.id, 'type', value)}
                            >
                              <SelectTrigger className="max-w-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fixed">Fixed Amount</SelectItem>
                                <SelectItem value="percentage">Percentage</SelectItem>
                                <SelectItem value="per_player">Per Player</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {cost.type === 'percentage' && (
                            <div className="space-y-2">
                              <Label>Based On</Label>
                              <Select 
                                value={cost.basedOn || ''} 
                                onValueChange={(value) => updateCustomCost(cost.id, 'basedOn', value)}
                              >
                                <SelectTrigger className="max-w-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ngr">Net Gaming Revenue (NGR)</SelectItem>
                                  <SelectItem value="ggr">Gross Gaming Revenue (GGR)</SelectItem>
                                  <SelectItem value="deposits">Deposits</SelectItem>
                                  <SelectItem value="withdrawals">Withdrawals</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          
                          {cost.type === 'per_player' && (
                            <div className="space-y-2">
                              <Label>Based On</Label>
                              <Select 
                                value={cost.basedOn || ''} 
                                onValueChange={(value) => updateCustomCost(cost.id, 'basedOn', value)}
                              >
                                <SelectTrigger className="max-w-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active_players">Active Players</SelectItem>
                                  <SelectItem value="new_players">New Players</SelectItem>
                                  <SelectItem value="depositing_players">Depositing Players</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            <Label>
                              {cost.type === 'fixed' ? 'Amount' : 
                               cost.type === 'percentage' ? 'Percentage (%)' : 
                               'Amount per Player'}
                            </Label>
                            <div className="flex items-center">
                              {cost.type !== 'percentage' && <span className="bg-gray-100 p-2 rounded-l-md border border-r-0">€</span>}
                              <Input 
                                type="number" 
                                value={cost.amount}
                                onChange={(e) => updateCustomCost(cost.id, 'amount', parseFloat(e.target.value))}
                                className={cost.type !== 'percentage' ? "rounded-l-none max-w-xs" : "max-w-xs"}
                              />
                              {cost.type === 'percentage' && <span className="ml-2">%</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Alert Settings */}
                <div>
                  <h3 className="font-medium mb-3">Alert Settings</h3>
                  <div className="max-w-md space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="alert-threshold">Cost Alert Threshold (% of NGR)</Label>
                      <Badge variant="outline" className="font-mono">
                        {costSettings.alertThreshold}%
                      </Badge>
                    </div>
                    <Slider 
                      id="alert-threshold"
                      min={40} 
                      max={90} 
                      step={5}
                      value={[costSettings.alertThreshold]}
                      onValueChange={(value) => setCostSettings({
                        ...costSettings,
                        alertThreshold: value[0]
                      })}
                    />
                    <p className="text-xs text-gray-500">
                      Alert will be shown when costs exceed this percentage of NGR
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={saveSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="target-calculator">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-indigo-600" />
                    Target Calculator
                  </CardTitle>
                  <CardDescription>
                    Set financial targets and calculate required FTDs to achieve profitability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="target-ngr">Target NGR</Label>
                        <div className="flex items-center">
                          <span className="bg-gray-100 p-2 rounded-l-md border border-r-0">€</span>
                          <Input 
                            id="target-ngr"
                            type="number" 
                            value={targetNGR}
                            onChange={(e) => setTargetNGR(Number(e.target.value))}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="profit-margin">Target Profit Margin</Label>
                          <Badge variant="outline">{targetProfitMargin}%</Badge>
                        </div>
                        <Slider 
                          id="profit-margin"
                          min={-10}
                          max={30}
                          step={1}
                          value={[targetProfitMargin]}
                          onValueChange={(value) => setTargetProfitMargin(value[0])}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>-10%</span>
                          <span>0%</span>
                          <span>+30%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="timeframe">Timeframe (Months)</Label>
                        <Select 
                          value={timeframe.toString()} 
                          onValueChange={(value) => setTimeframe(parseInt(value))}
                        >
                          <SelectTrigger id="timeframe">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 Months</SelectItem>
                            <SelectItem value="6">6 Months</SelectItem>
                            <SelectItem value="9">9 Months</SelectItem>
                            <SelectItem value="12">12 Months</SelectItem>
                            <SelectItem value="18">18 Months</SelectItem>
                            <SelectItem value="24">24 Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="avg-deposit">Average First Deposit Value</Label>
                        <div className="flex items-center">
                          <span className="bg-gray-100 p-2 rounded-l-md border border-r-0">€</span>
                          <Input 
                            id="avg-deposit"
                            type="number" 
                            value={avgDepositValue}
                            onChange={(e) => setAvgDepositValue(Number(e.target.value))}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="acquisition-cost">Average Acquisition Cost (CPA)</Label>
                        <div className="flex items-center">
                          <span className="bg-gray-100 p-2 rounded-l-md border border-r-0">€</span>
                          <Input 
                            id="acquisition-cost"
                            type="number" 
                            value={acquisitionCost}
                            onChange={(e) => setAcquisitionCost(Number(e.target.value))}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="retention-rate">Player Retention Rate</Label>
                          <Badge variant="outline">{retentionRate}%</Badge>
                        </div>
                        <Slider 
                          id="retention-rate"
                          min={10}
                          max={60}
                          step={5}
                          value={[retentionRate]}
                          onValueChange={(value) => setRetentionRate(value[0])}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Poor (10%)</span>
                          <span>Good (35%)</span>
                          <span>Excellent (60%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 mt-4 border-t">
                    <Card className="bg-indigo-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-indigo-800">Target Profit</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-indigo-900">€{targetProfit.toLocaleString()}</div>
                        <p className="text-xs text-indigo-700 mt-1">Over {timeframe} months</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-purple-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-purple-800">Estimated Costs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-900">€{estimatedCosts.toLocaleString()}</div>
                        <p className="text-xs text-purple-700 mt-1">Based on target margin</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-amber-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-amber-800">Required FTDs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-amber-900">{requiredFTDs.toLocaleString()}</div>
                        <p className="text-xs text-amber-700 mt-1">{requiredFTDsPerMonth} per month</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-emerald-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-emerald-800">Acquisition Budget</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-emerald-900">€{acquisitionBudget.toLocaleString()}</div>
                        <p className="text-xs text-emerald-700 mt-1">€{acquisitionBudgetPerMonth.toLocaleString()} per month</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    Affiliate Capacity Planner
                  </CardTitle>
                  <CardDescription>
                    Allocate FTDs across affiliates to meet your target
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <h4 className="font-medium">Total Required FTDs: {requiredFTDs}</h4>
                        <p className="text-sm text-gray-500">
                          Currently allocated: {totalAllocatedFTDs} ({Math.round((totalAllocatedFTDs / requiredFTDs) * 100) || 0}%)
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={calculateOptimalAllocation}>
                          <Calculator className="h-4 w-4 mr-2" />
                          Calculate Optimal Allocation
                        </Button>
                      </div>
                    </div>
                    
                    {ftdGap > 0 && (
                      <Alert className="bg-amber-50 border-amber-200 mb-4">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800">
                          You still need to allocate {ftdGap} more FTDs to meet your target
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {ftdGap <= 0 && totalAllocatedFTDs > 0 && (
                      <Alert className="bg-green-50 border-green-200 mb-4">
                        <Check className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          Target allocation complete! You've allocated all {requiredFTDs} required FTDs
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Affiliate</TableHead>
                            <TableHead className="text-right">Current FTDs/mo</TableHead>
                            <TableHead className="text-right">Max Capacity</TableHead>
                            <TableHead className="text-right">CPA</TableHead>
                            <TableHead className="text-right">Avg FTD Value</TableHead>
                            <TableHead className="text-right">6-month LTV</TableHead>
                            <TableHead className="text-right">Allocated FTDs</TableHead>
                            <TableHead className="text-right">Est. Cost</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {affiliates.map((affiliate) => {
                            const isOverCapacity = affiliate.allocatedFTDs > affiliate.customMaxCapacity;
                            const estimatedCost = affiliate.allocatedFTDs * 
                              (affiliate.allocatedFTDs > affiliate.ftds_monthly ? 
                                affiliate.customExpectedCPA : affiliate.cpa);
                                
                            return (
                              <TableRow key={affiliate.id}>
                                <TableCell className="font-medium">{affiliate.name}</TableCell>
                                <TableCell className="text-right">{affiliate.ftds_monthly}</TableCell>
                                <TableCell className="text-right">{affiliate.customMaxCapacity}</TableCell>
                                <TableCell className="text-right">€{affiliate.cpa}</TableCell>
                                <TableCell className="text-right">€{affiliate.avg_ftd_value}</TableCell>
                                <TableCell className="text-right">€{affiliate.ltv_6month}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end">
                                    <Input
                                      type="number"
                                      value={affiliate.allocatedFTDs}
                                      onChange={(e) => updateAffiliateAllocation(
                                        affiliate.id, e.target.value
                                      )}
                                      min={0}
                                      max={9999}
                                      className={`w-20 text-right ${isOverCapacity ? 'border-orange-500' : ''}`}
                                    />
                                  </div>
                                  {isOverCapacity && (
                                    <p className="text-xs text-orange-600 mt-1">
                                      Over capacity
                                    </p>
                                  )}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  €{estimatedCost.toLocaleString()}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Cost Summary</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Total Acquisition Cost:</span>
                            <span className="font-medium">€{acquisitionBudget.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Acquisition Cost per FTD:</span>
                            <span className="font-medium">€{
                              totalAllocatedFTDs > 0 ?
                              Math.round(acquisitionBudget / totalAllocatedFTDs) :
                              0
                            }</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Estimated FTD Value:</span>
                            <span className="font-medium">€{(totalAllocatedFTDs * avgDepositValue).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Target Progress</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">FTDs Allocation:</span>
                            <span className="font-medium">{totalAllocatedFTDs} / {requiredFTDs}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Allocation Percentage:</span>
                            <span className="font-medium">{Math.round((totalAllocatedFTDs / requiredFTDs) * 100) || 0}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Gap to Target:</span>
                            <span className={`font-medium ${ftdGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {ftdGap > 0 ? ftdGap : 'Complete'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Revenue Potential</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Est. Monthly NGR:</span>
                            <span className="font-medium">€{Math.round(totalAllocatedFTDs * avgDepositValue * (1 + retentionRate/100) / timeframe).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Est. {timeframe}-month NGR:</span>
                            <span className="font-medium">€{Math.round(totalAllocatedFTDs * avgDepositValue * (1 + retentionRate/100)).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">NGR/CPA Ratio:</span>
                            <span className={`font-medium ${(totalAllocatedFTDs * avgDepositValue * (1 + retentionRate/100)) / acquisitionBudget > 1.5 ? 'text-green-600' : 'text-amber-600'}`}>
                              {acquisitionBudget > 0 ? 
                                ((totalAllocatedFTDs * avgDepositValue * (1 + retentionRate/100)) / acquisitionBudget).toFixed(2) : 
                                'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}