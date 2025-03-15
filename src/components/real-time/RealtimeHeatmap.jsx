import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, DollarSign, Gamepad2, Users } from 'lucide-react';

export default function RealtimeHeatmap({ data = [], isLoading = false, title = "Activity Heatmap" }) {
  const [view, setView] = React.useState('activity');
  
  // Get unique days and hours for heatmap
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from(new Set(data.map(item => item.hour))).sort();
  
  // Find max value for scaling
  const maxValue = data.length ? Math.max(...data.map(d => d.value)) : 100;
  
  const getColor = (value) => {
    if (!value) return 'bg-gray-100';
    
    // Create gradient from light blue to dark blue
    const intensity = Math.min(Math.floor((value / maxValue) * 10), 9);
    
    const colorMap = {
      0: 'bg-indigo-50 text-indigo-700',
      1: 'bg-indigo-100 text-indigo-700',
      2: 'bg-indigo-200 text-indigo-700',
      3: 'bg-indigo-300 text-indigo-800',
      4: 'bg-indigo-400 text-indigo-50',
      5: 'bg-indigo-500 text-white',
      6: 'bg-indigo-600 text-white',
      7: 'bg-indigo-700 text-white',
      8: 'bg-indigo-800 text-white',
      9: 'bg-indigo-900 text-white',
    };
    
    if (view === 'revenue') {
      // Green gradient for revenue
      return colorMap[intensity].replace(/indigo/g, 'green');
    } else if (view === 'deposits') {
      // Blue gradient for deposits
      return colorMap[intensity].replace(/indigo/g, 'blue');
    }
    
    return colorMap[intensity];
  };
  
  const getCellData = (day, hour) => {
    const cell = data.find(d => d.day === day && d.hour === hour);
    return cell || { value: 0, day, hour };
  };
  
  const formatValue = (value) => {
    if (view === 'revenue') {
      return `$${value}`;
    } else if (view === 'deposits') {
      return value;
    }
    return value;
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>
              Real-time distribution pattern by hour and day
            </CardDescription>
          </div>
          
          <Tabs value={view} onValueChange={setView} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="activity" className="text-xs">
                <Users className="h-3.5 w-3.5 mr-1" />
                Players
              </TabsTrigger>
              <TabsTrigger value="deposits" className="text-xs">
                <Gamepad2 className="h-3.5 w-3.5 mr-1" />
                Games
              </TabsTrigger>
              <TabsTrigger value="revenue" className="text-xs">
                <DollarSign className="h-3.5 w-3.5 mr-1" />
                Revenue
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-[auto_repeat(7,_1fr)] gap-1">
                {/* Header row with days */}
                <div className="h-6"></div>
                {days.map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                
                {/* Hour rows */}
                {hours.map(hour => (
                  <React.Fragment key={hour}>
                    <div className="text-xs font-medium text-gray-500 text-right pr-2">
                      {hour}
                    </div>
                    {days.map(day => {
                      const cellData = getCellData(day, hour);
                      return (
                        <div 
                          key={`${day}-${hour}`} 
                          className={`aspect-square flex items-center justify-center text-xs font-medium rounded ${getColor(cellData.value)}`}
                          title={`${day} ${hour}: ${formatValue(cellData.value)}`}
                        >
                          {cellData.value > 0 ? formatValue(cellData.value) : ''}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-3 bg-indigo-100 rounded"></div>
                  <span className="text-xs text-gray-500">Low</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-3 bg-indigo-300 rounded"></div>
                  <span className="text-xs text-gray-500">Medium</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-3 bg-indigo-500 rounded"></div>
                  <span className="text-xs text-gray-500">High</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-3 bg-indigo-700 rounded"></div>
                  <span className="text-xs text-gray-500">Very High</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-3 bg-indigo-900 rounded"></div>
                  <span className="text-xs text-gray-500">Peak</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}