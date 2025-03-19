import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileCode, AlertTriangle, Info, FileText, Copy, Check } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

export default function ManualImportGuide() {
  const [copied, setCopied] = useState(false);
  
  const sampleCSVData = `brand,date,traffic_source,geo,clicks,registrations,ftd_count
BetStar,2023-01-15,organic,US,1240,65,28
CasinoRoyal,2023-01-15,affiliates,UK,890,45,15
PlayNow,2023-01-15,paid_social,CA,1520,75,32
BetStar,2023-01-16,organic,US,1180,62,25
CasinoRoyal,2023-01-16,affiliates,UK,920,48,18`;

  const copySample = () => {
    navigator.clipboard.writeText(sampleCSVData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileCode className="mr-2 h-5 w-5 text-indigo-500" />
          Manual Import Guide for Large Files
        </CardTitle>
        <CardDescription>
          Alternative approach for importing data from large files
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
          <AlertDescription className="text-amber-800 text-sm">
            Direct file upload failed. Let's try a different approach.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Step 1: Extract a Sample of Your Data</h3>
            <div className="bg-gray-50 p-4 rounded-md border">
              <p className="text-xs text-gray-700">
                If your original file is too large, extract a smaller portion of data (10-50 rows) to test the process.
                You can extract this from your original file using the following methods:
              </p>
              <div className="mt-2 space-y-2">
                <div className="bg-gray-100 p-2 rounded text-xs font-mono">
                  <p className="mb-1">For TAR files:</p>
                  <code>tar -xf your_file.tar</code>
                  <p className="mb-1 mt-2">Then for extracting samples:</p>
                  <code>head -n 50 extracted_file.csv &gt; sample.csv</code>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Step 2: Use the Text Paste Import Option</h3>
            <div className="bg-gray-50 p-4 rounded-md border">
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                <p className="text-xs text-gray-700">
                  Switch to the "Paste Text" tab and use the CSV, JSON, or SQL format option based on your data.
                  This method works more reliably for large datasets as it bypasses browser file upload limitations.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Step 3: Sample Template</h3>
            <div className="border rounded-md bg-white">
              <div className="flex items-center justify-between border-b p-2 bg-gray-50">
                <span className="text-xs font-medium">Sample CSV format</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 flex items-center gap-1"
                  onClick={copySample}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy Sample"}
                </Button>
              </div>
              <Textarea 
                className="font-mono text-xs p-3 border-0 min-h-[120px]" 
                readOnly 
                value={sampleCSVData}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Paste this sample into the CSV tab of the Paste Text option, or use it as a template for your own data.
            </p>
          </div>
          
          <div className="px-3 py-2 border border-blue-200 rounded-md bg-blue-50">
            <p className="text-xs text-blue-700">
              <span className="font-medium">Pro Tip:</span> For extremely large datasets, consider 
              breaking them into multiple smaller files and importing them in batches. You can use the
              "Paste Text" method multiple times.
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => {
            const pasteTab = document.querySelector('[value="paste"]');
            if (pasteTab) pasteTab.click();
          }}
        >
          Go to Paste Option
        </Button>
      </CardFooter>
    </Card>
  );
}