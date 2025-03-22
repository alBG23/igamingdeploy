import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Code } from "@/components/ui/code";
import { 
  Server, 
  Link2, 
  PlusCircle, 
  LucideDatabase, 
  ArrowRightLeft, 
  GitBranch, 
  Shield, 
  Clock, 
  FileCode, 
  RefreshCw
} from 'lucide-react';

export default function MiddlewareAPIGuide() {
  const [apiEndpoint, setApiEndpoint] = useState('https://api.example.com/metrics');
  const [apiKey, setApiKey] = useState('your_api_key_here');
  const [testResponse, setTestResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const simulateAPITest = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const sampleResponse = {
        status: "success",
        data: [
          {
            user_id: 1001,
            date: "2024-01-15",
            email: "user1@example.com",
            full_name: "John Smith",
            country: "UK",
            game_category: "slots",
            ggr: 245.50,
            ngr: 198.20,
            deposit_count: 3,
            deposit_amount_cents: 50000,
            bet_cents: 100000,
            win_cents: 75000
          },
          {
            user_id: 1002,
            date: "2024-01-15",
            email: "user2@example.com",
            full_name: "Jane Doe",
            country: "DE",
            game_category: "live_casino",
            ggr: 312.75,
            ngr: 256.40,
            deposit_count: 2,
            deposit_amount_cents: 75000,
            bet_cents: 150000,
            win_cents: 120000
          }
        ],
        count: 2,
        timestamp: new Date().toISOString()
      };
      
      setTestResponse(sampleResponse);
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Middleware API Integration Guide</h1>
          <p className="text-gray-500 mt-1">
            Building an API middleware layer between your database and Base44
          </p>
        </div>
        
        <Alert className="bg-blue-50 border-blue-200">
          <ArrowRightLeft className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            A middleware API can solve data integration challenges by providing a controlled interface between your PostgreSQL database and Base44.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-indigo-600" />
                  Middleware API Overview
                </CardTitle>
                <CardDescription>
                  Understanding the middleware API approach for database integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-md bg-white p-4 border">
                  <h3 className="font-medium mb-2">What is a Middleware API?</h3>
                  <p className="text-gray-600">
                    A middleware API is a custom-built API service that sits between your database and Base44. It provides endpoints that Base44 can call to retrieve data, while handling the database connections, query complexity, authentication, and data transformations on the server side.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-md bg-indigo-50 p-4 border border-indigo-100">
                    <h3 className="font-medium mb-2 text-indigo-900 flex items-center gap-2">
                      <PlusCircle className="h-4 w-4 text-indigo-600" />
                      Benefits
                    </h3>
                    <ul className="space-y-2 ml-6 list-disc text-indigo-800">
                      <li>Keep full control of your database</li>
                      <li>Apply business logic and transformations server-side</li>
                      <li>Implement robust security and authentication</li>
                      <li>Optimize queries for specific dashboard needs</li>
                      <li>Cache frequently accessed data</li>
                      <li>Control data refresh rates and strategies</li>
                    </ul>
                  </div>
                  
                  <div className="rounded-md bg-amber-50 p-4 border border-amber-100">
                    <h3 className="font-medium mb-2 text-amber-900 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      Considerations
                    </h3>
                    <ul className="space-y-2 ml-6 list-disc text-amber-800">
                      <li>Requires development and maintenance of custom API</li>
                      <li>Needs hosting infrastructure for the API service</li>
                      <li>Requires careful security implementation</li>
                      <li>May need to handle rate limiting and caching</li>
                      <li>Must keep API schema synchronized with Base44 entities</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 rounded-md bg-white p-4 border">
                  <h3 className="font-medium mb-2">When to Use a Middleware API</h3>
                  <p className="text-gray-600">
                    A middleware API is ideal when:
                  </p>
                  <ul className="space-y-2 ml-6 list-disc text-gray-600 mt-2">
                    <li>You have a large, complex database with data spread across multiple tables</li>
                    <li>You need to transform or aggregate data before presenting it</li>
                    <li>You need real-time or near-real-time data updates</li>
                    <li>You have strict security or compliance requirements for your data</li>
                    <li>Your data volume makes regular CSV imports impractical</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="architecture">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-indigo-600" />
                  Architecture & Design
                </CardTitle>
                <CardDescription>
                  Recommended architecture for your middleware API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-md bg-white p-4 border">
                  <h3 className="font-medium mb-2">Recommended Architecture</h3>
                  
                  <div className="my-6 p-4 bg-gray-100 rounded-lg border border-gray-200 relative flex flex-col items-center">
                    <div className="w-full max-w-sm bg-blue-100 rounded-md p-3 border border-blue-200 text-center">
                      <p className="font-medium text-blue-800">PostgreSQL Database</p>
                      <p className="text-xs text-blue-700">Your iGaming data</p>
                    </div>
                    
                    <div className="h-8 w-0.5 bg-gray-300"></div>
                    
                    <div className="w-full max-w-sm bg-purple-100 rounded-md p-3 border border-purple-200 text-center">
                      <p className="font-medium text-purple-800">API Server</p>
                      <p className="text-xs text-purple-700">Node.js/Express, Python/FastAPI, etc.</p>
                    </div>
                    
                    <div className="h-8 w-0.5 bg-gray-300"></div>
                    
                    <div className="w-full max-w-sm bg-green-100 rounded-md p-3 border border-green-200 text-center">
                      <p className="font-medium text-green-800">Base44 Integration</p>
                      <p className="text-xs text-green-700">Fetch data via HTTP requests</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mt-4">
                    This architecture separates concerns and allows each layer to focus on its primary responsibility. The API server acts as a translation layer, converting your database schema to the format expected by Base44.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-md bg-white p-4 border">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-indigo-600" />
                      Data Synchronization Strategies
                    </h3>
                    <ul className="space-y-2 ml-6 list-disc text-gray-600">
                      <li><strong>Pull-based:</strong> Base44 requests data from your API when needed</li>
                      <li><strong>Scheduled updates:</strong> Base44 fetches data at regular intervals</li>
                      <li><strong>Webhooks:</strong> Your API notifies Base44 when data changes</li>
                      <li><strong>Hybrid approach:</strong> Combine methods based on data update frequency</li>
                    </ul>
                  </div>
                  
                  <div className="rounded-md bg-white p-4 border">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-indigo-600" />
                      Security Considerations
                    </h3>
                    <ul className="space-y-2 ml-6 list-disc text-gray-600">
                      <li><strong>API keys or tokens</strong> for authentication</li>
                      <li><strong>HTTPS</strong> for encrypted data transfer</li>
                      <li><strong>Rate limiting</strong> to prevent abuse</li>
                      <li><strong>IP restrictions</strong> to limit access</li>
                      <li><strong>Audit logging</strong> for tracking access</li>
                    </ul>
                  </div>
                </div>
                
                <div className="rounded-md bg-white p-4 border">
                  <h3 className="font-medium mb-2">API Design Principles</h3>
                  <ul className="space-y-2 ml-6 list-disc text-gray-600">
                    <li><strong>RESTful design</strong> with standard HTTP methods</li>
                    <li><strong>Consistent response format</strong> across all endpoints</li>
                    <li><strong>Query parameters</strong> for filtering, sorting, pagination</li>
                    <li><strong>Versioning</strong> to allow API evolution</li>
                    <li><strong>Clear error responses</strong> with meaningful messages</li>
                    <li><strong>Documentation</strong> for all endpoints and parameters</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="implementation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-indigo-600" />
                  Implementation Examples
                </CardTitle>
                <CardDescription>
                  Code examples and implementation strategies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="nodejs">
                  <TabsList className="mb-4">
                    <TabsTrigger value="nodejs">Node.js</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="nodejs" className="space-y-4">
                    <div className="rounded-md bg-white p-4 border">
                      <h3 className="font-medium mb-2">Node.js Express API Example</h3>
                      
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm font-mono">
                        <pre>{`const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// Routes
app.get('/api/metrics', authenticateApiKey, async (req, res) => {
  try {
    const { startDate, endDate, limit = 100, offset = 0 } = req.query;
    
    // Build query with parameters
    let query = \`
      SELECT 
        u.id as user_id,
        CAST(d.date AS TEXT) as date,
        u.email,
        u.full_name,
        u.country,
        g.category as game_category,
        t.ggr,
        t.ngr,
        d.deposit_count,
        d.deposit_amount_cents,
        t.bet_cents,
        t.win_cents
      FROM users u
      JOIN daily_stats d ON u.id = d.user_id
      JOIN transactions t ON u.id = t.user_id AND d.date = t.date
      JOIN games g ON t.game_id = g.id
      WHERE 1=1
    \`;
    
    const queryParams = [];
    
    // Add date filters if provided
    if (startDate) {
      queryParams.push(startDate);
      query += \` AND d.date >= $\${queryParams.length}\`;
    }
    
    if (endDate) {
      queryParams.push(endDate);
      query += \` AND d.date <= $\${queryParams.length}\`;
    }
    
    // Add pagination
    query += \` ORDER BY d.date DESC LIMIT $\${queryParams.length + 1} OFFSET $\${queryParams.length + 2}\`;
    queryParams.push(parseInt(limit), parseInt(offset));
    
    // Execute query
    const result = await pool.query(query, queryParams);
    
    res.json({
      status: 'success',
      data: result.rows,
      count: result.rowCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error', 
      error: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(\`API server running on port \${port}\`);
});`}</pre>
                      </div>
                      
                      <p className="text-gray-600 mt-4">
                        This Node.js example creates a secure API endpoint that queries your PostgreSQL database and returns metrics data in a format compatible with Base44.
                      </p>
                    </div>
                    
                    <div className="rounded-md bg-white p-4 border">
                      <h3 className="font-medium mb-2">Database Connection Pool</h3>
                      <p className="text-gray-600">
                        The code uses a connection pool for efficient database access. Make sure to set the environment variables for database connection:
                      </p>
                      <ul className="space-y-1 ml-6 list-disc text-gray-600 mt-2">
                        <li>DB_USER - PostgreSQL username</li>
                        <li>DB_HOST - Database host address</li>
                        <li>DB_NAME - Database name</li>
                        <li>DB_PASSWORD - Database password</li>
                        <li>DB_PORT - Database port (default 5432)</li>
                        <li>API_KEY - Secret key for API authentication</li>
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="python" className="space-y-4">
                    <div className="rounded-md bg-white p-4 border">
                      <h3 className="font-medium mb-2">Python FastAPI Example</h3>
                      
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm font-mono">
                        <pre>{`from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security.api_key import APIKeyHeader
from typing import List, Optional
from pydantic import BaseModel
from datetime import date, datetime
import os
import psycopg2
from psycopg2.extras import RealDictCursor

app = FastAPI(title="iGaming Metrics API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

# API Key authentication
API_KEY = os.environ.get("API_KEY")
API_KEY_HEADER = APIKeyHeader(name="X-API-Key")

def get_api_key(api_key: str = Depends(API_KEY_HEADER)):
    if api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return api_key

# Database connection
def get_db_connection():
    conn = psycopg2.connect(
        dbname=os.environ.get("DB_NAME"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASSWORD"),
        host=os.environ.get("DB_HOST", "localhost"),
        port=os.environ.get("DB_PORT", "5432"),
        cursor_factory=RealDictCursor
    )
    return conn

# Data model
class MetricsData(BaseModel):
    user_id: int
    date: str
    email: Optional[str]
    full_name: Optional[str]
    country: Optional[str]
    game_category: Optional[str]
    ggr: Optional[float]
    ngr: Optional[float]
    deposit_count: Optional[int]
    deposit_amount_cents: Optional[int]
    bet_cents: Optional[int]
    win_cents: Optional[int]

class MetricsResponse(BaseModel):
    status: str
    data: List[MetricsData]
    count: int
    timestamp: str

@app.get("/api/metrics", response_model=MetricsResponse, dependencies=[Depends(get_api_key)])
async def get_metrics(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            SELECT 
                u.id as user_id,
                CAST(d.date AS TEXT) as date,
                u.email,
                u.full_name,
                u.country,
                g.category as game_category,
                t.ggr,
                t.ngr,
                d.deposit_count,
                d.deposit_amount_cents,
                t.bet_cents,
                t.win_cents
            FROM users u
            JOIN daily_stats d ON u.id = d.user_id
            JOIN transactions t ON u.id = t.user_id AND d.date = t.date
            JOIN games g ON t.game_id = g.id
            WHERE 1=1
        """
        
        params = []
        
        if start_date:
            query += " AND d.date >= %s"
            params.append(start_date)
            
        if end_date:
            query += " AND d.date <= %s"
            params.append(end_date)
            
        query += " ORDER BY d.date DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        return {
            "status": "success",
            "data": list(rows),
            "count": len(rows),
            "timestamp": datetime.now().isoformat()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
`}</pre>
                      </div>
                      
                      <p className="text-gray-600 mt-4">
                        This Python FastAPI example provides a robust API for accessing your PostgreSQL data with automatic schema validation.
                      </p>
                    </div>
                    
                    <div className="rounded-md bg-white p-4 border">
                      <h3 className="font-medium mb-2">Deployment Tips</h3>
                      <p className="text-gray-600">
                        To deploy this FastAPI application:
                      </p>
                      <ol className="space-y-1 ml-6 list-decimal text-gray-600 mt-2">
                        <li>Install requirements: <code>pip install fastapi uvicorn psycopg2-binary</code></li>
                        <li>Set environment variables for DB connection and API key</li>
                        <li>Run with uvicorn: <code>uvicorn app:app --host 0.0.0.0 --port 8000</code></li>
                        <li>For production, consider deploying behind Nginx with Gunicorn</li>
                      </ol>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="rounded-md bg-white p-4 border">
                  <h3 className="font-medium mb-2">Integration with Base44</h3>
                  <p className="text-gray-600">
                    Once your API is deployed, you can integrate it with Base44 by creating a custom integration that fetches data from your API and populates the MetricsData entity. The integration code will need to:
                  </p>
                  <ol className="space-y-2 ml-6 list-decimal text-gray-600 mt-2">
                    <li>Make HTTP requests to your API with proper authentication</li>
                    <li>Transform API responses to match the Base44 entity schema</li>
                    <li>Handle pagination for large datasets</li>
                    <li>Implement error handling and retry logic</li>
                    <li>Set up a refresh schedule that makes sense for your data update frequency</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="testing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-indigo-600" />
                  Testing Your API Integration
                </CardTitle>
                <CardDescription>
                  Verify your API works correctly with Base44
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-md bg-white p-4 border">
                  <h3 className="font-medium mb-2">API Endpoint Configuration</h3>
                  <p className="text-gray-600 mb-4">
                    Configure your middleware API endpoint and test connectivity:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-endpoint">API Endpoint URL</Label>
                      <Input 
                        id="api-endpoint" 
                        placeholder="https://your-api.example.com/metrics" 
                        value={apiEndpoint}
                        onChange={(e) => setApiEndpoint(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <Input 
                        id="api-key" 
                        type="password"
                        placeholder="your_api_key_here" 
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      onClick={simulateAPITest}
                      disabled={isLoading}
                      className="mt-2"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Testing Connection...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Test API Connection
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                {testResponse && (
                  <div className="rounded-md bg-green-50 p-4 border border-green-200">
                    <h3 className="font-medium mb-2 text-green-800">API Response (Simulated)</h3>
                    <div className="bg-white p-4 rounded-md border border-green-200 overflow-x-auto">
                      <pre className="text-sm text-green-800 font-mono">
                        {JSON.stringify(testResponse, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
                
                <div className="rounded-md bg-white p-4 border">
                  <h3 className="font-medium mb-2">Testing Checklist</h3>
                  <ul className="space-y-2 ml-6 list-disc text-gray-600">
                    <li><strong>API access:</strong> Verify Base44 can access your API endpoint</li>
                    <li><strong>Authentication:</strong> Confirm API key validation works correctly</li>
                    <li><strong>Data format:</strong> Ensure API response format matches Base44 entity schema</li>
                    <li><strong>Error handling:</strong> Test error responses and rate limiting behavior</li>
                    <li><strong>Performance:</strong> Verify response time is acceptable for data volume</li>
                    <li><strong>Filtering:</strong> Test that query parameters work as expected</li>
                  </ul>
                </div>
                
                <div className="rounded-md bg-white p-4 border">
                  <h3 className="font-medium mb-2">Sample JavaScript Fetch Code for Base44</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm font-mono">
                    <pre>{`// Example JavaScript code to fetch data from your middleware API
const fetchMetricsData = async () => {
  try {
    const response = await fetch('${apiEndpoint}', {
      method: 'GET',
      headers: {
        'X-API-Key': '${apiKey}',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(\`API request failed with status \${response.status}\`);
    }
    
    const data = await response.json();
    
    // Process and store data in Base44 MetricsData entity
    if (data.status === 'success' && Array.isArray(data.data)) {
      // Import records into Base44 entity
      await MetricsData.bulkCreate(data.data);
      console.log(\`Successfully imported \${data.data.length} records\`);
    } else {
      console.error('Unexpected API response format:', data);
    }
  } catch (error) {
    console.error('Error fetching metrics data:', error);
  }
};

// Call this function on a schedule or triggered by user action
fetchMetricsData();`}</pre>
                  </div>
                </div>
                
                <div className="rounded-md bg-indigo-50 p-4 border border-indigo-200">
                  <h3 className="font-medium mb-2 text-indigo-800">Next Steps</h3>
                  <p className="text-indigo-700">
                    Once you've successfully tested your API integration, you can:
                  </p>
                  <ol className="space-y-2 ml-6 list-decimal text-indigo-700 mt-2">
                    <li>Schedule regular data imports from your API</li>
                    <li>Set up monitoring to ensure continuous availability</li>
                    <li>Create dashboards and visualizations using the imported data</li>
                    <li>Consider adding more endpoints for different data slices or metrics</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}