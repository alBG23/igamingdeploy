import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  AlertTriangle, 
  ArrowUpRight, 
  Calendar, 
  Filter, 
  HelpCircle, 
  Info, 
  MessageSquare, 
  Mails,
  Gift,
  Download,
  Users,
  UserCheck,
  UserX
} from 'lucide-react';

export default function PlayerChurnPredictor() {
  const [timeframe, setTimeframe] = useState('30d');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedView, setSelectedView] = useState('risk');
  
  // Sample data for churn prediction
  const churnRiskData = [
    { 
      id: 'player-001', 
      name: 'Alexander Smith', 
      churnRisk: 82, 
      ltvPredicted: 240, 
      inactiveFor: 14, 
      lastDeposit: '2023-06-04',
      tags: ['high-roller', 'mobile-user'],
      reasonCodes: ['decreased-activity', 'loss-streak', 'ignored-bonus'],
      recommendedActions: ['personalized-bonus', 'reactivation-campaign', 'direct-contact']
    },
    { 
      id: 'player-002', 
      name: 'Jessica Brown', 
      churnRisk: 75, 
      ltvPredicted: 380, 
      inactiveFor: 8, 
      lastDeposit: '2023-06-10',
      tags: ['high-roller', 'slots-preferred'],
      reasonCodes: ['failed-deposit', 'lack-of-engagement', 'withdrawal-delay'],
      recommendedActions: ['payment-options-review', 'game-recommendations', 'win-boost']
    },
    { 
      id: 'player-003', 
      name: 'Michael Davis', 
      churnRisk: 68, 
      ltvPredicted: 210, 
      inactiveFor: 12, 
      lastDeposit: '2023-06-06',
      tags: ['weekend-player', 'sports-betting'],
      reasonCodes: ['decreased-activity', 'lower-bet-amounts', 'bet-loss-ratio'],
      recommendedActions: ['sports-specific-bonus', 'event-notification', 'cashback-offer']
    },
    { 
      id: 'player-004', 
      name: 'Emma Wilson', 
      churnRisk: 91, 
      ltvPredicted: 420, 
      inactiveFor: 18, 
      lastDeposit: '2023-05-31',
      tags: ['vip', 'table-games'],
      reasonCodes: ['communication-unsubscribe', 'withdrawal-pattern', 'time-since-login'],
      recommendedActions: ['vip-manager-call', 'personal-offer', 'deposit-match']
    },
    { 
      id: 'player-005', 
      name: 'Robert Johnson', 
      churnRisk: 42, 
      ltvPredicted: 180, 
      inactiveFor: 5, 
      lastDeposit: '2023-06-13',
      tags: ['new-player', 'bonus-hunter'],
      reasonCodes: ['wagering-completion', 'bonus-expiration', 'small-deposits'],
      recommendedActions: ['early-wagering-reward', 'long-term-loyalty', 'game-education']
    }
  ];
  
  // Sample data for churn factors
  const churnFactorsData = [
    { factor: 'Inactive Period > 14 days', importance: 85 },
    { factor: 'Recent Loss Streak', importance: 78 },
    { factor: 'Decreasing Deposit Frequency', importance: 72 },
    { factor: 'Decreasing Bet Size', importance: 65 },
    { factor: 'Ignored Promotions', importance: 58 },
    { factor: 'Withdrawal Pattern', importance: 52 },
    { factor: 'Customer Service Contacts', importance: 48 },
    { factor: 'Time of Day Change', importance: 32 }
  ];
  
  // Sample historical churn data
  const churnTrendData = [
    { month: 'Jan', churnRate: 4.2, newPlayers: 1250, churnedPlayers: 420 },
    { month: 'Feb', churnRate: 4.8, newPlayers: 1180, churnedPlayers: 460 },
    { month: 'Mar', churnRate: 5.1, newPlayers: 1320, churnedPlayers: 510 },
    { month: 'Apr', churnRate: 4.5, newPlayers: 1410, churnedPlayers: 480 },
    { month: 'May', churnRate: 3.9, newPlayers: 1520, churnedPlayers: 450 },
    { month: 'Jun', churnRate: 3.6, newPlayers: 1480, churnedPlayers: 420 }
  ];
  
  // Filter player data based on risk level
  const filteredPlayerData = riskFilter === 'all' 
    ? churnRiskData 
    : riskFilter === 'high' 
      ? churnRiskData.filter(player => player.churnRisk >= 70)
      : riskFilter === 'medium'
        ? churnRiskData.filter(player => player.churnRisk >= 40 && player.churnRisk < 70)
        : churnRiskData.filter(player => player.churnRisk < 40);
  
  // Get risk color
  const getRiskColor = (risk) => {
    if (risk >= 70) return 'text-red-600';
    if (risk >= 40) return 'text-amber-600';
    return 'text-green-600';
  };
  
  // Get risk badge
  const getRiskBadge = (risk) => {
    if (risk >= 70) {
      return <Badge className="bg-red-100 text-red-800 border-red-200">High Risk</Badge>;
    }
    if (risk >= 40) {
      return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Medium Risk</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800 border-green-200">Low Risk</Badge>;
  };
  
  // COLORS for pie chart
  const COLORS = ['#ef4444', '#f97316', '#10b981', '#3b82f6', '#8b5cf6'];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Player Churn Prediction
            </CardTitle>
            <CardDescription>
              AI-powered churn risk detection and prevention
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
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
        <Tabs defaultValue="players">
          <TabsList className="mb-4">
            <TabsTrigger value="players">
              <Users className="h-4 w-4 mr-2" />
              At-Risk Players
            </TabsTrigger>
            <TabsTrigger value="factors">
              <Info className="h-4 w-4 mr-2" />
              Churn Factors
            </TabsTrigger>
            <TabsTrigger value="trends">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Trends
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="players" className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="high">High Risk (70%+)</SelectItem>
                    <SelectItem value="medium">Medium Risk (40-69%)</SelectItem>
                    <SelectItem value="low">Low Risk (<40%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className={selectedView === 'risk' ? 'bg-indigo-50' : ''} onClick={() => setSelectedView('risk')}>
                  Risk Score
                </Button>
                <Button variant="outline" size="sm" className={selectedView === 'ltv' ? 'bg-indigo-50' : ''} onClick={() => setSelectedView('ltv')}>
                  Potential LTV Impact
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserX className="h-5 w-5 text-red-500" />
                      <p className="text-sm text-gray-500">High Risk Players</p>
                    </div>
                    <div className="text-xl font-bold">32</div>
                  </div>
                  <div className="text-xs text-red-600 mt-1">
                    Potential LTV at risk: $12,840
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-amber-500" />
                      <p className="text-sm text-gray-500">Medium Risk Players</p>
                    </div>
                    <div className="text-xl font-bold">68</div>
                  </div>
                  <div className="text-xs text-amber-600 mt-1">
                    Potential LTV at risk: $18,360
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-green-500" />
                      <p className="text-sm text-gray-500">30-Day Retention</p>
                    </div>
                    <div className="text-xl font-bold">74.2%</div>
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    +1.8% compared to previous month
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">At-Risk Player List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead>Churn Risk</TableHead>
                        <TableHead>Predicted LTV</TableHead>
                        <TableHead>Inactive For</TableHead>
                        <TableHead>Last Deposit</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPlayerData.map((player) => (
                        <TableRow key={player.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                  {player.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{player.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className={`font-medium ${getRiskColor(player.churnRisk)}`}>
                                {player.churnRisk}%
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                {getRiskBadge(player.churnRisk)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>${player.ltvPredicted}</TableCell>
                          <TableCell>{player.inactiveFor} days</TableCell>
                          <TableCell>{player.lastDeposit}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {player.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" title="Send message">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Send email">
                                <Mails className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Send bonus">
                                <Gift className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Player Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Very High (80-100%)', value: 18 },
                          { name: 'High (60-79%)', value: 24 },
                          { name: 'Medium (40-59%)', value: 42 },
                          { name: 'Low (20-39%)', value: 75 },
                          { name: 'Very Low (0-19%)', value: 140 }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {[...Array(5)].map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Players']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Risk Factors for Selected Player</CardTitle>
                  <Select defaultValue={churnRiskData[0].id} disabled={false}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Select player" />
                    </SelectTrigger>
                    <SelectContent>
                      {churnRiskData.map(player => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name} ({player.churnRisk}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 border rounded-md">
                    <h3 className="text-sm font-medium mb-1">Risk Factors</h3>
                    <ul className="space-y-1 text-sm">
                      {churnRiskData[0].reasonCodes.map(reason => (
                        <li key={reason} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 mt-0.5 text-red-500" />
                          <span>{reason.replace(/-/g, ' ')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                    <h3 className="text-sm font-medium text-blue-800 mb-1">Recommended Actions</h3>
                    <ul className="space-y-1 text-sm text-blue-700">
                      {churnRiskData[0].recommendedActions.map(action => (
                        <li key={action} className="flex items-start gap-2">
                          <Info className="h-4 w-4 mt-0.5 text-blue-500" />
                          <span>{action.replace(/-/g, ' ')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                    <h3 className="text-sm font-medium text-green-800 mb-1">Retention Impact</h3>
                    <div className="text-green-700 text-sm">
                      <p className="mb-2">Expected retention probability if action taken:</p>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                              +48% Improvement
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-green-600">
                              72%
                            </span>
                          </div>
                        </div>
                        <div className="h-2 flex rounded bg-green-200">
                          <div className="w-[72%] bg-green-600 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Player Risk Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="factors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Churn Factors & Importance</CardTitle>
                <CardDescription>
                  Factors that predict player churn based on our AI model
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      layout="vertical"
                      data={churnFactorsData}
                      margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} label={{ value: 'Relative Importance (%)', position: 'insideBottom', offset: -5 }} />
                      <YAxis type="category" dataKey="factor" width={150} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Importance']} />
                      <Bar dataKey="importance" fill="#ef4444" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 border rounded-md bg-amber-50">
                    <h3 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Early Warning Signs
                    </h3>
                    <p className="text-sm text-amber-700 mb-4">
                      The AI model has identified these key behavioral changes that often precede player churn:
                    </p>
                    <ul className="space-y-2 text-sm text-amber-800">
                      <li className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-amber-800 text-xs">1</span>
                        </div>
                        <span>
                          <strong>Session frequency drop:</strong> When a player's login frequency drops by more than 50% compared 
                          to their established pattern, there's an 82% correlation with upcoming churn.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-amber-800 text-xs">2</span>
                        </div>
                        <span>
                          <strong>Bet size reduction:</strong> A consistent pattern of decreasing bet sizes (>30% reduction) 
                          over 5+ sessions indicates potential disengagement and precedes churn in 68% of cases.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-amber-800 text-xs">3</span>
                        </div>
                        <span>
                          <strong>Ignored communications:</strong> Players who stop opening emails/notifications 
                          have a 3.2x higher likelihood of churning within 30 days.
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-md bg-blue-50">
                    <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Model Information
                    </h3>
                    <p className="text-sm text-blue-700 mb-4">
                      Our churn prediction system uses a sophisticated machine learning approach:
                    </p>
                    <div className="space-y-3 text-sm text-blue-800">
                      <div>
                        <div className="font-medium">Model Type:</div>
                        <div>Gradient Boosted Decision Trees (XGBoost)</div>
                      </div>
                      <div>
                        <div className="font-medium">Training Data:</div>
                        <div>3.8 million player sessions, 420,000 players</div>
                      </div>
                      <div>
                        <div className="font-medium">Prediction Accuracy:</div>
                        <div>87% accuracy in identifying high-risk players</div>
                      </div>
                      <div>
                        <div className="font-medium">Update Frequency:</div>
                        <div>Model retrains weekly with fresh behavioral data</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Churn Rate Trends</CardTitle>
                <CardDescription>
                  Historical player churn and retention metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={churnTrendData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="churnRate" 
                        name="Churn Rate (%)" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="newPlayers" 
                        name="New Players" 
                        stroke="#3b82f6" 
                        strokeWidth={2} 
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="churnedPlayers" 
                        name="Churned Players" 
                        stroke="#f97316" 
                        strokeWidth={2} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium mb-2">Churn by Acquisition Source</h3>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { source: 'Organic', rate: 3.2 },
                              { source: 'Paid Search', rate: 4.5 },
                              { source: 'Affiliates', rate: 6.8 },
                              { source: 'Social', rate: 5.3 }
                            ]}
                            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                          >
                            <XAxis dataKey="source" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value}%`, 'Churn Rate']} />
                            <Bar dataKey="rate" fill="#ef4444" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium mb-2">Churn by Player Segment</h3>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { segment: 'Casual', rate: 7.8 },
                              { segment: 'Regular', rate: 4.2 },
                              { segment: 'VIP', rate: 2.4 },
                              { segment: 'New', rate: 9.6 }
                            ]}
                            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                          >
                            <XAxis dataKey="segment" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value}%`, 'Churn Rate']} />
                            <Bar dataKey="rate" fill="#8b5cf6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium mb-2">Churn by Game Preference</h3>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { game: 'Slots', rate: 4.7 },
                              { game: 'Table Games', rate: 3.8 },
                              { game: 'Live Casino', rate: 2.9 },
                              { game: 'Sports', rate: 5.4 }
                            ]}
                            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                          >
                            <XAxis dataKey="game" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value}%`, 'Churn Rate']} />
                            <Bar dataKey="rate" fill="#10b981" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="p-4 mt-6 border rounded-md bg-indigo-50">
                  <h3 className="font-medium text-indigo-800 mb-2">Churn Analysis & Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-700">
                    <div>
                      <h4 className="font-medium mb-2">Recent Improvements</h4>
                      <p>
                        Overall churn rate has decreased from 5.1% to 3.6% over the past 
                        quarter. Key improvements have been made in retention of VIP players 
                        (down 1.2%) and Live Casino players (down 1.8%).
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Focus Areas</h4>
                      <ul className="space-y-1 list-disc pl-4">
                        <li>New player onboarding (9.6% churn)</li>
                        <li>Affiliate-acquired players (6.8% churn)</li>
                        <li>Sports betting players (5.4% churn)</li>
                      </ul>
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