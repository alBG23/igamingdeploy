import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, ArrowDownRight, ArrowUpRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function LiveTransactionsFeed({ transactions = [], isLoading = false, height = 400 }) {
  const getTransactionIcon = (type) => {
    switch(type) {
      case 'deposit':
        return <ArrowDownRight className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-amber-500" />;
      case 'bet':
        return <CreditCard className="h-4 w-4 text-blue-500" />;
      case 'win':
        return <CheckCircle className="h-4 w-4 text-indigo-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const formatAmount = (amount, type) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
    
    if (type === 'deposit' || type === 'win') {
      return <span className="text-green-600 font-medium">{formatted}</span>;
    } else if (type === 'withdrawal' || type === 'bet') {
      return <span className="text-red-600 font-medium">{formatted}</span>;
    }
    
    return <span className="font-medium">{formatted}</span>;
  };
  
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const txTime = new Date(timestamp);
    const diffSeconds = Math.floor((now - txTime) / 1000);
    
    if (diffSeconds < 60) {
      return `${diffSeconds}s ago`;
    } else if (diffSeconds < 3600) {
      return `${Math.floor(diffSeconds / 60)}m ago`;
    } else if (diffSeconds < 86400) {
      return `${Math.floor(diffSeconds / 3600)}h ago`;
    } else {
      return `${Math.floor(diffSeconds / 86400)}d ago`;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Live Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="px-6 pb-6 space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="px-6 pb-6">
              {transactions.length === 0 ? (
                <div className="flex items-center justify-center h-[350px] text-gray-500">
                  No transactions to display
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((tx, index) => (
                    <div key={tx.id || index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="mt-1">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900 truncate">
                              {tx.playerId} ({tx.country})
                            </p>
                            <div className="flex items-center mt-1">
                              <Badge variant="secondary" className="mr-2 text-xs">
                                {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                              </Badge>
                              {tx.game && <span className="text-xs text-gray-500">{tx.game}</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            {formatAmount(tx.amount, tx.type)}
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTimeAgo(tx.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-xs text-gray-500">
                            {tx.paymentMethod && `via ${tx.paymentMethod}`}
                          </div>
                          <div>
                            {getStatusBadge(tx.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}