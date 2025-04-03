import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Server, Info, Lock } from "lucide-react";

const backendTypes = [
  { value: "nodejs", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" }
];

export default function BackendIntegration() {
  const [selectedType, setSelectedType] = React.useState("");
  const [apiUrl, setApiUrl] = React.useState("");
  const [isConnecting, setIsConnecting] = React.useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Simulate connection attempt
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Backend connection successful!');
    } catch (error) {
      alert('Failed to connect to backend. Please check your API URL.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backend Integration</CardTitle>
        <CardDescription>
          Connect to your backend services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Backend Services</AlertTitle>
          <AlertDescription>
            Connect your application to backend services for data processing and business logic.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="backend-type">Backend Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select backend type" />
              </SelectTrigger>
              <SelectContent>
                {backendTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-url">API URL</Label>
            <Input
              id="api-url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://api.example.com"
            />
            <p className="text-sm text-gray-500">
              Enter the base URL of your backend API
            </p>
          </div>

          <Alert>
            <Lock className="h-4 w-4" />
            <AlertTitle>Security Note</AlertTitle>
            <AlertDescription>
              Ensure your backend API is properly secured with authentication and HTTPS.
            </AlertDescription>
          </Alert>

          <Button 
            className="w-full" 
            onClick={handleConnect}
            disabled={!selectedType || !apiUrl || isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect to Backend'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
