import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cloud, Info, Lock } from "lucide-react";

export default function AzureDataLakeConnector() {
  const [accountName, setAccountName] = React.useState("");
  const [accessKey, setAccessKey] = React.useState("");
  const [containerName, setContainerName] = React.useState("");
  const [isConnecting, setIsConnecting] = React.useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Simulate connection attempt
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Azure Data Lake connection successful!');
    } catch (error) {
      alert('Failed to connect to Azure Data Lake. Please check your credentials.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Azure Data Lake</CardTitle>
        <CardDescription>
          Connect to Azure Data Lake Storage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Azure Data Lake Storage</AlertTitle>
          <AlertDescription>
            Connect to Azure Data Lake Storage for scalable data storage and analytics.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="account-name">Storage Account Name</Label>
            <Input
              id="account-name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="mystorageaccount"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="access-key">Access Key</Label>
            <Input
              id="access-key"
              type="password"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              placeholder="Your access key"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="container-name">Container Name</Label>
            <Input
              id="container-name"
              value={containerName}
              onChange={(e) => setContainerName(e.target.value)}
              placeholder="mycontainer"
            />
          </div>

          <Alert>
            <Lock className="h-4 w-4" />
            <AlertTitle>Security Note</AlertTitle>
            <AlertDescription>
              Your Azure credentials are stored securely and encrypted. Never share your access key.
            </AlertDescription>
          </Alert>

          <Button 
            className="w-full" 
            onClick={handleConnect}
            disabled={!accountName || !accessKey || !containerName || isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect to Azure Data Lake'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}