import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileArchive, AlertTriangle, Info, Database, FileText } from 'lucide-react';

export default function TarFileGuide({ fileSize }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileArchive className="mr-2 h-5 w-5 text-orange-500" />
          TAR Archive Handling Guide
        </CardTitle>
        <CardDescription>
          Tips for importing your {fileSize ? formatFileSize(fileSize) : 'large'} TAR file
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
          <AlertDescription className="text-amber-800 text-sm">
            TAR archives cannot be directly processed by our data import system.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Recommended approaches:</h3>
          
          <div className="bg-gray-50 p-4 rounded-md border space-y-4">
            <div className="flex gap-3">
              <div className="shrink-0 pt-1">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Option 1: Extract and Upload Individual Files</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Extract the TAR archive on your local machine and upload the contained data files 
                  (CSV, JSON, SQL) directly.
                </p>
                <div className="mt-2 bg-gray-100 p-2 rounded text-xs font-mono overflow-auto">
                  <code>tar -xf your_archive.tar</code>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="shrink-0 pt-1">
                <Database className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Option 2: Use the SQL Version</h4>
                <p className="text-xs text-gray-600 mt-1">
                  If you have both TAR and SQL versions of the same data, use the SQL file instead 
                  (possibly with the SQL handling options described in our SQL guide).
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="shrink-0 pt-1">
                <Info className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Option 3: Convert to CSV Format</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Extract files from the TAR archive and convert them to CSV format which is the 
                  most efficiently processed format for large datasets.
                </p>
                <div className="mt-2 px-3 py-2 border border-blue-200 rounded-md bg-blue-50 text-xs text-blue-700">
                  <p className="font-medium">Need small sample data?</p>
                  <p>Use the "Paste Text" option with a small sample of your data (e.g., 10-20 rows) 
                  in CSV or JSON format to test the import process.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          Go Back
        </Button>
        <Button variant="default" size="sm" onClick={() => window.location.reload()}>
          Start Over
        </Button>
      </CardFooter>
    </Card>
  );
}