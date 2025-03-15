
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lock, FileJson, Database, Shield, Server, HardDrive, InfoIcon } from 'lucide-react';

import SecureDataImport from '../components/utils/SecureDataImport';

export default function DataImport() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Import</h1>
          <p className="text-gray-500 mt-1">
            Securely import your gaming data into the analytics platform
          </p>
        </div>
        
        <Alert className="bg-amber-50 border-amber-200">
          <InfoIcon className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-700">Connection Information</AlertTitle>
          <AlertDescription className="text-amber-600">
            <p className="mb-2">Even with a paid plan, direct database connections from browser applications have security limitations:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Browser security restrictions prevent direct database connections</li>
              <li>Database credentials cannot be safely stored in client-side applications</li>
              <li>Use our secure file import or API connectors for enterprise integrations</li>
            </ul>
            <p className="mt-2">For direct database integrations, please contact us to discuss our enterprise API solutions.</p>
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="secure">
          <TabsList className="mb-4">
            <TabsTrigger value="secure" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Secure Import
            </TabsTrigger>
            <TabsTrigger value="connector" className="flex items-center gap-1">
              <Server className="h-4 w-4" />
              Platform Connectors
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center gap-1">
              <HardDrive className="h-4 w-4" />
              Data Sources
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="secure" className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Lock className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-700">Privacy First</AlertTitle>
              <AlertDescription className="text-blue-600">
                This secure import option processes your data entirely on your device.
                No credentials or raw data are ever sent to our servers.
              </AlertDescription>
            </Alert>
            
            <SecureDataImport />
          </TabsContent>
          
          <TabsContent value="connector" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Connectors</CardTitle>
                <CardDescription>
                  Connect directly to your gaming platform with secure API integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm">
                    For enterprise customers, we offer secure API connectors to major gaming platforms:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h3 className="font-medium">SoftSwiss</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Direct API integration with encrypted credential storage
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h3 className="font-medium">EveryMatrix</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Secure ETL pipeline with real-time data sync
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h3 className="font-medium">BetConstruct</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Dedicated connector with access token authentication
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h3 className="font-medium">Soft2Bet</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        VPN tunnel connection with mutual TLS authentication
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-gray-500">
                      Contact your account manager to set up platform connectors for automated data imports.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="help" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Preparation Guide</CardTitle>
                <CardDescription>
                  How to export and format your data for analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="font-medium">Recommended Data Structure</h3>
                  <p className="text-sm">
                    For best results, prepare your data in the following categories:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <FileJson className="h-5 w-5 text-blue-600 mb-2" />
                      <h4 className="font-medium">Player Data</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Registration date, geo, acquisition source, device type
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <FileJson className="h-5 w-5 text-purple-600 mb-2" />
                      <h4 className="font-medium">Transaction Data</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Deposits, withdrawals, payment methods, amounts, timestamps
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <FileJson className="h-5 w-5 text-green-600 mb-2" />
                      <h4 className="font-medium">Gaming Activity</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Game sessions, bets, wins, game types, bonus usage
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Sample JSON Format</h3>
                    <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">
{`{
  "players": [
    {
      "id": "p12345",
      "registration_date": "2023-01-15",
      "country": "DE",
      "acquisition_source": "organic",
      "device": "mobile"
    }
  ],
  "transactions": [
    {
      "player_id": "p12345",
      "type": "deposit",
      "amount": 50,
      "currency": "EUR",
      "payment_method": "visa",
      "timestamp": "2023-01-15T14:23:45Z"
    }
  ],
  "gaming_sessions": [
    {
      "player_id": "p12345",
      "game_id": "slot123",
      "start_time": "2023-01-15T15:30:00Z",
      "end_time": "2023-01-15T16:45:00Z",
      "bets_total": 120,
      "wins_total": 135
    }
  ]
}`}
                    </pre>
                  </div>
                  
                  <Alert>
                    <Database className="h-4 w-4" />
                    <AlertTitle>Data Privacy</AlertTitle>
                    <AlertDescription>
                      You can anonymize sensitive data before import. Replace actual player IDs, emails, 
                      and personally identifiable information with pseudonyms while maintaining relational integrity.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
