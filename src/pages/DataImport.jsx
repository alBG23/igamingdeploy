import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MetricsData } from "@/api/entities";
import { ExtractDataFromUploadedFile, UploadFile } from "@/api/integrations";
import { Upload, Loader2, AlertTriangle, CheckCircle, FileText, Download, Info, HelpCircle } from 'lucide-react';

export default function DataImport() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [activeTab, setActiveTab] = useState("upload");

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    console.log("Selected file:", selectedFile.name, selectedFile.type, selectedFile.size);
    
    try {
      setIsLoading(true);
      setError(null);
      setProgress(10);
      console.log("Starting file upload process for file:", selectedFile.name);

      // First upload the file
      const uploadResponse = await UploadFile({
        file: selectedFile
      });
      console.log("File upload response:", uploadResponse);
      
      if (!uploadResponse || !uploadResponse.file_url) {
        throw new Error("Failed to upload file");
      }
      
      setProgress(30);
      
      // Extract data from the uploaded file
      console.log("Starting data extraction with schema:", MetricsData.schema());
      const extractResponse = await ExtractDataFromUploadedFile({
        file_url: uploadResponse.file_url,
        json_schema: MetricsData.schema()
      });
      
      console.log("Data extraction response:", extractResponse);
      
      if (!extractResponse || extractResponse.status === "error") {
        throw new Error(extractResponse?.details || "Failed to extract data from file");
      }
      
      setProgress(60);
      
      // If we have valid data, create the records
      if (extractResponse.output && Array.isArray(extractResponse.output)) {
        console.log(`Creating ${extractResponse.output.length} records...`);
        const records = extractResponse.output;
        
        // Create records in batches of 100
        const batchSize = 100;
        for (let i = 0; i < records.length; i += batchSize) {
          const batch = records.slice(i, i + batchSize);
          await MetricsData.bulkCreate(batch);
          setProgress(60 + Math.floor((i / records.length) * 40));
        }
        
        setUploadResult({
          success: true,
          recordCount: records.length
        });
      } else if (extractResponse.output && typeof extractResponse.output === 'object') {
        // Handle single record
        await MetricsData.create(extractResponse.output);
        setUploadResult({
          success: true,
          recordCount: 1
        });
      } else {
        throw new Error("No valid data found in the file");
      }
      
      setProgress(100);
      console.log("Upload and import completed successfully");
      
    } catch (err) {
      console.error("Error during file upload:", err);
      setError(err.message || "Failed to process file");
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadSampleFile = (format) => {
    // Sample data that matches our schema
    const sampleData = [
      {
        "date": "2023-01-01",
        "affiliate_id": 123,
        "affiliate_name": "AffPartner1",
        "campaign_id": 456,
        "campaign_name": "Summer Promo",
        "ggr": 12500,
        "ngr": 10200,
        "deposit_count": 450,
        "deposit_amount_cents": 2000000,
        "roi": 3.5,
        "churn_probability": 0.12,
        "player_segment": "high_value"
      },
      {
        "date": "2023-01-02",
        "affiliate_id": 124,
        "affiliate_name": "AffPartner2",
        "campaign_id": 457,
        "campaign_name": "Winter Special",
        "ggr": 9800,
        "ngr": 7600,
        "deposit_count": 320,
        "deposit_amount_cents": 1500000,
        "roi": 2.8,
        "churn_probability": 0.15,
        "player_segment": "medium_value"
      }
    ];

    let fileContent;
    let fileName;
    let fileType;

    switch (format) {
      case 'json':
        fileContent = JSON.stringify(sampleData, null, 2);
        fileName = 'sample_metrics_data.json';
        fileType = 'application/json';
        break;
      case 'csv':
        // Create CSV header from first object keys
        const headers = Object.keys(sampleData[0]).join(',');
        // Create CSV rows
        const rows = sampleData.map(item => 
          Object.values(item).map(val => 
            typeof val === 'string' ? `"${val}"` : val
          ).join(',')
        );
        fileContent = [headers, ...rows].join('\n');
        fileName = 'sample_metrics_data.csv';
        fileType = 'text/csv';
        break;
      default:
        return;
    }

    // Create and download file
    const blob = new Blob([fileContent], { type: fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Import</h1>
          <p className="text-gray-500">Import metrics data from CSV, Excel, or JSON files</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="format">File Format Help</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Metrics Data</CardTitle>
                <CardDescription>
                  Upload your metrics data file. We'll automatically process and import the data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200 mb-4">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Best Format:</strong> For most reliable imports, use CSV or JSON format. SQL and TAR files are not directly supported by the extraction system.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".csv,.json,.xlsx"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadSampleFile('csv')}
                    className="text-xs"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Sample CSV
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => downloadSampleFile('json')}
                    className="text-xs"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Sample JSON
                  </Button>
                </div>

                {isLoading && progress > 0 && (
                  <div className="space-y-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-gray-500">
                      Processing... {progress}% complete
                    </p>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {uploadResult && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Successfully imported {uploadResult.recordCount} records
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="format">
            <Card>
              <CardHeader>
                <CardTitle>File Format Guidelines</CardTitle>
                <CardDescription>
                  Follow these guidelines to ensure successful data imports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-indigo-600" />
                    Recommended File Formats
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4 bg-gray-50">
                      <h4 className="font-semibold">CSV (Recommended)</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Simple, widely supported format with column headers matching schema properties.
                      </p>
                      <div className="mt-2 text-xs bg-gray-100 p-2 rounded">
                        <code>date,affiliate_id,campaign_name,ggr,ngr,deposit_count</code><br/>
                        <code>2023-01-01,123,"Summer Promo",12500,10200,450</code>
                      </div>
                    </div>
                    <div className="border rounded-md p-4 bg-gray-50">
                      <h4 className="font-semibold">JSON (Recommended)</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Flexible format that preserves data types and handles complex data.
                      </p>
                      <div className="mt-2 text-xs bg-gray-100 p-2 rounded">
                        <code>[{"{"}"date": "2023-01-01", "ggr": 12500, "ngr": 10200{"}"}]</code>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    Not Supported
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4 bg-amber-50">
                      <h4 className="font-semibold">SQL Files</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        SQL dump files cannot be directly processed by the extraction system.
                      </p>
                    </div>
                    <div className="border rounded-md p-4 bg-amber-50">
                      <h4 className="font-semibold">TAR/ZIP Archives</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Compressed archives need to be extracted before uploading.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-800 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Required Fields
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    At minimum, your file should contain the <code>date</code> field, which is required by the schema.
                    Other key fields include <code>ggr</code>, <code>ngr</code>, <code>deposit_count</code>, and
                    <code>affiliate_id</code> for meaningful analytics.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <Button onClick={() => setActiveTab("upload")}>
                  Return to Upload
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}