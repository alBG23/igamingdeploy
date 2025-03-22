import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { MetricsData } from "@/api/entities";
import { FileUp, AlertTriangle, CheckCircle2, RefreshCw, Database, Search } from 'lucide-react';

export default function DataImportTest() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [importedData, setImportedData] = useState([]);
  const [existingDataCount, setExistingDataCount] = useState(0);
  const [verificationResult, setVerificationResult] = useState(null);
  
  // Check for existing records when component loads
  useEffect(() => {
    checkExistingData();
  }, []);
  
  const checkExistingData = async () => {
    try {
      setIsChecking(true);
      const data = await MetricsData.list();
      setExistingDataCount(data.length);
    } catch (error) {
      console.error("Error checking existing data:", error);
      setErrorMessage("Could not verify existing data: " + error.message);
    } finally {
      setIsChecking(false);
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMessage(null);
      setSuccessMessage(null);
      setImportedData([]);
      setVerificationResult(null);
    }
  };
  
  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage(null);
    setSuccessMessage(null);
    setImportedData([]);
    setVerificationResult(null);
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);
      
      const fileReader = new FileReader();
      
      fileReader.onload = async (event) => {
        try {
          clearInterval(progressInterval);
          
          const csvData = event.target.result;
          const records = parseCSV(csvData);
          
          if (records.length === 0) {
            throw new Error("No valid records found in CSV");
          }
          
          // Validate records before import
          validateRequiredFields(records);
          
          // Insert records into MetricsData
          const previousCount = await getRecordCount();
          
          // Debugging log - show what we're sending
          console.log("Importing records:", records);
          
          await MetricsData.bulkCreate(records);
          setImportedData(records);
          
          // Verify that records were actually added
          setTimeout(async () => {
            const newCount = await getRecordCount();
            const addedCount = newCount - previousCount;
            
            if (addedCount === records.length) {
              setVerificationResult({
                success: true,
                message: `Verification successful: ${addedCount} records added to database`
              });
            } else if (addedCount > 0) {
              setVerificationResult({
                partial: true,
                message: `Partial import: Only ${addedCount} out of ${records.length} records were added`
              });
            } else {
              setVerificationResult({
                success: false,
                message: `Import verification failed: No new records detected in database`
              });
            }
          }, 1500);
          
          setUploadProgress(100);
          setSuccessMessage(`Processed ${records.length} records from CSV file. Verifying import...`);
        } catch (err) {
          setErrorMessage(`Error processing CSV: ${err.message}`);
        } finally {
          setIsUploading(false);
        }
      };
      
      fileReader.onerror = () => {
        clearInterval(progressInterval);
        setErrorMessage("Failed to read file");
        setIsUploading(false);
      };
      
      fileReader.readAsText(selectedFile);
      
    } catch (error) {
      setErrorMessage(`Upload failed: ${error.message}`);
      setIsUploading(false);
    }
  };
  
  const getRecordCount = async () => {
    try {
      const data = await MetricsData.list();
      return data.length;
    } catch (error) {
      console.error("Error getting record count:", error);
      return 0;
    }
  };
  
  // Validate records have required fields
  const validateRequiredFields = (records) => {
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      
      // Check for required field: user_id
      if (record.user_id === undefined || record.user_id === null || 
          record.user_id === '' || isNaN(parseInt(record.user_id))) {
        throw new Error(`Record #${i+1} has an invalid or missing user_id. Must be a valid integer.`);
      }
      
      // Check for required field: date
      if (!record.date || record.date === '') {
        throw new Error(`Record #${i+1} is missing the required 'date' field.`);
      }
      
      // Convert user_id to integer
      record.user_id = parseInt(record.user_id);
    }
  };
  
  // Basic CSV parser function
  const parseCSV = (csvText) => {
    // Split into lines
    const lines = csvText.split(/\r\n|\n/);
    if (lines.length < 2) throw new Error("CSV must have a header row and at least one data row");
    
    // Get headers from first line
    const headers = lines[0].split(',').map(header => header.trim());
    
    // Check for required headers
    if (!headers.includes('user_id')) {
      throw new Error("CSV must include 'user_id' column");
    }
    
    if (!headers.includes('date')) {
      throw new Error("CSV must include 'date' column");
    }
    
    // Parse each data line
    const records = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines
      
      // Handle quoted values with commas inside them
      const values = [];
      let inQuotes = false;
      let currentValue = "";
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"' && (j === 0 || line[j-1] !== '\\')) {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue);
          currentValue = "";
        } else {
          currentValue += char;
        }
      }
      
      // Add the last value
      values.push(currentValue);
      
      // Create record object from headers and values
      const record = {};
      for (let j = 0; j < headers.length; j++) {
        let value = values[j] ? values[j].trim() : '';
        
        // Remove surrounding quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        
        // Convert numeric strings to numbers
        if (!isNaN(value) && value !== '') {
          record[headers[j]] = Number(value);
        } else {
          record[headers[j]] = value;
        }
      }
      
      records.push(record);
    }
    
    return records;
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CSV Test Upload</h1>
          <p className="text-gray-500 mt-1">
            Upload a sample CSV file to test the MetricsData import functionality
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-indigo-600" />
              Test CSV Upload
            </CardTitle>
            <CardDescription>
              Upload a small CSV sample to verify your data format
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Search className="h-4 w-4 text-blue-600" />
              <AlertDescription className="flex justify-between items-center">
                <span>
                  {isChecking ? (
                    <span className="flex items-center">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Checking current data...
                    </span>
                  ) : (
                    <span>Currently {existingDataCount} records in MetricsData entity</span>
                  )}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={checkExistingData}
                  disabled={isChecking}
                >
                  Refresh
                </Button>
              </AlertDescription>
            </Alert>
            
            {successMessage && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}
            
            {verificationResult && (
              <Alert className={verificationResult.success ? "bg-green-50 border-green-200" : 
                (verificationResult.partial ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200")}>
                {verificationResult.success ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                )}
                <AlertDescription>
                  {verificationResult.message}
                </AlertDescription>
              </Alert>
            )}
            
            {errorMessage && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="csv-file">Select CSV File</Label>
                <div className="flex gap-2">
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleFileUpload}
                    disabled={!selectedFile || isUploading}
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
              </div>
              
              {isUploading && (
                <Progress value={uploadProgress} className="h-2" />
              )}
              
              {importedData.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Processed Data Preview (First 3 Records)</h3>
                  <div className="bg-gray-50 rounded-md p-4 overflow-auto max-h-60">
                    <pre className="text-xs">
                      {JSON.stringify(importedData.slice(0, 3), null, 2)}
                    </pre>
                  </div>
                </div>
              )}
              
              <Alert variant="warning" className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>Important:</strong> Your CSV must include both <code>user_id</code> (as an integer) and <code>date</code> (in YYYY-MM-DD format) fields, which are required.
                </AlertDescription>
              </Alert>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">CSV Requirements:</h3>
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                  <li><strong className="text-red-600">Required fields:</strong> user_id (integer) and date (YYYY-MM-DD)</li>
                  <li>First row must contain column headers matching the MetricsData entity fields</li>
                  <li>Date fields should use YYYY-MM-DD format</li>
                  <li>Datetime fields should use YYYY-MM-DDTHH:MM:SS format</li>
                  <li>Text fields containing commas should be enclosed in double quotes</li>
                </ul>
              </div>
              
              <div className="pt-2">
                <h3 className="text-sm font-medium mb-2">Example CSV Format:</h3>
                <div className="bg-gray-50 rounded-md p-3 overflow-x-auto">
                  <pre className="text-xs whitespace-pre">
{`date,user_id,email,full_name,country,ggr,ngr,deposit_count
2023-01-15,1001,user1@example.com,"Smith, John",UK,245.50,198.20,3
2023-01-15,1002,user2@example.com,Jane Doe,DE,312.75,256.40,2
2023-01-16,1003,user3@example.com,Robert Brown,SE,189.25,145.60,1`}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}