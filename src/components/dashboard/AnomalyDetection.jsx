import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, TrendingDown, ChevronRight } from 'lucide-react';

export default function AnomalyDetection({ anomalies }) {
  // Sample anomalies data
  const sampleAnomalies = [
    {
      id: 1,
      severity: 'high',
      title: 'Deposit Drop - UK Players',
      description: '31% drop in UK deposits via paid social in last 24 hours',
      metric: 'Deposit Volume',
      value: '-31%',
      status: 'investigating'
    },
    {
      id: 2,
      severity: 'medium',
      title: 'Unusual Churn Spike',
      description: '15% increase in player churn rate from Germany',
      metric: 'Churn Rate',
      value: '+15%',
      status: 'new'
    },
    {
      id: 3,
      severity: 'low',
      title: 'Payment Failure Rate Increase',
      description: 'Visa payment failures increased 8% above normal levels',
      metric: 'Payment Failures',
      value: '+8%',
      status: 'monitoring'
    }
  ];
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'investigating': return 'bg-amber-100 text-amber-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'monitoring': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Anomaly Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {sampleAnomalies.map((anomaly) => (
              <div 
                key={anomaly.id} 
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getSeverityColor(anomaly.severity)}>
                        {anomaly.severity} severity
                      </Badge>
                      <Badge className={getStatusColor(anomaly.status)}>
                        {anomaly.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900">{anomaly.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{anomaly.description}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-500">{anomaly.metric}</span>
                    <span className="text-xl font-bold text-red-600 flex items-center">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      {anomaly.value}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-2 border-t text-sm">
                  <span className="text-gray-500">Detected 2 hours ago</span>
                  <button className="flex items-center text-indigo-600 hover:text-indigo-800">
                    View Details <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}