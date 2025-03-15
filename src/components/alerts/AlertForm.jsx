import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, X, Plus } from 'lucide-react';

export default function AlertForm({ alert, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: alert?.name || '',
    description: alert?.description || '',
    metric: alert?.metric || 'deposits',
    condition: alert?.condition || 'above',
    threshold: alert?.threshold || 0,
    percentage: alert?.percentage || false,
    timeWindow: alert?.timeWindow || '1hour',
    comparisonPeriod: alert?.comparisonPeriod || 'previous_period',
    notificationChannels: alert?.notificationChannels || ['dashboard'],
    notificationEmails: alert?.notificationEmails || [],
    priority: alert?.priority || 'medium',
    cooldownMinutes: alert?.cooldownMinutes || 60,
    filters: alert?.filters || { geos: [], source: [], affiliate: [], game: [] }
  });
  
  const [newEmail, setNewEmail] = useState('');
  
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const toggleNotificationChannel = (channel) => {
    setFormData(prev => {
      const channels = [...prev.notificationChannels];
      if (channels.includes(channel)) {
        return {
          ...prev,
          notificationChannels: channels.filter(c => c !== channel)
        };
      } else {
        return {
          ...prev,
          notificationChannels: [...channels, channel]
        };
      }
    });
  };
  
  const addEmail = () => {
    if (newEmail && newEmail.includes('@') && !formData.notificationEmails.includes(newEmail)) {
      setFormData(prev => ({
        ...prev,
        notificationEmails: [...prev.notificationEmails, newEmail]
      }));
      setNewEmail('');
    }
  };
  
  const removeEmail = (email) => {
    setFormData(prev => ({
      ...prev,
      notificationEmails: prev.notificationEmails.filter(e => e !== email)
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Alert Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Name your alert"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe what this alert monitors"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="metric">Metric to Monitor</Label>
            <Select
              value={formData.metric}
              onValueChange={(value) => handleChange('metric', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deposits">Deposits</SelectItem>
                <SelectItem value="withdrawals">Withdrawals</SelectItem>
                <SelectItem value="ggr">GGR</SelectItem>
                <SelectItem value="ngr">NGR</SelectItem>
                <SelectItem value="player_activity">Player Activity</SelectItem>
                <SelectItem value="conversion_rate">Conversion Rate</SelectItem>
                <SelectItem value="ftd_count">First Time Depositors</SelectItem>
                <SelectItem value="churn_rate">Churn Rate</SelectItem>
                <SelectItem value="bonus_usage">Bonus Usage</SelectItem>
                <SelectItem value="fraud_risk">Fraud Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="condition">Condition</Label>
            <Select
              value={formData.condition}
              onValueChange={(value) => handleChange('condition', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Above Threshold</SelectItem>
                <SelectItem value="below">Below Threshold</SelectItem>
                <SelectItem value="increase_by">Increases By</SelectItem>
                <SelectItem value="decrease_by">Decreases By</SelectItem>
                <SelectItem value="equal_to">Equal To</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="threshold">Threshold</Label>
            <div className="flex items-center gap-2">
              <Input
                id="threshold"
                type="number"
                value={formData.threshold}
                onChange={(e) => handleChange('threshold', parseFloat(e.target.value))}
                required
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="percentage"
                  checked={formData.percentage}
                  onCheckedChange={(checked) => handleChange('percentage', checked)}
                />
                <Label
                  htmlFor="percentage"
                  className="text-sm font-normal cursor-pointer"
                >
                  %
                </Label>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="timeWindow">Time Window</Label>
            <Select
              value={formData.timeWindow}
              onValueChange={(value) => handleChange('timeWindow', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time window" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5min">5 Minutes</SelectItem>
                <SelectItem value="15min">15 Minutes</SelectItem>
                <SelectItem value="30min">30 Minutes</SelectItem>
                <SelectItem value="1hour">1 Hour</SelectItem>
                <SelectItem value="3hours">3 Hours</SelectItem>
                <SelectItem value="6hours">6 Hours</SelectItem>
                <SelectItem value="12hours">12 Hours</SelectItem>
                <SelectItem value="24hours">24 Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="comparisonPeriod">Comparison Period</Label>
            <Select
              value={formData.comparisonPeriod}
              onValueChange={(value) => handleChange('comparisonPeriod', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select comparison" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="previous_period">Previous Period</SelectItem>
                <SelectItem value="same_period_yesterday">Same Period Yesterday</SelectItem>
                <SelectItem value="same_period_last_week">Same Period Last Week</SelectItem>
                <SelectItem value="same_period_last_month">Same Period Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label className="block mb-2">Notification Channels</Label>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify-dashboard"
                checked={formData.notificationChannels.includes('dashboard')}
                onCheckedChange={() => toggleNotificationChannel('dashboard')}
              />
              <Label
                htmlFor="notify-dashboard"
                className="text-sm font-normal cursor-pointer"
              >
                Dashboard
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify-email"
                checked={formData.notificationChannels.includes('email')}
                onCheckedChange={() => toggleNotificationChannel('email')}
              />
              <Label
                htmlFor="notify-email"
                className="text-sm font-normal cursor-pointer"
              >
                Email
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify-sms"
                checked={formData.notificationChannels.includes('sms')}
                onCheckedChange={() => toggleNotificationChannel('sms')}
              />
              <Label
                htmlFor="notify-sms"
                className="text-sm font-normal cursor-pointer"
              >
                SMS
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify-slack"
                checked={formData.notificationChannels.includes('slack')}
                onCheckedChange={() => toggleNotificationChannel('slack')}
              />
              <Label
                htmlFor="notify-slack"
                className="text-sm font-normal cursor-pointer"
              >
                Slack
              </Label>
            </div>
          </div>
        </div>
        
        {formData.notificationChannels.includes('email') && (
          <div>
            <Label>Email Recipients</Label>
            <div className="flex mt-1 mb-2">
              <Input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Add email address"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={addEmail} 
                className="ml-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.notificationEmails.map(email => (
                <Badge 
                  key={email}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {email}
                  <button 
                    type="button"
                    onClick={() => removeEmail(email)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {formData.notificationEmails.length === 0 && (
                <span className="text-sm text-gray-500">No recipients added</span>
              )}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleChange('priority', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="cooldownMinutes">Alert Cooldown (minutes)</Label>
            <Input
              id="cooldownMinutes"
              type="number"
              min="0"
              value={formData.cooldownMinutes}
              onChange={(e) => handleChange('cooldownMinutes', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {alert ? 'Update Alert' : 'Create Alert'}
        </Button>
      </div>
    </form>
  );
}