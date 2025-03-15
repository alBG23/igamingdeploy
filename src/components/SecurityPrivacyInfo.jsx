import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Lock, 
  Eye, 
  UserRound, 
  FileText, 
  Server, 
  HardDrive, 
  CloudOff
} from "lucide-react";

export default function SecurityPrivacyInfo() {
  return (
    <div className="space-y-6">
      <Alert className="bg-indigo-50 border-indigo-100">
        <Shield className="h-5 w-5 text-indigo-600" />
        <AlertTitle className="text-indigo-800">Enterprise-Grade Security</AlertTitle>
        <AlertDescription className="text-indigo-700">
          All solutions are built with privacy and security as the top priority, especially when dealing with sensitive customer data.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-indigo-600" />
            Security Guarantees
          </CardTitle>
          <CardDescription>
            How your data is protected when using Base44 solutions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <Server className="h-5 w-5 text-indigo-600 mt-1" />
                <div>
                  <h3 className="font-medium">Isolated Infrastructure</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Your backend API can be deployed to your own infrastructure, isolated from Base44 systems. Base44 delivers the code but does not need access to your production environment.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Lock className="h-5 w-5 text-indigo-600 mt-1" />
                <div>
                  <h3 className="font-medium">Zero Data Storage</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    The API service doesn't store any of your datalake's data; it only queries and returns what's requested at runtime.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <HardDrive className="h-5 w-5 text-indigo-600 mt-1" />
                <div>
                  <h3 className="font-medium">Your Infrastructure, Your Control</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    The backend API connecting to your datalake can be deployed within your own network/VPC for maximum security. No external access to your data is needed.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <UserRound className="h-5 w-5 text-indigo-600 mt-1" />
                <div>
                  <h3 className="font-medium">Role-Based Access Control</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Strict authentication and authorization ensures only authorized users can access specific data points.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <CloudOff className="h-5 w-5 text-indigo-600 mt-1" />
                <div>
                  <h3 className="font-medium">No Developer Access</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Once deployed to your infrastructure, Base44 developers don't need or have access to your production environment or data.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Eye className="h-5 w-5 text-indigo-600 mt-1" />
                <div>
                  <h3 className="font-medium">Audit Logging</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    All data access through the API can be comprehensively logged for security auditing and compliance requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-medium flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              Data Processing Agreement
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Base44 can provide a comprehensive Data Processing Agreement (DPA) that ensures:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
              <li>Base44 acts only as a data processor, not a controller</li>
              <li>Your organization retains full ownership and control of all data</li>
              <li>No data is shared with third parties without explicit consent</li>
              <li>Clear protocols for handling data breaches and security incidents</li>
              <li>Compliance with relevant data protection regulations (GDPR, CCPA, etc.)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}