import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CloudIcon, 
  Database, 
  HardDrive, 
  Settings, 
  CheckCircle, 
  Shield, 
  Loader2, 
  AlertTriangle,
  FileText
} from 'lucide-react';

export default function AzureDataLakeConnector() {
  const [connectionType, setConnectionType] = useState('direct');
  const [connectionStatus, setConnectionStatus] = useState('idle'); // idle, connecting, success, error
  const [advancedOptions, setAdvancedOptions] = useState(false);
  
  const [formData, setFormData] = useState({
    connectionString: '',
    accountName: '',
    containerName: '',
    filePath: '',
    useManagedIdentity: false,
    fileFormat: 'parquet',
    refreshFrequency: 'daily',
    enableDataPreview: true,
    mappingEnabled: true
  });
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleConnect = () => {
    setConnectionStatus('connecting');
    
    // Simulating connection attempt
    setTimeout(() => {
      if (formData.connectionString || (formData.accountName && formData.containerName)) {
        setConnectionStatus('success');
        // In a real app, here we would establish the actual connection
        // and store the connection details securely
      } else {
        setConnectionStatus('error');
      }
    }, 2000);
  };
  
  const renderStatusMessage = () => {
    switch (connectionStatus) {
      case 'connecting':
        return (
          <Alert className="bg-blue-50 border-blue-200 mt-4">
            <Loader2 className="h-4 w-4 text-blue-600 animate-spin mr-2" />
            <AlertDescription className="text-blue-700">
              Establishing connection to Azure Data Lake Storage...
            </AlertDescription>
          </Alert>
        );
      case 'success':
        return (
          <Alert className="bg-green-50 border-green-200 mt-4">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            <AlertDescription className="text-green-700">
              Successfully connected to Azure Data Lake Storage. Your data is now available for analysis.
            </AlertDescription>
          </Alert>
        );
      case 'error':
        return (
          <Alert className="bg-red-50 border-red-200 mt-4">
            <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
            <AlertDescription className="text-red-700">
              Connection failed. Please check your credentials and try again.
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CloudIcon className="mr-2 h-5 w-5 text-blue-600" />
          Azure Data Lake Connection
        </CardTitle>
        <CardDescription>
          Connect directly to your Azure Data Lake Storage to import and analyze your data
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs value={connectionType} onValueChange={setConnectionType}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="direct">
              <Database className="h-4 w-4 mr-2" />
              Direct Connection
            </TabsTrigger>
            <TabsTrigger value="oauth">
              <Shield className="h-4 w-4 mr-2" />
              OAuth Authentication
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="direct" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="connectionString">Azure Storage Connection String (optional)</Label>
                <Input 
                  id="connectionString" 
                  type="password" 
                  placeholder="DefaultEndpointsProtocol=https;AccountName=youraccount;AccountKey=your-key;EndpointSuffix=core.windows.net"
                  value={formData.connectionString}
                  onChange={(e) => handleInputChange('connectionString', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Alternatively, you can provide the account details separately below.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountName">Storage Account Name</Label>
                  <Input 
                    id="accountName" 
                    placeholder="yourstorageaccount"
                    value={formData.accountName}
                    onChange={(e) => handleInputChange('accountName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="containerName">Container Name</Label>
                  <Input 
                    id="containerName" 
                    placeholder="your-container"
                    value={formData.containerName}
                    onChange={(e) => handleInputChange('containerName', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="filePath">File Path Pattern</Label>
                <Input 
                  id="filePath" 
                  placeholder="data/gaming/*.parquet"
                  value={formData.filePath}
                  onChange={(e) => handleInputChange('filePath', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Specify path to your data files. Wildcards (*) are supported.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="useManagedIdentity"
                  checked={formData.useManagedIdentity}
                  onCheckedChange={(checked) => handleInputChange('useManagedIdentity', checked)}
                />
                <Label htmlFor="useManagedIdentity">Use Managed Identity (recommended for Azure deployments)</Label>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="oauth" className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Shield className="h-4 w-4 text-blue-600 mr-2" />
              <AlertDescription className="text-blue-700">
                OAuth authentication provides the most secure way to connect to Azure Data Lake without storing credentials.
              </AlertDescription>
            </Alert>
            
            <Button className="w-full" onClick={() => alert("This would redirect to Azure OAuth login in a real implementation")}>
              <CloudIcon className="mr-2 h-4 w-4" />
              Sign in with Microsoft Azure
            </Button>
          </TabsContent>
        </Tabs>
        
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setAdvancedOptions(!advancedOptions)}
            type="button"
          >
            <Settings className="mr-2 h-4 w-4" />
            {advancedOptions ? 'Hide' : 'Show'} Advanced Options
          </Button>
          
          <Badge variant="outline">
            <FileText className="mr-1 h-3 w-3" />
            File Format: {formData.fileFormat}
          </Badge>
        </div>
        
        {advancedOptions && (
          <div className="space-y-4 pt-2">
            <Separator />
            <h3 className="text-sm font-medium">Advanced Connection Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fileFormat">File Format</Label>
                <select 
                  id="fileFormat"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  value={formData.fileFormat}
                  onChange={(e) => handleInputChange('fileFormat', e.target.value)}
                >
                  <option value="parquet">Parquet</option>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                  <option value="delta">Delta Lake</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="refreshFrequency">Refresh Frequency</Label>
                <select 
                  id="refreshFrequency"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  value={formData.refreshFrequency}
                  onChange={(e) => handleInputChange('refreshFrequency', e.target.value)}
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="manual">Manual Only</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="enableDataPreview"
                  checked={formData.enableDataPreview}
                  onCheckedChange={(checked) => handleInputChange('enableDataPreview', checked)}
                />
                <Label htmlFor="enableDataPreview">Enable Data Preview</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="mappingEnabled"
                  checked={formData.mappingEnabled}
                  onCheckedChange={(checked) => handleInputChange('mappingEnabled', checked)}
                />
                <Label htmlFor="mappingEnabled">Auto-map Fields to Analytics Schema</Label>
              </div>
            </div>
          </div>
        )}
        
        {renderStatusMessage()}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => {
          setFormData({
            connectionString: '',
            accountName: '',
            containerName: '',
            filePath: '',
            useManagedIdentity: false,
            fileFormat: 'parquet',
            refreshFrequency: 'daily',
            enableDataPreview: true,
            mappingEnabled: true
          });
          setConnectionStatus('idle');
        }}>
          Reset
        </Button>
        
        <Button 
          onClick={handleConnect}
          disabled={connectionStatus === 'connecting'}
          className="min-w-[120px]"
        >
          {connectionStatus === 'connecting' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect'}
        </Button>
      </CardFooter>
    </Card>
  );
}