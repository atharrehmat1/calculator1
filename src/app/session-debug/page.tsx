"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';
import { RefreshCw, CheckCircle2, XCircle, AlertCircle, Cookie, Database, Globe } from 'lucide-react';

interface SessionInfo {
  authenticated: boolean;
  user: {
    id: number;
    email: string;
    name: string;
  } | null;
}

interface CookieInfo {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: string;
}

export default function SessionDebugPage() {
  const { user, checkSession } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [cookies, setCookies] = useState<CookieInfo[]>([]);
  const [apiCalls, setApiCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Get cookies from document
  const getCookies = (): CookieInfo[] => {
    const cookieList: CookieInfo[] = [];
    const allCookies = document.cookie.split(';');
    
    allCookies.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name) {
        cookieList.push({
          name,
          value: value || '',
          domain: window.location.hostname,
          path: '/',
          expires: 'Session',
          httpOnly: false, // Can't detect from JS
          secure: window.location.protocol === 'https:',
          sameSite: 'Unknown'
        });
      }
    });
    
    return cookieList;
  };

  // Check session
  const checkSessionStatus = async () => {
    setLoading(true);
    setError(null);
    const startTime = Date.now();
    
    try {
      const data = await api.auth.getSession();
      const duration = Date.now() - startTime;
      
      setSessionInfo(data);
      setApiCalls(prev => [{
        timestamp: new Date().toISOString(),
        endpoint: '/api/auth/session',
        method: 'GET',
        status: 'success',
        duration: `${duration}ms`,
        response: data
      }, ...prev.slice(0, 9)]);
      
      return data;
    } catch (err: any) {
      const duration = Date.now() - startTime;
      setError(err.message);
      setApiCalls(prev => [{
        timestamp: new Date().toISOString(),
        endpoint: '/api/auth/session',
        method: 'GET',
        status: 'error',
        duration: `${duration}ms`,
        error: err.message
      }, ...prev.slice(0, 9)]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Test login
  const testLogin = async () => {
    const email = prompt('Enter email:');
    const password = prompt('Enter password:');
    
    if (!email || !password) return;
    
    setLoading(true);
    setError(null);
    const startTime = Date.now();
    
    try {
      const data = await api.auth.login(email, password);
      const duration = Date.now() - startTime;
      
      setApiCalls(prev => [{
        timestamp: new Date().toISOString(),
        endpoint: '/api/auth/login',
        method: 'POST',
        status: 'success',
        duration: `${duration}ms`,
        response: data
      }, ...prev.slice(0, 9)]);
      
      // Refresh session and cookies
      await checkSessionStatus();
      setCookies(getCookies());
      await checkSession();
      
      setTestResults(prev => [{
        test: 'Login',
        timestamp: new Date().toISOString(),
        success: true,
        message: 'Login successful',
        sessionId: data.sessionId
      }, ...prev.slice(0, 9)]);
    } catch (err: any) {
      const duration = Date.now() - startTime;
      setError(err.message);
      setApiCalls(prev => [{
        timestamp: new Date().toISOString(),
        endpoint: '/api/auth/login',
        method: 'POST',
        status: 'error',
        duration: `${duration}ms`,
        error: err.message
      }, ...prev.slice(0, 9)]);
      
      setTestResults(prev => [{
        test: 'Login',
        timestamp: new Date().toISOString(),
        success: false,
        message: err.message
      }, ...prev.slice(0, 9)]);
    } finally {
      setLoading(false);
    }
  };

  // Test logout
  const testLogout = async () => {
    setLoading(true);
    setError(null);
    const startTime = Date.now();
    
    try {
      await api.auth.logout();
      const duration = Date.now() - startTime;
      
      setApiCalls(prev => [{
        timestamp: new Date().toISOString(),
        endpoint: '/api/auth/logout',
        method: 'POST',
        status: 'success',
        duration: `${duration}ms`
      }, ...prev.slice(0, 9)]);
      
      // Refresh session and cookies
      await checkSessionStatus();
      setCookies(getCookies());
      await checkSession();
      
      setTestResults(prev => [{
        test: 'Logout',
        timestamp: new Date().toISOString(),
        success: true,
        message: 'Logout successful'
      }, ...prev.slice(0, 9)]);
    } catch (err: any) {
      const duration = Date.now() - startTime;
      setError(err.message);
      setApiCalls(prev => [{
        timestamp: new Date().toISOString(),
        endpoint: '/api/auth/logout',
        method: 'POST',
        status: 'error',
        duration: `${duration}ms`,
        error: err.message
      }, ...prev.slice(0, 9)]);
    } finally {
      setLoading(false);
    }
  };

  // Test session persistence
  const testPersistence = async () => {
    setTestResults(prev => [{
      test: 'Persistence Test',
      timestamp: new Date().toISOString(),
      success: true,
      message: 'Testing session persistence...'
    }, ...prev.slice(0, 9)]);
    
    const initialSession = await checkSessionStatus();
    const initialCookies = getCookies();
    
    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const afterSession = await checkSessionStatus();
    const afterCookies = getCookies();
    
    const persistent = 
      initialSession?.authenticated === afterSession?.authenticated &&
      initialSession?.user?.id === afterSession?.user?.id &&
      initialCookies.length === afterCookies.length;
    
    setTestResults(prev => [{
      test: 'Persistence Test',
      timestamp: new Date().toISOString(),
      success: persistent,
      message: persistent 
        ? 'Session persisted correctly' 
        : 'Session did not persist',
      details: {
        initial: initialSession,
        after: afterSession,
        cookieCount: { initial: initialCookies.length, after: afterCookies.length }
      }
    }, ...prev.slice(0, 9)]);
  };

  // Initial load
  useEffect(() => {
    checkSessionStatus();
    setCookies(getCookies());
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      checkSessionStatus();
      setCookies(getCookies());
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Environment info (only available on client)
  const [envInfo, setEnvInfo] = useState<Record<string, string>>({
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'Not set',
    nodeEnv: process.env.NODE_ENV || 'Not set',
    origin: 'Loading...',
    protocol: 'Loading...',
    hostname: 'Loading...',
    port: 'Loading...',
    credentials: 'include'
  });

  // Set window info on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEnvInfo({
        apiUrl: process.env.NEXT_PUBLIC_API_URL || 'Not set',
        nodeEnv: process.env.NODE_ENV || 'Not set',
        origin: window.location.origin,
        protocol: window.location.protocol,
        hostname: window.location.hostname,
        port: window.location.port || 'default',
        credentials: 'include'
      });
    }
  }, []);

  return (
    <div className="container py-12 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline mb-2">Session Debug Tool</h1>
        <p className="text-muted-foreground">
          Debug session persistence, cookies, and authentication issues
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Current Session Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Current Session Status
            </CardTitle>
            <CardDescription>Real-time session information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Authenticated:</span>
              {sessionInfo?.authenticated ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Yes
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="w-3 h-3 mr-1" />
                  No
                </Badge>
              )}
            </div>
            
            {sessionInfo?.user && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">User ID:</span>
                    <span className="text-sm">{sessionInfo.user.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm">{sessionInfo.user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Name:</span>
                    <span className="text-sm">{sessionInfo.user.name}</span>
                  </div>
                </div>
              </>
            )}
            
            {user && (
              <>
                <Separator />
                <div className="text-sm text-muted-foreground">
                  <strong>Auth Context User:</strong> {user.email}
                </div>
              </>
            )}
            
            <Separator />
            <div className="flex gap-2">
              <Button 
                onClick={checkSessionStatus} 
                disabled={loading}
                size="sm"
                variant="outline"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                size="sm"
                variant={autoRefresh ? "default" : "outline"}
              >
                {autoRefresh ? 'Stop Auto-Refresh' : 'Start Auto-Refresh'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cookie className="w-5 h-5" />
              Cookies ({cookies.length})
            </CardTitle>
            <CardDescription>Browser cookies for this domain</CardDescription>
          </CardHeader>
          <CardContent>
            {cookies.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                No cookies found
              </div>
            ) : (
              <div className="space-y-3">
                {cookies.map((cookie, idx) => (
                  <div key={idx} className="p-3 border rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-semibold">{cookie.name}</span>
                      {cookie.name.includes('session') || cookie.name.includes('sid') ? (
                        <Badge variant="default" className="bg-blue-500">Session</Badge>
                      ) : null}
                    </div>
                    <div className="text-xs text-muted-foreground break-all">
                      Value: {cookie.value.substring(0, 50)}{cookie.value.length > 50 ? '...' : ''}
                    </div>
                    <div className="text-xs text-muted-foreground grid grid-cols-2 gap-1">
                      <span>Domain: {cookie.domain}</span>
                      <span>Path: {cookie.path}</span>
                      <span>Secure: {cookie.secure ? 'Yes' : 'No'}</span>
                      <span>Expires: {cookie.expires}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button 
              onClick={() => setCookies(getCookies())} 
              size="sm" 
              variant="outline" 
              className="w-full mt-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Cookies
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Environment Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Environment & Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(envInfo).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground uppercase">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-sm font-mono break-all">{String(value)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Actions</CardTitle>
          <CardDescription>Test session functionality</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={testLogin} disabled={loading} variant="default">
              Test Login
            </Button>
            <Button onClick={testLogout} disabled={loading} variant="outline">
              Test Logout
            </Button>
            <Button onClick={testPersistence} disabled={loading} variant="outline">
              Test Persistence
            </Button>
            <Button onClick={checkSession} disabled={loading} variant="outline">
              Refresh Auth Context
            </Button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive rounded-lg">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Error:</span>
              </div>
              <div className="text-sm mt-1">{error}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Results from test actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testResults.map((result, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{result.test}</span>
                    {result.success ? (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Success
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        Failed
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{result.message}</div>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-muted-foreground">
                        View Details
                      </summary>
                      <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Calls */}
      {apiCalls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent API Calls</CardTitle>
            <CardDescription>Last 10 API requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {apiCalls.map((call, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{call.method}</span>
                      <span className="text-sm">{call.endpoint}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {call.status === 'success' ? (
                        <Badge variant="default" className="bg-green-500">
                          Success
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Error</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{call.duration}</span>
                    </div>
                  </div>
                  {call.error && (
                    <div className="text-sm text-destructive">{call.error}</div>
                  )}
                  {call.response && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-muted-foreground">
                        View Response
                      </summary>
                      <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                        {JSON.stringify(call.response, null, 2)}
                      </pre>
                    </details>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(call.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

