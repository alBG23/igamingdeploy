import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, AlertTriangle, Info, Database, Code } from 'lucide-react';

export default function SQLFileGuide({ fileSize }) {
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
          <FileText className="mr-2 h-5 w-5 text-orange-500" />
          Large SQL File Handling Guide
        </CardTitle>
        <CardDescription>
          Tips for importing your {fileSize ? formatFileSize(fileSize) : 'large'} SQL file
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
          <AlertDescription className="text-amber-800 text-sm">
            Your SQL file is too large for direct browser-based processing.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Recommended approaches:</h3>
          
          <div className="bg-gray-50 p-4 rounded-md border space-y-4">
            <div className="flex gap-3">
              <div className="shrink-0 pt-1">
                <Database className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Option 1: Extract a Sample</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Extract 100-1000 INSERT statements from your SQL file and paste them in the 
                  "SQL" tab of the text import option.
                </p>
                <div className="mt-2 bg-gray-100 p-2 rounded text-xs font-mono overflow-auto">
                  <code>head -n 1000 your_large_file.sql | grep "INSERT INTO" &gt; sample.sql</code>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="shrink-0 pt-1">
                <Code className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Option 2: Convert to CSV</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Convert your SQL file to CSV format, which is more efficiently processed.
                  You can use tools like:
                </p>
                <ul className="text-xs text-gray-600 mt-1 list-disc pl-5">
                  <li>SQL client export functionality</li>
                  <li>Python scripts with pandas</li>
                  <li>Command-line tools like 'sqldump-to-csv'</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="shrink-0 pt-1">
                <Info className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Option 3: Split Into Smaller Files</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Split your large SQL file into multiple smaller files (500MB or less).
                </p>
                <div className="mt-2 bg-gray-100 p-2 rounded text-xs font-mono overflow-auto">
                  <code>split -l 100000 your_large_file.sql split_file_</code>
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