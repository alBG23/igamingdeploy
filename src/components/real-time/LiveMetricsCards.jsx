import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, BadgeDollarSign, Coins, Gamepad2, Zap } from 'lucide-react';

export default function LiveMetricsCards({ metrics, isLoading = false }) {
  const {
    activeUsers = 0,
    activeGames = 0,
    depositRate = 0,
    wagerRate = 0,
    currentGGR = 0,
    transactionsPerMinute = 0
  } = metrics || {};
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 flex justify-between items-center">
          {isLoading ? (
            <div className="w-full space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-500 flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  Active Players
                </p>
                <p className="text-2xl font-bold">{activeUsers.toLocaleString()}</p>
                <Badge 
                  variant="outline" 
                  className="mt-1 bg-green-50 text-green-700 border-green-200"
                >
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  5% last hour
                </Badge>
              </div>
              <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8" />
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex justify-between items-center">
          {isLoading ? (
            <div className="w-full space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-500 flex items-center">
                  <Zap className="mr-1 h-4 w-4" />
                  Transactions / Min
                </p>
                <p className="text-2xl font-bold">{transactionsPerMinute.toLocaleString()}</p>
                <Badge 
                  variant="outline" 
                  className="mt-1 bg-green-50 text-green-700 border-green-200"
                >
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  8% last hour
                </Badge>
              </div>
              <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8" />
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex justify-between items-center">
          {isLoading ? (
            <div className="w-full space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-500 flex items-center">
                  <Gamepad2 className="mr-1 h-4 w-4" />
                  Active Games
                </p>
                <p className="text-2xl font-bold">{activeGames.toLocaleString()}</p>
                <Badge 
                  variant="outline" 
                  className="mt-1 bg-red-50 text-red-700 border-red-200"
                >
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                  2% last hour
                </Badge>
              </div>
              <div className="h-16 w-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                <Gamepad2 className="h-8 w-8" />
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex justify-between items-center">
          {isLoading ? (
            <div className="w-full space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-500 flex items-center">
                  <DollarSign className="mr-1 h-4 w-4" />
                  Deposit Rate / Min
                </p>
                <p className="text-2xl font-bold">{formatCurrency(depositRate)}</p>
                <Badge 
                  variant="outline" 
                  className="mt-1 bg-green-50 text-green-700 border-green-200"
                >
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  12% last hour
                </Badge>
              </div>
              <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <DollarSign className="h-8 w-8" />
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex justify-between items-center">
          {isLoading ? (
            <div className="w-full space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-500 flex items-center">
                  <Coins className="mr-1 h-4 w-4" />
                  Wager Rate / Min
                </p>
                <p className="text-2xl font-bold">{formatCurrency(wagerRate)}</p>
                <Badge 
                  variant="outline" 
                  className="mt-1 bg-green-50 text-green-700 border-green-200"
                >
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  7% last hour
                </Badge>
              </div>
              <div className="h-16 w-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                <Coins className="h-8 w-8" />
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex justify-between items-center">
          {isLoading ? (
            <div className="w-full space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-500 flex items-center">
                  <BadgeDollarSign className="mr-1 h-4 w-4" />
                  Current GGR / Min
                </p>
                <p className="text-2xl font-bold">{formatCurrency(currentGGR)}</p>
                <Badge 
                  variant="outline" 
                  className="mt-1 bg-green-50 text-green-700 border-green-200"
                >
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  15% last hour
                </Badge>
              </div>
              <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <BadgeDollarSign className="h-8 w-8" />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}