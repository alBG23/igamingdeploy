import React from 'react';
import { AlertTriangle, XCircle, Info, ChevronRight } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function AlertsPanel({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="h-[280px] flex items-center justify-center text-gray-500">
        No active alerts
      </div>
    );
  }
  
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-100';
      case 'warning':
        return 'bg-amber-50 border-amber-100';
      case 'info':
        return 'bg-blue-50 border-blue-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };
  
  return (
    <ScrollArea className="h-[280px] pr-3">
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow ${getSeverityClass(alert.severity)}`}
          >
            <div className="flex items-start gap-3">
              <div className="pt-0.5">
                {getSeverityIcon(alert.severity)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {alert.time}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {alert.description}
                </p>
                <p className="text-xs font-medium text-gray-700 mt-2">
                  {alert.impact}
                </p>
                
                <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end">
                  <span className="text-xs text-blue-600 flex items-center">
                    View details <ChevronRight className="h-3 w-3 ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}