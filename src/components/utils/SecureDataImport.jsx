
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Lock, Database, Shield, FileJson, AlertCircle, CheckCircle } from 'lucide-react';

export default function SecureDataImport() {
  const [data, setData] = useState('');
  const [isValidJson, setIsValidJson] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');
  const [errorMessage, setErrorMessage] = useState('');
  
  const validateJson = (text) => {
    try {
      if (!text.trim()) {
        setIsValidJson(false);
        setErrorMessage('');
        return;
      }
      
      JSON.parse(text);
      setIsValidJson(true);
      setErrorMessage('');
    } catch (error) {
      setIsValidJson(false);
      setErrorMessage('Invalid JSON format: ' + error.message);
    }
  };
  
  const handleDataChange = (event) => {
    const newData = event.target.value;
    setData(newData);
    validateJson(newData);
  };
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setErrorMessage('Please upload a JSON file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        setData(content);
        validateJson(content);
      } catch (error) {
        setIsValidJson(false);
        setErrorMessage('Error reading file: ' + error.message);
      }
    };
    reader.readAsText(file);
  };
  
  const handleImport = () => {
    if (!isValidJson) return;
    
    localStorage.setItem('importedAnalyticsData', data);
    alert('Data imported successfully! Refresh to see your data in the analytics.');
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="bg-blue-50 border-b border-blue-100">
        <div className="flex items-center gap-2 text-blue-700">
          <Shield className="h-5 w-5" />
          <CardTitle>Secure Data Import</CardTitle>
        </div>
        <CardDescription className="text-blue-700">
          Import your data without sharing credentials with external services
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <FileJson className="h-4 w-4" />
            Manual JSON Input
          </TabsTrigger>
          <TabsTrigger value="file" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            File Upload
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Paste your JSON data below:</h3>
              <Textarea 
                placeholder="{ 'your': 'data' }"
                className="h-64 font-mono"
                value={data}
                onChange={handleDataChange}
              />
            </div>
            
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertTitle>Secure Processing</AlertTitle>
              <AlertDescription>
                Your data is processed entirely in your browser and never sent to our servers.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
        
        <TabsContent value="file" className="p-4">
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50">
              <Database className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <h3 className="font-medium">Upload a JSON file</h3>
              <p className="text-sm text-gray-500 mb-4">
                Drag and drop or click to select a file
              </p>
              <input
                type="file"
                accept=".json,application/json"
                className="hidden"
                id="file-upload"
                onChange={handleFileUpload}
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Select File
                </label>
              </Button>
            </div>
            
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            {data && (
              <div>
                <h3 className="text-sm font-medium mb-2">Preview:</h3>
                <div className="border rounded p-3 bg-gray-50 text-xs font-mono overflow-auto max-h-40">
                  {data.slice(0, 500)}
                  {data.length > 500 && '...'}
                </div>
              </div>
            )}
            
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertTitle>Secure Processing</AlertTitle>
              <AlertDescription>
                Files are processed locally in your browser and never uploaded to external servers.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="border-t bg-gray-50 flex justify-between">
        <div className="text-sm text-gray-500">
          {isValidJson ? (
            <span className="text-green-600 flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Valid JSON
            </span>
          ) : (
            data && <span className="text-red-600">Please provide valid JSON data</span>
          )}
        </div>
        <Button 
          onClick={handleImport}
          disabled={!isValidJson}
        >
          Import Data
        </Button>
      </CardFooter>
    </Card>
  );
}
