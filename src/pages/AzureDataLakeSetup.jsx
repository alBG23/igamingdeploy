import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cloud, Info, Lock } from "lucide-react";

export default function AzureDataLakeSetup() {
  const [resourceGroup, setResourceGroup] = React.useState("");
  const [storageAccount, setStorageAccount] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [isSettingUp, setIsSettingUp] = React.useState(false);

  const handleSetup = async () => {
    setIsSettingUp(true);
    try {
      // Simulate setup process
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Azure Data Lake setup successful!');
    } catch (error) {
      alert('Failed to set up Azure Data Lake. Please check your configuration.');
    } finally {
      setIsSettingUp(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Azure Data Lake Setup</CardTitle>
        <CardDescription>
          Configure your Azure Data Lake Storage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Azure Data Lake Storage</AlertTitle>
          <AlertDescription>
            Set up Azure Data Lake Storage for scalable data storage and analytics.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resource-group">Resource Group</Label>
            <Input
              id="resource-group"
              value={resourceGroup}
              onChange={(e) => setResourceGroup(e.target.value)}
              placeholder="my-resource-group"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storage-account">Storage Account Name</Label>
            <Input
              id="storage-account"
              value={storageAccount}
              onChange={(e) => setStorageAccount(e.target.value)}
              placeholder="mystorageaccount"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="eastus"
            />
          </div>

          <Alert>
            <Lock className="h-4 w-4" />
            <AlertTitle>Security Note</AlertTitle>
            <AlertDescription>
              Ensure proper access controls and encryption are configured for your Azure Data Lake Storage.
            </AlertDescription>
          </Alert>

          <Button 
            className="w-full" 
            onClick={handleSetup}
            disabled={!resourceGroup || !storageAccount || !location || isSettingUp}
          >
            {isSettingUp ? 'Setting up...' : 'Set up Azure Data Lake'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}