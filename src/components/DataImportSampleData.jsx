import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { MetricsData } from "@/api/entities";
import { FileCheck, AlertTriangle, CheckCircle2, RefreshCw, Database } from 'lucide-react';

export default function DataImportSampleData() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const handleImportSampleData = async () => {
    setIsLoading(true);
    setProgress(0);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      // Generate sample data
      const sampleData = generateSampleData(30);
      console.log("Sample data generated:", sampleData);
      
      // Create progress simulation
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      
      // Import data in batches
      await MetricsData.bulkCreate(sampleData);
      
      clearInterval(interval);
      setProgress(100);
      setSuccessMessage(`Successfully imported ${sampleData.length} sample records`);
    } catch (error) {
      console.error("Error importing sample data:", error);
      setErrorMessage(`Import failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateSampleData = (count) => {
    const records = [];
    const countries = ["UK", "DE", "SE", "FR", "ES", "IT"];
    const gameTypes = ["slots", "live_casino", "table_games", "poker", "sports"];
    
    // Generate dates for the last 30 days
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD format
    }
    
    // Create user IDs from 1001 to 1020
    const userIds = [];
    for (let i = 1001; i <= 1020; i++) {
      userIds.push(i);
    }
    
    // Generate random records
    for (let i = 0; i < count; i++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const country = countries[Math.floor(Math.random() * countries.length)];
      const gameType = gameTypes[Math.floor(Math.random() * gameTypes.length)];
      const date = dates[Math.floor(Math.random() * dates.length)];
      
      const ggr = Math.round(Math.random() * 500 * 100) / 100; // Random GGR between 0 and 500
      const ngrPercentage = 0.7 + (Math.random() * 0.2); // NGR is 70-90% of GGR
      const ngr = Math.round(ggr * ngrPercentage * 100) / 100;
      
      const depositCount = Math.floor(Math.random() * 5) + 1;
      const depositAmount = Math.round(ggr * (1 + Math.random()) * 100);
      
      records.push({
        user_id: userId,
        date: date,
        country: country,
        game_type: gameType,
        ggr: ggr,
        ngr: ngr,
        deposit_count: depositCount,
        deposit_amount_cents: depositAmount,
        email: `user${userId}@example.com`,
        full_name: `Test User ${userId}`
      });
    }
    
    return records;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-indigo-600" />
          Import Sample Data
        </CardTitle>
        <CardDescription>
          Generate and import test data for MetricsData entity
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {successMessage && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>
              {successMessage}
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
          <p className="text-sm text-gray-600">
            Having trouble with your own data? Generate sample MetricsData records to test the system and see how the reports work with populated data.
          </p>
          
          {isLoading && (
            <Progress value={progress} className="h-2" />
          )}
          
          <div className="flex justify-end">
            <Button
              onClick={handleImportSampleData}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Generate Sample Data
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}