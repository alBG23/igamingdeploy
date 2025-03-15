import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, TrendingDown, TrendingUp, FileText, Clock, Zap, Search, Filter } from 'lucide-react';

export default function AnomalyDetectionEngine({ anomalies = [], onInvestigate }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'investigating': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'false_positive': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getTrendIcon = (deviation) => {
    if (deviation > 0) {
      return <TrendingUp className="h-4 w-4 text-red-600" />;
    } else {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
  };
  
  const formatTimeSince = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return `${diffMins}m ago`;
    }
  };
  
  // Filter anomalies based on selected filters
  const filteredAnomalies = anomalies.filter(anomaly => {
    const matchesStatus = statusFilter === 'all' || anomaly.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || anomaly.severity === severityFilter;
    return matchesStatus && matchesSeverity;
  });
  
  // Sample anomaly data in case no anomalies are provided
  const sampleAnomalies = [
    {
      id: 1,
      metric: 'Deposit Success Rate',
      brand: 'Main Casino',
      date: '2023-06-18T14:30:00Z',
      severity: 'high',
      value: 78,
      expected_value: 92,
      deviation_percentage: -15.2,
      status: 'investigating',
      analysis: 'Significant drop in Visa deposit success rates specifically from UK players. Could be related to recent payment gateway API changes or regulatory issues.',
      affected_segments: ['UK Players', 'Visa Payments']
    },
    {
      id: 2,
      metric: 'New Player Registration',
      brand: 'Main Casino',
      date: '2023-06-19T10:15:00Z',
      severity: 'medium',
      value: 165,
      expected_value: 120,
      deviation_percentage: 37.5,
      status: 'new',
      analysis: 'Unexpected spike in new registrations primarily from paid social campaigns. Potential attribution issue or highly successful new campaign.',
      affected_segments: ['New Players', 'Facebook Source']
    },
    {
      id: 3,
      metric: 'Average Session Duration',
      brand: 'Main Casino',
      date: '2023-06-17T22:45:00Z',
      severity: 'low',
      value: 24,
      expected_value: 32,
      deviation_percentage: -25,
      status: 'resolved',
      analysis: 'Decreased session times coincided with technical issues in the slot games section. Issue has been resolved and metrics are returning to normal.',
      affected_segments: ['Slot Players', 'Mobile App']
    }
  ];
  
  // Use sample data if no anomalies provided
  const displayAnomalies = anomalies.length > 0 ? filteredAnomalies : sampleAnomalies;
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Anomaly Detection
            </CardTitle>
            <CardDescription>
              AI-powered detection of unusual patterns in your player and business metrics
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors">
              <Search className="h-3 w-3 mr-1" />
              <span className="text-gray-800">Status:</span>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="ml-1 border-none bg-transparent text-xs focus:outline-none focus:ring-0 p-0"
              >
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="false_positive">False Positive</option>
              </select>
            </div>
            <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors">
              <Filter className="h-3 w-3 mr-1" />
              <span className="text-gray-800">Severity:</span>
              <select 
                value={severityFilter} 
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="ml-1 border-none bg-transparent text-xs focus:outline-none focus:ring-0 p-0"
              >
                <option value="all">All</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current">
          <TabsList className="mb-4">
            <TabsTrigger value="current">
              Current Issues
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved
            </TabsTrigger>
            <TabsTrigger value="all">
              All Anomalies
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="mt-0">
            {displayAnomalies.filter(a => a.status !== 'resolved' && a.status !== 'false_positive').length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No active anomalies detected
              </div>
            ) : (
              <div className="space-y-4">
                {displayAnomalies
                  .filter(a => a.status !== 'resolved' && a.status !== 'false_positive')
                  .map((anomaly) => (
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
                              {anomaly.status.replace('_', ' ')}
                            </Badge>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTimeSince(anomaly.date)}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900">{anomaly.metric}</h3>
                          <p className="text-sm text-gray-600 mt-1">{anomaly.analysis}</p>
                          
                          {anomaly.affected_segments && anomaly.affected_segments.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {anomaly.affected_segments.map((segment, i) => (
                                <Badge key={i} variant="outline" className="bg-gray-50">
                                  {segment}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-gray-500 mb-1">{anomaly.metric}</span>
                          <span className="text-xl font-bold text-red-600 flex items-center">
                            {getTrendIcon(anomaly.deviation_percentage)}
                            {Math.abs(anomaly.deviation_percentage).toFixed(1)}%
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {anomaly.value} vs. expected {anomaly.expected_value}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4 pt-2 border-t text-sm">
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="bg-gray-50 text-gray-700">
                            {anomaly.brand}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8">
                            <FileText className="h-3.5 w-3.5 mr-1" />
                            Details
                          </Button>
                          <Button size="sm" className="h-8 bg-amber-600 hover:bg-amber-700">
                            <Zap className="h-3.5 w-3.5 mr-1" />
                            Investigate
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="resolved" className="mt-0">
            {displayAnomalies.filter(a => a.status === 'resolved' || a.status === 'false_positive').length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No resolved anomalies
              </div>
            ) : (
              <div className="space-y-4">
                {displayAnomalies
                  .filter(a => a.status === 'resolved' || a.status === 'false_positive')
                  .map((anomaly) => (
                    <div 
                      key={anomaly.id} 
                      className="p-4 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getSeverityColor(anomaly.severity)}>
                              {anomaly.severity}
                            </Badge>
                            <Badge className={getStatusColor(anomaly.status)}>
                              {anomaly.status.replace('_', ' ')}
                            </Badge>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTimeSince(anomaly.date)}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900">{anomaly.metric}</h3>
                          <p className="text-sm text-gray-600 mt-1">{anomaly.analysis}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-gray-500 mb-1">{anomaly.metric}</span>
                          <span className="text-xl font-bold text-gray-500 flex items-center">
                            {getTrendIcon(anomaly.deviation_percentage)}
                            {Math.abs(anomaly.deviation_percentage).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4 pt-2 border-t text-sm">
                        <span className="text-gray-500">Resolved on June 19, 2023</span>
                        <Button size="sm" variant="outline" className="h-8">
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          View Report
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="mt-0">
            {displayAnomalies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No anomalies found
              </div>
            ) : (
              <div className="space-y-4">
                {displayAnomalies.map((anomaly) => (
                  <div 
                    key={anomaly.id} 
                    className={`p-4 border rounded-lg ${
                      anomaly.status === 'resolved' || anomaly.status === 'false_positive' 
                        ? 'bg-gray-50' 
                        : 'hover:shadow-md transition-shadow'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getSeverityColor(anomaly.severity)}>
                            {anomaly.severity}
                          </Badge>
                          <Badge className={getStatusColor(anomaly.status)}>
                            {anomaly.status.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimeSince(anomaly.date)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900">{anomaly.metric}</h3>
                        <p className="text-sm text-gray-600 mt-1">{anomaly.analysis}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-gray-500 mb-1">{anomaly.metric}</span>
                        <span className={`text-xl font-bold flex items-center ${
                          anomaly.status === 'resolved' || anomaly.status === 'false_positive'
                            ? 'text-gray-500'
                            : 'text-red-600'
                        }`}>
                          {getTrendIcon(anomaly.deviation_percentage)}
                          {Math.abs(anomaly.deviation_percentage).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-2 border-t text-sm">
                      <span className="text-gray-500">{anomaly.brand}</span>
                      <Button size="sm" variant="outline" className="h-8">
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}