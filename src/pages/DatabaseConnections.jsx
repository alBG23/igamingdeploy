import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Database, Cloud, AlertTriangle, ServerCrash, FileWarning, HardDrive, Server, RefreshCw, Link2, Lock } from 'lucide-react';

export default function DatabaseConnections() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Database Connections</h1>
          <p className="text-gray-500 mt-1">
            Integration options for external databases and cloud storage
          </p>
        </div>
        
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Base44 has certain limitations with external database connections. This guide explains current capabilities and alternatives.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="direct">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="direct">Direct Database Connections</TabsTrigger>
            <TabsTrigger value="cloud">Cloud Storage Options</TabsTrigger>
            <TabsTrigger value="alternatives">Integration Alternatives</TabsTrigger>
          </TabsList>
          
          <TabsContent value="direct">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-indigo-600" />
                  Direct Database Connections
                </CardTitle>
                <CardDescription>
                  Current support for direct database connections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border border-red-200 bg-red-50 p-4">
                  <div className="flex">
                    <ServerCrash className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-red-800 font-medium">Current Limitations</h3>
                      <p className="text-red-700 mt-1">
                        Base44 currently does not support direct connections to external PostgreSQL databases or other SQL databases. The platform uses its own internal database for storing entity data.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md bg-white p-4 border">
                  <h3 className="font-medium mb-2">Available Approaches</h3>
                  <ul className="space-y-2 ml-6 list-disc text-gray-700">
                    <li>Use <strong>API integrations</strong> to connect to external data sources (requires custom development)</li>
                    <li>Import data through CSV files (with size limitations)</li>
                    <li>Use the Metrics entity for analytics data</li>
                  </ul>
                </div>
                
                <div className="rounded-md bg-white p-4 border">
                  <h3 className="font-medium mb-2">Upcoming Features</h3>
                  <p className="text-gray-600">
                    The Base44 team is working on direct database connection features that will allow connecting to PostgreSQL and other relational databases in the future. This will enable live data streaming rather than one-time imports.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cloud">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-indigo-600" />
                  Cloud Storage Options
                </CardTitle>
                <CardDescription>
                  Cloud storage integration capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
                  <div className="flex">
                    <FileWarning className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-amber-800 font-medium">S3 Integration Status</h3>
                      <p className="text-amber-700 mt-1">
                        Base44 does not currently have direct integration with AWS S3 or other cloud storage providers for automated data imports. However, there are some workarounds available.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md bg-white p-4 border">
                  <h3 className="font-medium mb-2">Possible Approaches</h3>
                  <ol className="space-y-4 ml-6 list-decimal">
                    <li>
                      <strong>S3 to CSV workflow</strong>
                      <p className="text-gray-600 mt-1">
                        Download data from S3 to your local machine, then upload via the CSV import tool. This is a manual process but works for periodic updates.
                      </p>
                    </li>
                    <li>
                      <strong>Custom API Integration</strong>
                      <p className="text-gray-600 mt-1">
                        Create a custom API that reads from your S3 bucket and formats the data appropriately, then build an integration in Base44 to fetch from this API.
                      </p>
                    </li>
                    <li>
                      <strong>Export Database to S3, then CSV</strong>
                      <p className="text-gray-600 mt-1">
                        Export your PostgreSQL data to S3 in CSV format, then download and import to Base44.
                      </p>
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alternatives">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-indigo-600" />
                  Integration Alternatives
                </CardTitle>
                <CardDescription>
                  Alternative approaches for working with external databases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-white p-4 border">
                  <div className="flex items-start">
                    <RefreshCw className="h-5 w-5 text-indigo-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Schedule Regular Imports</h3>
                      <p className="text-gray-600 mt-1">
                        Set up an automated script on your server that extracts data from your PostgreSQL database, formats it as a CSV, and uploads it to Base44 on a schedule. This works best for daily or weekly data refreshes.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md bg-white p-4 border">
                  <div className="flex items-start">
                    <Link2 className="h-5 w-5 text-indigo-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Build Middleware API</h3>
                      <p className="text-gray-600 mt-1">
                        Create a middleware API that interfaces between your PostgreSQL database and Base44. This API would handle the data transformation and filtering, then provide endpoints that Base44 can call to fetch the data.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md bg-white p-4 border">
                  <div className="flex items-start">
                    <Server className="h-5 w-5 text-indigo-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Replicate Key Data Only</h3>
                      <p className="text-gray-600 mt-1">
                        Instead of replicating your entire database, identify only the key metrics and dimensions needed for your analytics dashboard. Create a streamlined import process for just these essential data points.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border border-blue-200 bg-blue-50 p-4 mt-6">
                  <div className="flex">
                    <Lock className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-blue-800 font-medium">Enterprise Solutions</h3>
                      <p className="text-blue-700 mt-1">
                        For enterprise needs requiring tight integration with external databases, the Base44 team may be able to develop custom solutions. Contact the Base44 support team to discuss your specific requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-start border-t p-4">
                <Button asChild variant="outline">
                  <Link to={createPageUrl('DataImportTest')}>
                    Go to Data Import Test
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}