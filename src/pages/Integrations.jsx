import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Database, Info, Lock } from "lucide-react";

export default function Integrations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>
          Connect to external services and databases
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>External Integrations</AlertTitle>
          <AlertDescription>
            Connect your application to external services and databases for enhanced functionality.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Available Integrations</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>PostgreSQL Database</li>
              <li>MongoDB Database</li>
              <li>Azure Data Lake</li>
              <li>GitHub Repository</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Security Requirements</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Secure API endpoints</li>
              <li>Encrypted credentials</li>
              <li>Access control policies</li>
              <li>Data validation</li>
            </ul>
          </div>

          <Alert>
            <Lock className="h-4 w-4" />
            <AlertTitle>Security Note</AlertTitle>
            <AlertDescription>
              Always use secure connections and proper authentication when integrating with external services.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
