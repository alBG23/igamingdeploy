import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, Lock, Key, Users, Server } from "lucide-react";

export default function SecurityPrivacyInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security & Privacy</CardTitle>
        <CardDescription>
          Learn about our security measures and privacy practices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Data Protection</AlertTitle>
          <AlertDescription>
            All data is encrypted in transit and at rest using industry-standard encryption protocols.
          </AlertDescription>
        </Alert>

        <Alert>
          <Lock className="h-4 w-4" />
          <AlertTitle>API Key Security</AlertTitle>
          <AlertDescription>
            API keys are stored securely and encrypted. They are never exposed in client-side code.
          </AlertDescription>
        </Alert>

        <Alert>
          <Users className="h-4 w-4" />
          <AlertTitle>Access Control</AlertTitle>
          <AlertDescription>
            Strict access controls ensure that only authorized users can access sensitive data.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <h3 className="font-semibold">Security Practices</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            <li>Regular security audits and penetration testing</li>
            <li>Multi-factor authentication for all administrative access</li>
            <li>Automatic security updates and patches</li>
            <li>Comprehensive logging and monitoring</li>
            <li>Disaster recovery procedures</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}