import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from 'lucide-react';

export default function PaymentAnalytics({ data, filters, onFilterChange }) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [declineReasonsData, setDeclineReasonsData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    // Simulate fetching data from SoftSwiss replica
    setIsLoading(true);
    
    setTimeout(() => {
      // This would be replaced with actual data from your SoftSwiss replica
      // The schema would match replica_views.payment_methods and replica_views.transactions
      
      // Sample payment method data from replica_views.payment_methods
      setPaymentMethodData([
        { name: 'Credit Card', success: 88, failed: 12, total_volume: 156200 },
        { name: 'PayPal', success: 94, failed: 6, total_volume: 89400 },
        { name: 'Skrill', success: 92, failed: 8, total_volume: 67800 },
        { name: 'Neteller', success: 90, failed: 10, total_volume: 52300 },
        { name: 'Bank Transfer', success: 86, failed: 14, total_volume: 41500 }
      ]);
      
      // Sample decline reasons data
      setDeclineReasonsData([
        { name: 'Card Blocked', value: 38, count: 156 },
        { name: '3D Secure Failure', value: 27, count: 111 },
        { name: 'Fraud Suspicion', value: 16, count: 66 },
        { name: 'Insufficient Funds', value: 14, count: 58 },
        { name: 'Technical Error', value: 5, count: 21 }
      ]);
      
      // Sample transactions from replica_views.transactions
      setRecentTransactions([
        { id: 'TX789012', player_id: 'player123', method: 'Visa', amount: 200, status: 'success', created_at: '2024-01-20T14:23:15Z', country: 'UK' },
        { id: 'TX789013', player_id: 'player456', method: 'PayPal', amount: 150, status: 'success', created_at: '2024-01-20T13:45:22Z', country: 'DE' },
        { id: 'TX789014', player_id: 'player789', method: 'Mastercard', amount: 75, status: 'failed', created_at: '2024-01-19T22:12:48Z', reason: 'Card Blocked', country: 'FR' },
        { id: 'TX789015', player_id: 'player321', method: 'Skrill', amount: 300, status: 'success', created_at: '2024-01-19T18:36:05Z', country: 'ES' },
        { id: 'TX789016', player_id: 'player654', method: 'Mastercard', amount: 125, status: 'failed', created_at: '2024-01-18T15:52:31Z', reason: '3D Secure Failure', country: 'IT' }
      ]);
      
      setIsLoading(false);
    }, 1200);
  }, [filters]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <Select 
          value={filters.country} 
          onValueChange={(value) => onFilterChange('country', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="de">Germany</SelectItem>
            <SelectItem value="fr">France</SelectItem>
            <SelectItem value="es">Spain</SelectItem>
            <SelectItem value="it">Italy</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={filters.paymentSystem} 
          onValueChange={(value) => onFilterChange('paymentSystem', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Payment system" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="cards">Credit Cards</SelectItem>
            <SelectItem value="ewallet">E-Wallets</SelectItem>
            <SelectItem value="bank">Bank Transfers</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Payment Success Rate by Method</span>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={paymentMethodData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value, name, props) => {
                        if (name === 'total_volume') return [`$${value.toLocaleString()}`, 'Total Volume'];
                        return [`${value}%`, name === 'success' ? 'Success Rate' : 'Failure Rate'];
                      }} />
                      <Legend />
                      <Bar dataKey="success" name="Success %" stackId="a" fill="#10B981" />
                      <Bar dataKey="failed" name="Failed %" stackId="a" fill="#F43F5E" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Decline Reasons</span>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={declineReasonsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {declineReasonsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => {
                          const entry = declineReasonsData.find(d => d.value === value);
                          return [`${value}% (${entry?.count || 0} transactions)`, name];
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Recent Transactions</span>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{tx.id}</TableCell>
                      <TableCell>{tx.player_id}</TableCell>
                      <TableCell>{tx.method}</TableCell>
                      <TableCell>${tx.amount}</TableCell>
                      <TableCell>{formatDate(tx.created_at)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            tx.status === 'success'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{tx.country}</TableCell>
                      <TableCell>
                        {tx.reason ? tx.reason : '-'}
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