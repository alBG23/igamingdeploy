import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FileText, Download, Database, AlertTriangle, Table, CheckCircle2, FileSpreadsheet, FileJson } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

export default function DataImportGuide() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-indigo-600" />
          MetricsData Import Guide
        </CardTitle>
        <CardDescription>
          Learn how to format and import data into the MetricsData entity
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            Always back up your data before importing. Large imports may take some time to process.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Supported File Formats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-md border">
              <FileSpreadsheet className="h-8 w-8 text-green-600 shrink-0" />
              <div>
                <h4 className="font-medium">CSV</h4>
                <p className="text-sm text-gray-500">Comma-separated values with header row</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-md border">
              <FileJson className="h-8 w-8 text-orange-600 shrink-0" />
              <div>
                <h4 className="font-medium">JSON</h4>
                <p className="text-sm text-gray-500">Array of objects format</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-md border">
              <FileText className="h-8 w-8 text-blue-600 shrink-0" />
              <div>
                <h4 className="font-medium">Excel (XLSX)</h4>
                <p className="text-sm text-gray-500">Microsoft Excel spreadsheets</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="csv" className="w-full">
          <TabsList>
            <TabsTrigger value="csv">CSV Format</TabsTrigger>
            <TabsTrigger value="json">JSON Format</TabsTrigger>
            <TabsTrigger value="excel">Excel Format</TabsTrigger>
          </TabsList>
          
          <TabsContent value="csv" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h4 className="font-medium">CSV Import Guidelines</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>First row must contain header names matching entity fields</li>
                <li>Date fields should be in ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)</li>
                <li>Boolean values should be either "true" or "false"</li>
                <li>Number fields should not contain currency symbols or commas</li>
                <li>Text fields with commas must be enclosed in double quotes</li>
                <li>UTF-8 encoding is required</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md border overflow-x-auto">
              <pre className="text-xs">
                <code>
{`date,user_id,email,full_name,country,ggr,ngr,deposit_count,deposit_amount_cents,game_type
2023-01-15,1001,user1@example.com,"Smith, John",UK,245.50,198.20,3,25000,slots
2023-01-15,1002,user2@example.com,Jane Doe,DE,312.75,256.40,2,40000,live_casino
2023-01-16,1003,user3@example.com,Robert Brown,SE,189.25,145.60,1,20000,poker
2023-01-16,1001,user1@example.com,"Smith, John",UK,125.80,98.30,1,15000,table_games`}
                </code>
              </pre>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download CSV Template
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="json" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h4 className="font-medium">JSON Import Guidelines</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Data must be an array of objects</li>
                <li>Property names must match entity field names</li>
                <li>Date fields should be in ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)</li>
                <li>Boolean values should be true or false (without quotes)</li>
                <li>Number fields should be numeric (not strings)</li>
                <li>The file should be valid JSON and UTF-8 encoded</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md border overflow-x-auto">
              <pre className="text-xs">
                <code>
{`[
  {
    "date": "2023-01-15",
    "user_id": 1001,
    "email": "user1@example.com",
    "full_name": "Smith, John",
    "country": "UK",
    "ggr": 245.50,
    "ngr": 198.20,
    "deposit_count": 3,
    "deposit_amount_cents": 25000,
    "game_type": "slots"
  },
  {
    "date": "2023-01-15",
    "user_id": 1002,
    "email": "user2@example.com",
    "full_name": "Jane Doe",
    "country": "DE",
    "ggr": 312.75,
    "ngr": 256.40,
    "deposit_count": 2,
    "deposit_amount_cents": 40000,
    "game_type": "live_casino"
  }
]`}
                </code>
              </pre>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download JSON Template
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="excel" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h4 className="font-medium">Excel Import Guidelines</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>First row must contain header names matching entity fields</li>
                <li>Use the first sheet in the workbook for data</li>
                <li>Date fields should be formatted as dates in Excel</li>
                <li>Number fields should be formatted as numbers (not text)</li>
                <li>Boolean values should be TRUE or FALSE</li>
                <li>No merged cells, formulas, or complex formatting</li>
              </ul>
            </div>
            
            <div className="p-3 rounded-md border">
              <img src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1200&auto=format&fit=crop" 
                alt="Excel template example" 
                className="w-full max-w-2xl mx-auto rounded-md shadow-sm"
              />
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Excel Template
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Field Requirements</h3>
          <Alert className="mb-2">
            <Table className="h-4 w-4 text-indigo-600" />
            <AlertDescription>
              The <strong>date</strong> field is required for all records. All other fields are optional, but the more data you provide, the better your analytics will be.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <h4 className="font-medium">Required Fields:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><code className="bg-gray-100 px-1 rounded">date</code> - Date of the metrics in YYYY-MM-DD format</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Recommended Core Fields:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><code className="bg-gray-100 px-1 rounded">user_id</code> - Unique identifier for the player</li>
              <li><code className="bg-gray-100 px-1 rounded">brand</code> - Casino brand name</li>
              <li><code className="bg-gray-100 px-1 rounded">ggr</code> - Gross gaming revenue</li>
              <li><code className="bg-gray-100 px-1 rounded">ngr</code> - Net gaming revenue</li>
              <li><code className="bg-gray-100 px-1 rounded">deposit_count</code> - Number of deposits</li>
              <li><code className="bg-gray-100 px-1 rounded">deposit_amount_cents</code> - Total deposits in cents</li>
              <li><code className="bg-gray-100 px-1 rounded">game_type</code> - Type of game</li>
              <li><code className="bg-gray-100 px-1 rounded">traffic_source</code> - Source of traffic</li>
            </ul>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Import Process</h3>
          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li>
              <strong>Prepare your data</strong> according to the format guidelines above
            </li>
            <li>
              <strong>Go to Workspace &gt; Data</strong> in the left navigation
            </li>
            <li>
              <strong>Select MetricsData</strong> from the entity list
            </li>
            <li>
              <strong>Click &quot;Import&quot;</strong> in the top right corner
            </li>
            <li>
              <strong>Upload your file</strong> and follow the on-screen instructions
            </li>
            <li>
              <strong>Review the import preview</strong> to ensure data looks correct
            </li>
            <li>
              <strong>Complete the import</strong> by clicking &quot;Import Data&quot;
            </li>
          </ol>
        </div>

        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">After Importing</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Once your data is imported, you&apos;ll be able to access it in dashboards, charts, and analytics reports. The system will automatically process the data to calculate additional metrics and enable visualization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}