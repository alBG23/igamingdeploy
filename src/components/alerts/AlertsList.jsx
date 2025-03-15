import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Edit, 
  Trash2, 
  Bell, 
  Clock, 
  Power, 
  PowerOff, 
  AlertTriangle, 
  Check, 
  Percent
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AlertsList({ alerts, onEdit, onDelete, onToggleStatus }) {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Critical</Badge>;
      case 'high':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getMetricDisplay = (metric) => {
    const metricMap = {
      'deposits': 'Deposits',
      'withdrawals': 'Withdrawals',
      'ggr': 'GGR',
      'ngr': 'NGR',
      'player_activity': 'Player Activity',
      'conversion_rate': 'Conversion Rate',
      'ftd_count': 'First Time Depositors',
      'churn_rate': 'Churn Rate',
      'bonus_usage': 'Bonus Usage',
      'fraud_risk': 'Fraud Risk'
    };
    return metricMap[metric] || metric;
  };

  const getConditionDisplay = (condition, threshold, isPercentage) => {
    const conditionMap = {
      'above': `> ${threshold}${isPercentage ? '%' : ''}`,
      'below': `< ${threshold}${isPercentage ? '%' : ''}`,
      'increase_by': `↑ ${threshold}${isPercentage ? '%' : ''}`,
      'decrease_by': `↓ ${threshold}${isPercentage ? '%' : ''}`,
      'equal_to': `= ${threshold}${isPercentage ? '%' : ''}`
    };
    return conditionMap[condition] || condition;
  };

  const getTimeWindowDisplay = (window) => {
    const windowMap = {
      '5min': '5 Minutes',
      '15min': '15 Minutes',
      '30min': '30 Minutes',
      '1hour': '1 Hour',
      '3hours': '3 Hours',
      '6hours': '6 Hours',
      '12hours': '12 Hours',
      '24hours': '24 Hours'
    };
    return windowMap[window] || window;
  };

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else if (status === 'paused') {
      return <Badge variant="outline">Paused</Badge>;
    } else {
      return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Metric</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Time Window</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.name}</TableCell>
                    <TableCell>{getMetricDisplay(alert.metric)}</TableCell>
                    <TableCell>{getConditionDisplay(alert.condition, alert.threshold, alert.percentage)}</TableCell>
                    <TableCell>{getTimeWindowDisplay(alert.timeWindow)}</TableCell>
                    <TableCell>{getPriorityBadge(alert.priority)}</TableCell>
                    <TableCell>{getStatusBadge(alert.status)}</TableCell>
                    <TableCell className="text-sm text-gray-500">{formatDate(alert.created_date)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className={alert.status === 'active' ? 'text-green-600' : 'text-gray-400'}
                          onClick={() => onToggleStatus(alert.id, alert.status)}
                        >
                          {alert.status === 'active' ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onEdit(alert)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => onDelete(alert.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span>Confirm Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    No alerts configured yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}