import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { FileLoadingIndicator } from "@/components/ui/file-loading-indicator";
import { MetricsData } from "@/api/entities";
import { ExtractDataFromUploadedFile, UploadFile } from "@/api/integrations";
import { 
  Upload, Database, AlertTriangle, RefreshCw, CheckCircle2, FileSpreadsheet, 
  FileJson, FileText, DownloadCloud, FilePlus, FileUp
} from 'lucide-react';

export default function DataImportUtility() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importedRecords, setImportedRecords] = useState(0);
  const [importOptions, setImportOptions] = useState({
    batchSize: 100,
    skipErrors: true,
    skipDuplicates: true
  });
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFileUrl(null);
    setUploadError(null);
    setImportError(null);
    setImportSuccess(false);
  };
  
  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);
    
    try {
      const response = await UploadFile({
        file: selectedFile
      });
      
      clearInterval(interval);
      setUploadProgress(100);
      setFileUrl(response.file_url);
    } catch (error) {
      clearInterval(interval);
      console.error("Error uploading file:", error);
      setUploadError(`Upload failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleBatchImport = async () => {
    if (!fileUrl) return;
    
    setIsProcessing(true);
    setImportProgress(0);
    setImportError(null);
    setImportSuccess(false);
    setImportedRecords(0);
    
    try {
      // First extract data from the file
      const schema = await MetricsData.schema();
      
      const extractResult = await ExtractDataFromUploadedFile({
        file_url: fileUrl,
        json_schema: schema
      });
      
      if (extractResult.status === "error") {
        throw new Error(extractResult.details || "Failed to extract data from file");
      }
      
      if (!extractResult.output || !Array.isArray(extractResult.output)) {
        throw new Error("No valid data found in the file");
      }
      
      const records = extractResult.output;
      const totalRecords = records.length;
      
      if (totalRecords === 0) {
        throw new Error("File contained no valid records");
      }
      
      // Process records in batches
      const batchSize = importOptions.batchSize;
      let processedCount = 0;
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < totalRecords; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        
        try {
          await MetricsData.bulkCreate(batch);
          successCount += batch.length;
        } catch (error) {
          console.error("Error importing batch:", error);
          errorCount += batch.length;
          
          if (!importOptions.skipErrors) {
            throw new Error(`Failed to import batch starting at record ${i+1}: ${error.message}`);
          }
        }
        
        processedCount += batch.length;
        const progress = Math.round((processedCount / totalRecords) * 100);
        setImportProgress(progress);
        setImportedRecords(successCount);
      }
      
      setImportSuccess(true);
    } catch (error) {
      console.error("Import error:", error);
      setImportError(`Import failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-indigo-600" />
          Import Data to MetricsData
        </CardTitle>
        <CardDescription>
          Import large datasets in batches to avoid timeouts
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {importSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>
              Successfully imported {importedRecords} records into MetricsData.
            </AlertDescription>
          </Alert>
        )}
        
        {(uploadError || importError) && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {uploadError || importError}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">1. Select Data File</Label>
            <div className="flex gap-2">
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.json,.xlsx,.xls"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button 
                onClick={handleFileUpload}
                disabled={!selectedFile || isUploading}
                variant="secondary"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FileUp className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
            
            {selectedFile && (
              <p className="text-sm text-gray-500">
                Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
              </p>
            )}
            
            {isUploading && (
              <Progress value={uploadProgress} className="h-2 mt-2" />
            )}
          </div>
          
          {fileUrl && (
            <>
              <div className="space-y-2">
                <Label>2. Configure Import Options</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="batch-size" className="text-sm">Batch Size</Label>
                    <Select 
                      value={importOptions.batchSize.toString()} 
                      onValueChange={(val) => setImportOptions({...importOptions, batchSize: parseInt(val)})}
                    >
                      <SelectTrigger id="batch-size">
                        <SelectValue placeholder="Select batch size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 records</SelectItem>
                        <SelectItem value="50">50 records</SelectItem>
                        <SelectItem value="100">100 records</SelectItem>
                        <SelectItem value="250">250 records</SelectItem>
                        <SelectItem value="500">500 records</SelectItem>
                        <SelectItem value="1000">1000 records</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="skip-errors"
                      checked={importOptions.skipErrors}
                      onChange={(e) => setImportOptions({...importOptions, skipErrors: e.target.checked})}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Label htmlFor="skip-errors" className="text-sm">Continue on errors</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="skip-duplicates"
                      checked={importOptions.skipDuplicates}
                      onChange={(e) => setImportOptions({...importOptions, skipDuplicates: e.target.checked})}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Label htmlFor="skip-duplicates" className="text-sm">Skip duplicates</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>3. Start Import Process</Label>
                <Button 
                  onClick={handleBatchImport}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Importing... ({importProgress}%)
                    </>
                  ) : (
                    <>
                      <FilePlus className="mr-2 h-4 w-4" />
                      Start Batch Import
                    </>
                  )}
                </Button>
                
                {isProcessing && (
                  <div className="space-y-1">
                    <Progress value={importProgress} className="h-2 mt-2" />
                    <p className="text-sm text-center text-gray-500">
                      Processing records in batches of {importOptions.batchSize}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
          
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Tips for Importing Large Files:</h3>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Break very large files (&gt;50MB) into smaller chunks before uploading</li>
              <li>Use the batch size option to control memory usage (smaller batches are slower but more reliable)</li>
              <li>Enable &quot;Continue on errors&quot; to prevent the entire import from failing on a few bad records</li>
              <li>For extremely large datasets, consider using multiple sequential imports</li>
              <li>CSV files typically process faster than JSON or Excel files</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}