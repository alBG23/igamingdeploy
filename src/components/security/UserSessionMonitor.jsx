import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Ban, 
  Globe, 
  Monitor, 
  RefreshCw, 
  Shield, 
  Smartphone,
  CornerRightDown,
  Terminal, 
  Lock
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { UserSession } from '@/api/entities';

export default function UserSessionMonitor() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadSessions();
  }, []);
  
  const loadSessions = async () => {
    setIsLoading(true);
    try {
      // This would be a real API call in production
      // const data = await UserSession.list();
      
      // Simulated data for development
      const mockSessions = [
        {
          id: 'sess_1',
          user_id: 'user_123',
          user_name: 'Alice Johnson',
          user_email: 'alice@example.com',
          ip_address: '192.168.1.1',
          location: { country: 'United States', city: 'San Francisco', latitude: 37.7749, longitude: -122.4194 },
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          device_type: 'desktop',
          login_time: new Date(Date.now() - 3600000).toISOString(),
          last_activity: new Date().toISOString(),
          is_vpn: false,
          status: 'active',
          risk_score: 10,
          risk_factors: [],
          role: 'admin'
        },
        {
          id: 'sess_2',
          user_id: 'user_123',
          user_name: 'Alice Johnson',
          user_email: 'alice@example.com',
          ip_address: '203.0.113.1',
          location: { country: 'Canada', city: 'Toronto', latitude: 43.6532, longitude: -79.3832 },
          user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
          device_type: 'mobile',
          login_time: new Date(Date.now() - 7200000).toISOString(),
          last_activity: new Date(Date.now() - 1800000).toISOString(),
          is_vpn: false,
          status: 'active',
          risk_score: 45,
          risk_factors: ['Different location than usual'],
          role: 'admin'
        },
        {
          id: 'sess_3',
          user_id: 'user_456',
          user_name: 'Bob Smith',
          user_email: 'bob@example.com',
          ip_address: '198.51.100.1',
          location: { country: 'UK', city: 'London', latitude: 51.5074, longitude: -0.1278 },
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          device_type: 'desktop',
          login_time: new Date(Date.now() - 1800000).toISOString(),
          last_activity: new Date().toISOString(),
          is_vpn: true,
          status: 'suspicious',
          risk_score: 75,
          risk_factors: ['VPN detected', 'Unusual login time', 'Multiple failed attempts'],
          role: 'analyst'
        },
        {
          id: 'sess_4',
          user_id: 'user_789',
          user_name: 'Charlie Davis',
          user_email: 'charlie@example.com',
          ip_address: '203.0.113.5',
          location: { country: 'Germany', city: 'Berlin', latitude: 52.5200, longitude: 13.4050 },
          user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          device_type: 'desktop',
          login_time: new Date(Date.now() - 3600000).toISOString(),
          last_activity: new Date(Date.now() - 300000).toISOString(),
          is_vpn: false,
          status: 'active',
          risk_score: 5,
          risk_factors: [],
          role: 'client'
        },
        {
          id: 'sess_5',
          user_id: 'user_789',
          user_name: 'Charlie Davis',
          user_email: 'charlie@example.com',
          ip_address: '203.0.113.6',
          location: { country: 'Germany', city: 'Munich', latitude: 48.1351, longitude: 11.5820 },
          user_agent: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X)',
          device_type: 'tablet',
          login_time: new Date(Date.now() - 86400000).toISOString(),
          last_activity: new Date(Date.now() - 43200000).toISOString(),
          is_vpn: false,
          status: 'expired',
          risk_score: 15,
          risk_factors: [],
          role: 'client'
        },
      ];
      
      setSessions(mockSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
    setIsLoading(false);
  };
  
  const terminateSession = (sessionId) => {
    setSessions(sessions.map(session => 
      session.id === sessionId ? {...session, status: 'terminated'} : session
    ));
  };
  
  const getRiskBadge = (score) => {
    if (score >= 70) return <Badge className="bg-red-100 text-red-800">High Risk</Badge>;
    if (score >= 40) return <Badge className="bg-amber-100 text-amber-800">Medium Risk</Badge>;
    return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>;
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'suspicious':
        return <Badge className="bg-amber-100 text-amber-800">Suspicious</Badge>;
      case 'terminated':
        return <Badge className="bg-red-100 text-red-800">Terminated</Badge>;
      case 'expired':
        return <Badge variant="outline">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };
  
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };
  
  const getTimeSince = (dateString) => {
    const ms = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(ms / 60000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User Sessions</CardTitle>
          <CardDescription>Monitor active logins and concurrent seat usage</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadSessions}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Card className="flex-1">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-500">Concurrent Sessions</div>
                        <div className="text-2xl font-bold">
                          {sessions.filter(s => s.status === 'active').length} / 5
                        </div>
                      </div>
                      <Shield className="h-8 w-8 text-indigo-500" />
                    </div>
                    <Progress 
                      value={(sessions.filter(s => s.status === 'active').length / 5) * 100} 
                      className="h-2 mt-2" 
                    />
                  </CardContent>
                </Card>
                
                <Card className="flex-1">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-500">Suspicious Logins</div>
                        <div className="text-2xl font-bold">
                          {sessions.filter(s => s.status === 'suspicious').length}
                        </div>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-amber-500" />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {sessions.filter(s => s.status === 'suspicious').length > 0 ? 
                        'Action required: Suspicious activity detected' : 
                        'No suspicious activity detected'}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="flex-1">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-500">Login Countries</div>
                        <div className="text-2xl font-bold">
                          {new Set(sessions.map(s => s.location.country)).size}
                        </div>
                      </div>
                      <Globe className="h-8 w-8 text-indigo-500" />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {Array.from(new Set(sessions.map(s => s.location.country))).join(', ')}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Device / Location</TableHead>
                  <TableHead>Login Time</TableHead>
                  <TableHead className="hidden md:table-cell">IP Address</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map(session => (
                  <TableRow key={session.id} className={session.status === 'suspicious' ? 'bg-amber-50' : ''}>
                    <TableCell>
                      <div className="font-medium">{session.user_name}</div>
                      <div className="text-xs text-gray-500">{session.user_email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 mb-1">
                        {getDeviceIcon(session.device_type)}
                        <span className="text-sm">{session.device_type}</span>
                        {session.is_vpn && (
                          <Badge variant="outline" className="text-xs">VPN</Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {session.location.city}, {session.location.country}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{getTimeSince(session.login_time)}</div>
                      <div className="text-xs text-gray-500">
                        Last active: {getTimeSince(session.last_activity)}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="font-mono text-xs">{session.ip_address}</div>
                    </TableCell>
                    <TableCell>
                      {getRiskBadge(session.risk_score)}
                      {session.risk_factors.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {session.risk_factors[0]}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(session.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      {session.status === 'active' || session.status === 'suspicious' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => terminateSession(session.id)}
                          className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          <span>Terminate</span>
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled
                          className="h-8 px-2 text-gray-400"
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          <span>Terminate</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
}