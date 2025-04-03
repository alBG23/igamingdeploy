import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database, Info, Lock } from "lucide-react";

const databaseTypes = [
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "mongodb", label: "MongoDB" },
  { value: "sqlite", label: "SQLite" }
];

export default function DatabaseConnections() {
  const [selectedType, setSelectedType] = React.useState("");
  const [connectionString, setConnectionString] = React.useState("");
  const [isConnecting, setIsConnecting] = React.useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Simulate connection attempt
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Database connection successful!');
    } catch (error) {
      alert('Failed to connect to database. Please check your connection string.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Connections</CardTitle>
        <CardDescription>
          Connect to your database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Database Connection</AlertTitle>
          <AlertDescription>
            Connect your application to a database to store and retrieve data.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="database-type">Database Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select database type" />
              </SelectTrigger>
              <SelectContent>
                {databaseTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="connection-string">Connection String</Label>
            <Input
              id="connection-string"
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
              placeholder="postgresql://user:password@localhost:5432/dbname"
            />
            <p className="text-sm text-gray-500">
              Format depends on your database type
            </p>
          </div>

          <Alert>
            <Lock className="h-4 w-4" />
            <AlertTitle>Security Note</AlertTitle>
            <AlertDescription>
              Your database credentials are stored securely and encrypted. Never share your connection string.
            </AlertDescription>
          </Alert>

          <Button 
            className="w-full" 
            onClick={handleConnect}
            disabled={!selectedType || !connectionString || isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect to Database'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}