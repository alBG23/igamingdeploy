import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock, Info, Eye, MessageSquare } from 'lucide-react';

export default function AlertHistory({ history }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);
  
  const filteredHistory = history.filter(alert => {
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || alert.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  const formatValue = (value, metric) => {
    if (metric === 'ggr' || metric === 'ngr' || metric.includes('deposit') || metric.includes('withdrawal')) {
      return `$${value.toLocaleString()}`;
    }
    if (metric === 'conversion_rate' || metric === 'churn_rate') {
      return `${value}%`;
    }
    return value.toLocaleString();
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'new': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'acknowledged': return <Eye className="h-5 w-5 text-blue-500" />;
      case 'resolved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'false_positive': return <Info className="h-5 w-5 text-gray-500" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'bg-amber-100 text-amber-800';
      case 'acknowledged': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'false_positive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const viewAlertDetails = (alert) => {
    setSelectedAlert(alert);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="false_positive">False Positive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <ScrollArea className="h-[500px]">
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No alerts match your current filters.
            </div>
          ) : (
            filteredHistory.map((alert) => (
              <Card key={alert.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(alert.status)}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getPriorityColor(alert.priority)}>
                            {alert.priority}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                        
                        <h3 className="font-medium text-gray-900">{alert.message}</h3>
                        
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {formatTimestamp(alert.timestamp)}
                        </div>
                        
                        <div className="mt-3 text-sm">
                          <span className="text-gray-600">Current value: </span>
                          <span className="font-medium">{formatValue(alert.actual_value, alert.metric)}</span>
                          {alert.previous_value && (
                            <>
                              <span className="text-gray-600"> (previous: </span>
                              <span className="font-medium">{formatValue(alert.previous_value, alert.metric)}</span>
                              <span className="text-gray-600">)</span>
                            </>
                          )}
                        </div>
                        
                        {alert.affected_entities && Object.keys(alert.affected_entities).length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {Object.entries(alert.affected_entities).map(([key, values]) => (
                              values.map((value, idx) => (
                                <Badge key={`${key}-${idx}`} variant="outline" className="text-xs">
                                  {key.replace(/_/g, ' ')}: {value}
                                </Badge>
                              ))
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => viewAlertDetails(alert)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
      
      <Dialog open={!!selectedAlert} onOpenChange={(open) => !open && setSelectedAlert(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Alert Details</DialogTitle>
            <DialogDescription>
              Complete information about this alert
            </DialogDescription>
          </DialogHeader>
          
          {selectedAlert && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6 p-1">
                <div className="flex items-start gap-3">
                  {getStatusIcon(selectedAlert.status)}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getPriorityColor(selectedAlert.priority)}>
                        {selectedAlert.priority}
                      </Badge>
                      <Badge className={getStatusColor(selectedAlert.status)}>
                        {selectedAlert.status}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-lg">{selectedAlert.message}</h3>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Timestamp</p>
                      <p className="font-medium">{formatTimestamp(selectedAlert.timestamp)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Metric</p>
                      <p className="font-medium">{selectedAlert.metric.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-gray-500">Condition</p>
                      <p className="font-medium">{selectedAlert.condition.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Threshold</p>
                      <p className="font-medium">{selectedAlert.threshold}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-gray-500">Current Value</p>
                      <p className="font-medium">{formatValue(selectedAlert.actual_value, selectedAlert.metric)}</p>
                    </div>
                    {selectedAlert.previous_value && (
                      <div>
                        <p className="text-sm text-gray-500">Previous Value</p>
                        <p className="font-medium">{formatValue(selectedAlert.previous_value, selectedAlert.metric)}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedAlert.notification_sent && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Notifications Sent To:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedAlert.notification_channels.map(channel => (
                        <Badge key={channel} variant="secondary">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedAlert.acknowledged_by && (
                  <div>
                    <p className="text-sm text-gray-500">Acknowledged By</p>
                    <p className="font-medium">{selectedAlert.acknowledged_by}</p>
                  </div>
                )}
                
                {selectedAlert.resolved_by && (
                  <div>
                    <p className="text-sm text-gray-500">Resolved By</p>
                    <p className="font-medium">{selectedAlert.resolved_by}</p>
                  </div>
                )}
                
                {selectedAlert.resolution_note && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500 flex items-center mb-1">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Resolution Note
                    </p>
                    <p>{selectedAlert.resolution_note}</p>
                  </div>
                )}
                
                {selectedAlert.affected_entities && Object.keys(selectedAlert.affected_entities).length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Affected Entities:</p>
                    <div className="bg-gray-50 p-3 rounded-md">
                      {Object.entries(selectedAlert.affected_entities).map(([key, values]) => (
                        <div key={key} className="mb-2 last:mb-0">
                          <p className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {values.map((value, idx) => (
                              <Badge key={idx} variant="outline">
                                {value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          
          <DialogFooter>
            {selectedAlert && selectedAlert.status === 'new' && (
              <Button variant="outline">
                Acknowledge
              </Button>
            )}
            {selectedAlert && (selectedAlert.status === 'new' || selectedAlert.status === 'acknowledged') && (
              <Button>
                Mark as Resolved
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}