
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, ChevronRight, Database, Github, Server, Lock, Globe, InfoIcon } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function ProductionSetupGuide() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Production Setup Guide</h1>
          <p className="text-gray-500 mt-1">
            Step-by-step instructions to deploy iGaming Analytics in a production environment
          </p>
        </div>
        
        <Alert className="bg-amber-50 border-amber-100">
          <AlertDescription className="flex items-start gap-2 text-amber-800">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Base44 Platform and VPN Usage</p>
              <p className="text-sm mt-1">
                The Base44 platform may experience loading issues when accessed through VPNs or proxy services. 
                For the best experience during development, try accessing the platform without a VPN connection.
                In production deployments, you'll need to ensure your infrastructure allows direct connections.
              </p>
            </div>
          </AlertDescription>
        </Alert>
        
        <Alert className="bg-amber-50 border-amber-200">
          <AlertDescription className="flex items-start gap-2 text-amber-800">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Production Requirements</p>
              <p className="text-sm mt-1">
                Moving to production requires setting up backend services and infrastructure. This guide outlines the key steps and components needed.
              </p>
            </div>
          </AlertDescription>
        </Alert>
        
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="flex items-start gap-2 text-blue-800">
            <InfoIcon className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Middleware API Approach (Recommended)</p>
              <p className="text-sm mt-1">
                For the most secure approach to connect to your database:
              </p>
              <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm">
                <li>Deploy a middleware API service (using FastAPI, Node.js Express, etc.)</li>
                <li>Store database credentials securely in environment variables on the API server</li>
                <li>Create secure endpoints that manage database operations</li>
                <li>Update the frontend code to call these API endpoints instead of connecting directly</li>
              </ol>
              <p className="text-sm mt-2">
                This approach keeps your credentials secure while allowing your Base44 application to work with your database.
              </p>
            </div>
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="overview">
          <TabsList className="w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="database">Database Integration</TabsTrigger>
            <TabsTrigger value="github">GitHub Integration</TabsTrigger>
            <TabsTrigger value="security">Security Considerations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Deployment Architecture Overview</CardTitle>
                <CardDescription>
                  Key components needed for a production-ready deployment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b">
                    <h3 className="font-medium">Architecture Components</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-start gap-4">
                      <Server className="h-6 w-6 text-indigo-600 shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">Backend API Server</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          A Node.js or Python backend service that handles authentication, database connectivity,
                          and secure operations that can't be performed directly from the browser.
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-4">
                      <Database className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">Database Connection Layer</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Secure service for connecting to your PostgreSQL database with proper access controls and 
                          query optimization. This layer handles transforming raw data into the analytics-ready format.
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-4">
                      <Github className="h-6 w-6 text-gray-800 shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">GitHub Integration Service</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          A backend service that securely stores GitHub credentials and handles version control operations,
                          commit history, and code synchronization without exposing tokens to the frontend.
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-4">
                      <Lock className="h-6 w-6 text-green-600 shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">Authentication & Authorization</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Production-grade authentication system with proper user roles, permissions, and access control.
                          Supports SSO, MFA, and compliance with gaming regulations.
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-4">
                      <Globe className="h-6 w-6 text-purple-600 shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">Infrastructure & Hosting</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Scalable hosting setup with CDN, load balancing, and regional deployment options for optimal performance.
                          Includes backup, monitoring, and disaster recovery capabilities.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="flex items-start gap-2 text-blue-800">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Need Implementation Help?</p>
                      <p className="text-sm mt-1">
                        Our team can provide turnkey deployment services, including setting up all the necessary backend infrastructure,
                        secure database connections, and production-grade version control. Contact us for a custom quote.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="database" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Integration</CardTitle>
                <CardDescription>
                  Connecting to your production gaming database securely
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-lg border">
                    <div className="bg-gray-50 p-4 border-b">
                      <h3 className="font-medium">Step-by-Step Database Integration</h3>
                    </div>
                    <div className="p-4">
                      <ol className="space-y-6">
                        <li className="flex gap-3">
                          <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm">1</div>
                          <div>
                            <h4 className="font-medium">Create a Read-Only Database User</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Create a dedicated read-only user in your gaming database to ensure analytics can't modify production data.
                            </p>
                            <div className="mt-2 p-3 bg-gray-50 rounded-md font-mono text-sm">
                              <pre>{`CREATE USER analytics_reader WITH PASSWORD 'strong_password';
GRANT CONNECT ON DATABASE gaming_db TO analytics_reader;
GRANT USAGE ON SCHEMA public TO analytics_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_reader;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO analytics_reader;`}</pre>
                            </div>
                          </div>
                        </li>
                        
                        <li className="flex gap-3">
                          <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm">2</div>
                          <div>
                            <h4 className="font-medium">Setup Database Proxy Service</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Implement a secure database proxy service that handles connection pooling, query optimization, and data transformation.
                            </p>
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="p-3 border rounded-md">
                                <h5 className="text-sm font-medium mb-1">Recommended Technologies</h5>
                                <ul className="text-sm space-y-1">
                                  <li>• Node.js with pg-promise</li>
                                  <li>• Python with SQLAlchemy</li>
                                  <li>• Java Spring Boot</li>
                                  <li>• AWS RDS Proxy</li>
                                </ul>
                              </div>
                              <div className="p-3 border rounded-md">
                                <h5 className="text-sm font-medium mb-1">Key Features to Implement</h5>
                                <ul className="text-sm space-y-1">
                                  <li>• Connection pooling</li>
                                  <li>• Query caching</li>
                                  <li>• Data transformation</li>
                                  <li>• Rate limiting</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </li>
                        
                        <li className="flex gap-3">
                          <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm">3</div>
                          <div>
                            <h4 className="font-medium">Create Analytics Views</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Create optimized database views that pre-aggregate data for analytics to improve performance.
                            </p>
                            <div className="mt-2 p-3 bg-gray-50 rounded-md font-mono text-sm">
                              <pre>{`-- Example of a revenue analytics view
CREATE OR REPLACE VIEW analytics.daily_revenue AS
SELECT 
  DATE_TRUNC('day', transaction_date) AS day,
  country,
  game_type,
  SUM(bet_amount) AS total_bets,
  SUM(win_amount) AS total_wins,
  SUM(bet_amount - win_amount) AS ggr,
  COUNT(DISTINCT player_id) AS unique_players
FROM transactions
GROUP BY 1, 2, 3;`}</pre>
                            </div>
                          </div>
                        </li>
                        
                        <li className="flex gap-3">
                          <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm">4</div>
                          <div>
                            <h4 className="font-medium">Implement API Endpoints</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Create RESTful API endpoints that serve analytics data with proper authentication and caching.
                            </p>
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="p-3 border rounded-md">
                                <h5 className="text-sm font-medium mb-1">Example Endpoints</h5>
                                <ul className="text-sm space-y-1">
                                  <li>• GET /api/analytics/revenue</li>
                                  <li>• GET /api/analytics/players</li>
                                  <li>• GET /api/analytics/games</li>
                                  <li>• GET /api/analytics/affiliates</li>
                                </ul>
                              </div>
                              <div className="p-3 border rounded-md">
                                <h5 className="text-sm font-medium mb-1">Features to Include</h5>
                                <ul className="text-sm space-y-1">
                                  <li>• JWT authentication</li>
                                  <li>• Response caching</li>
                                  <li>• Query parameter filtering</li>
                                  <li>• Rate limiting</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </li>
                        
                        <li className="flex gap-3">
                          <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm">5</div>
                          <div>
                            <h4 className="font-medium">Configure ETL Pipeline (Optional)</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              For large-scale deployments, set up a dedicated analytics data warehouse with ETL pipelines.
                            </p>
                            <div className="mt-2">
                              <Badge className="bg-blue-100 text-blue-800">Recommended for 1M+ players</Badge>
                              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                <h5 className="text-sm font-medium mb-1">ETL Options</h5>
                                <ul className="text-sm space-y-1">
                                  <li>• Apache Airflow for workflow management</li>
                                  <li>• AWS Glue or Google Cloud Dataflow</li>
                                  <li>• Snowflake or BigQuery as a data warehouse</li>
                                  <li>• dbt for data transformation</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </li>

                        <li className="flex gap-3">
                          <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm">6</div>
                          <div>
                            <h4 className="font-medium">Create Middleware API (Recommended)</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Set up a secure middleware API that handles database access and keeps credentials safe.
                            </p>
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="p-3 border rounded-md">
                                <h5 className="text-sm font-medium mb-1">API Development Options</h5>
                                <ul className="text-sm space-y-1">
                                  <li>• Node.js with Express</li>
                                  <li>• Python with FastAPI</li>
                                  <li>• AWS API Gateway with Lambda</li>
                                  <li>• Supabase Edge Functions</li>
                                </ul>
                              </div>
                              <div className="p-3 border rounded-md">
                                <h5 className="text-sm font-medium mb-1">Security Features to Include</h5>
                                <ul className="text-sm space-y-1">
                                  <li>• JWT authentication</li>
                                  <li>• Rate limiting</li>
                                  <li>• Environment variables for credentials</li>
                                  <li>• Request logging and monitoring</li>
                                </ul>
                              </div>
                            </div>
                            <div className="mt-2 p-3 bg-gray-50 rounded-md font-mono text-sm">
                              <pre>{`// Example Express middleware API endpoint
app.get('/api/analytics/revenue', authenticate, async (req, res) => {
  try {
    // Database credentials stored securely in environment variables
    const client = await createDatabaseConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    const results = await client.query(
      'SELECT date, sum(amount) FROM revenue GROUP BY date'
    );
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});`}</pre>
                            </div>
                          </div>
                        </li>
                      </ol>
                    </div>
                  </div>
                  
                  <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="flex items-start gap-2 text-green-800">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Custom Integrations Available</p>
                        <p className="text-sm mt-1">
                          We offer custom integration services for all major gaming platforms including SoftSwiss, EveryMatrix, BetConstruct, and others.
                          Our team can build and maintain a secure connection to your production database.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="github" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>GitHub Integration</CardTitle>
                <CardDescription>
                  Setting up real GitHub version control for your analytics configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription className="flex items-start gap-2 text-blue-800">
                      <Github className="h-5 w-5 text-blue-800 shrink-0 mt-0.5" />
                      <p className="text-sm">
                        GitHub integration requires a backend service to securely store credentials and perform Git operations.
                        This is because browser-based applications cannot directly interact with GitHub repositories due to security limitations.
                      </p>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="rounded-lg border">
                    <div className="bg-gray-50 p-4 border-b">
                      <h3 className="font-medium">Implementation Steps</h3>
                    </div>
                    <div className="p-4">
                      <ol className="space-y-6">
                        <li className="flex gap-3">
                          <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm">1</div>
                          <div>
                            <h4 className="font-medium">Create a GitHub App or OAuth App</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Register a GitHub App or OAuth App to securely authenticate with GitHub API.
                            </p>
                            <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                              <h5 className="font-medium mb-1">Steps:</h5>
                              <ol className="space-y-1 list-decimal pl-5">
                                <li>Go to GitHub Developer Settings</li>
                                <li>Create a new GitHub App</li>
                                <li>Set permissions for repository access</li>
                                <li>Generate a private key</li>
                                <li>Note the App ID and installation ID</li>
                              </ol>
                            </div>
                          </div>
                        </li>
                        
                        <li className="flex gap-3">
                          <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm">2</div>
                          <div>
                            <h4 className="font-medium">Create Backend GitHub Service</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Implement a server-side service that handles GitHub API operations securely.
                            </p>
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="p-3 border rounded-md">
                                <h5 className="text-sm font-medium mb-1">Required API Endpoints</h5>
                                <ul className="text-sm space-y-1">
                                  <li>• POST /api/github/connect</li>
                                  <li>• GET /api/github/repos</li>
                                  <li>• POST /api/github/sync</li>
                                  <li>• GET /api/github/history</li>
                                  <li>• POST /api/github/restore</li>
                                </ul>
                              </div>
                              <div className="p-3 border rounded-md">
                                <h5 className="text-sm font-medium mb-1">Technologies</h5>
                                <ul className="text-sm space-y-1">
                                  <li>• Node.js with Octokit</li>
                                  <li>• Python with PyGithub</li>
                                  <li>• Java with GitHub API</li>
                                  <li>• Secure credential storage</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </li>
                        
                        <li className="flex gap-3">
                          <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm">3</div>
                          <div>
                            <h4 className="font-medium">Implement Local Git Operations</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Set up Git operations on your backend server to manage repository changes.
                            </p>
                            <div className="mt-2 p-3 bg-gray-50 rounded-md font-mono text-sm">
                              <pre>{`// Example Node.js code using simple-git
const git = require('simple-git');

async function syncChanges(repoPath, message) {
  try {
    await git(repoPath)
      .add('./*')
      .commit(message)
      .push('origin', 'main');
    return { success: true };
  } catch (error) {
    console.error('Git sync error:', error);
    return { success: false, error: error.message };
  }
}`}</pre>
                            </div>
                          </div>
                        </li>
                        
                        <li className="flex gap-3">
                          <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm">4</div>
                          <div>
                            <h4 className="font-medium">Secure Credential Storage</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Implement secure storage for GitHub credentials using environment variables or a secrets manager.
                            </p>
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="p-3 border rounded-md">
                                <h5 className="text-sm font-medium mb-1">Options for Self-Hosted</h5>
                                <ul className="text-sm space-y-1">
                                  <li>• Environment variables</li>
                                  <li>• HashiCorp Vault</li>
                                  <li>• Encrypted database</li>
                                  <li>• Docker secrets</li>
                                </ul>
                              </div>
                              <div className="p-3 border rounded-md">
                                <h5 className="text-sm font-medium mb-1">Cloud Provider Options</h5>
                                <ul className="text-sm space-y-1">
                                  <li>• AWS Secrets Manager</li>
                                  <li>• Google Secret Manager</li>
                                  <li>• Azure Key Vault</li>
                                  <li>• Vercel/Netlify environment</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </li>
                        
                        <li className="flex gap-3">
                          <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm">5</div>
                          <div>
                            <h4 className="font-medium">Update Frontend to Use API</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Modify the frontend GitHub integration to call your secure backend API instead of simulating operations.
                            </p>
                            <div className="mt-2 p-3 bg-gray-50 rounded-md font-mono text-sm">
                              <pre>{`// Example React code for GitHub API integration
async function syncWithGitHub() {
  setLoading(true);
  try {
    const response = await fetch('/api/github/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: 'Update analytics configuration',
        files: changedFiles 
      })
    });
    
    const result = await response.json();
    if (result.success) {
      // Update UI with new commit info
      loadCommitHistory();
    } else {
      setError(result.error);
    }
  } catch (error) {
    setError('Failed to connect to GitHub service');
  } finally {
    setLoading(false);
  }
}`}</pre>
                            </div>
                          </div>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Considerations</CardTitle>
                <CardDescription>
                  Essential security measures for production deployment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-lg border">
                    <div className="bg-gray-50 p-4 border-b">
                      <h3 className="font-medium">Security Checklist</h3>
                    </div>
                    <div className="p-4 space-y-5">
                      <div>
                        <h4 className="font-medium flex items-center">
                          <Lock className="h-5 w-5 mr-2 text-red-600" />
                          Authentication & Authorization
                        </h4>
                        <div className="mt-2 ml-7 space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm">Implement JWT or OAuth 2.0 for secure API authentication</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm">Set up role-based access control (RBAC) for different user types</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm">Enable multi-factor authentication (MFA) for admin accounts</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm">Implement proper session management with secure timeouts</p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium flex items-center">
                          <Database className="h-5 w-5 mr-2 text-blue-600" />
                          Data Security
                        </h4>
                        <div className="mt-2 ml-7 space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm">Use least privilege principle for database access (read-only when possible)</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm">Implement database encryption at rest and in transit</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm">Set up proper firewall rules to limit database access to specific IPs</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm">Implement data masking for sensitive player information (PII)</p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium flex items-center">
                          <Server className="h-5 w-5 mr-2 text-indigo-600" />
                          API & Network Security
                        </h4>
                        <div className="mt-2 ml-7 space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm">Configure HTTPS for all traffic with proper certificate management</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm">Implement rate limiting to prevent API abuse</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm">Set up WAF (Web Application Firewall) to block common attacks</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm">Use proper CORS configuration to prevent unauthorized access</p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium flex items-center">
                          <Github className="h-5 w-5 mr-2 text-gray-800" />
                          GitHub & Code Security
                        </h4>
                        <div className="mt-2 ml-7 space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm">Store GitHub tokens and keys securely in environment variables or secrets manager</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm">Use GitHub fine-grained access tokens with minimal permissions</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm">Implement branch protection rules to prevent unauthorized changes</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm">Set up code scanning and secret scanning for repositories</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Alert className="bg-red-50 border-red-200">
                    <AlertDescription className="flex items-start gap-2 text-red-800">
                      <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Gaming Industry Compliance</p>
                        <p className="text-sm mt-1">
                          For regulated gaming operators, ensure your analytics platform complies with relevant gambling
                          regulations in your jurisdictions, including data protection requirements such as GDPR or CCPA.
                          Consider implementing specific data retention policies and access controls.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
