'use client';

import { useState } from 'react';

interface DiagnosticResult {
  name: string;
  status: 'checking' | 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export default function DebugPage() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const newResults: DiagnosticResult[] = [];

    // 1. Check environment variables
    newResults.push({
      name: 'Environment Variables',
      status: 'checking',
      message: 'Checking if API_URL is configured...',
    });
    setResults([...newResults]);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      newResults[0] = {
        name: 'Environment Variables',
        status: 'error',
        message: 'NEXT_PUBLIC_API_URL is not configured',
        details: 'Add NEXT_PUBLIC_API_URL to .env.local or Vercel Environment Variables',
      };
    } else if (!apiUrl.startsWith('https://')) {
      newResults[0] = {
        name: 'Environment Variables',
        status: 'warning',
        message: `API URL is using HTTP instead of HTTPS: ${apiUrl}`,
        details: 'For production, use HTTPS. For development, HTTP is OK.',
      };
    } else {
      newResults[0] = {
        name: 'Environment Variables',
        status: 'success',
        message: `✅ API URL configured: ${apiUrl}`,
      };
    }
    setResults([...newResults]);

    // 2. Test backend connectivity
    newResults.push({
      name: 'Backend Connectivity',
      status: 'checking',
      message: 'Testing connection to backend...',
    });
    setResults([...newResults]);

    if (apiUrl) {
      try {
        const response = await fetch(`${apiUrl}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          newResults[1] = {
            name: 'Backend Connectivity',
            status: 'success',
            message: `✅ Backend is running: ${apiUrl}`,
          };
        } else {
          newResults[1] = {
            name: 'Backend Connectivity',
            status: 'error',
            message: `Backend returned status: ${response.status}`,
            details: `Endpoint: ${apiUrl}/health`,
          };
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        newResults[1] = {
          name: 'Backend Connectivity',
          status: 'error',
          message: 'Cannot reach backend',
          details: `Error: ${errorMsg}. Check if backend is running and CORS is configured.`,
        };
      }
      setResults([...newResults]);
    }

    // 3. Test CORS
    newResults.push({
      name: 'CORS Configuration',
      status: 'checking',
      message: 'Testing CORS headers...',
    });
    setResults([...newResults]);

    if (apiUrl) {
      try {
        const response = await fetch(`${apiUrl}/api/auth/callback`, {
          method: 'OPTIONS',
          headers: {
            'Content-Type': 'application/json',
            'Origin': typeof window !== 'undefined' ? window.location.origin : '',
          },
        });

        const corsHeaders = {
          'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
          'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
          'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
        };

        if (corsHeaders['access-control-allow-origin']) {
          newResults[2] = {
            name: 'CORS Configuration',
            status: 'success',
            message: '✅ CORS is properly configured',
            details: `Origin: ${corsHeaders['access-control-allow-origin']}\nMethods: ${corsHeaders['access-control-allow-methods']}`,
          };
        } else {
          newResults[2] = {
            name: 'CORS Configuration',
            status: 'error',
            message: 'CORS headers are missing',
            details: 'Backend is not sending CORS headers. Add CORS configuration (see BACKEND_CORS_SETUP.md)',
          };
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        newResults[2] = {
          name: 'CORS Configuration',
          status: 'error',
          message: 'Cannot test CORS',
          details: `Error: ${errorMsg}`,
        };
      }
      setResults([...newResults]);
    }

    // 4. Test auth endpoint
    newResults.push({
      name: 'Auth Endpoint',
      status: 'checking',
      message: 'Testing /api/auth/callback endpoint...',
    });
    setResults([...newResults]);

    if (apiUrl) {
      try {
        const response = await fetch(`${apiUrl}/api/auth/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: 'test_code_12345' }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.access_token) {
            newResults[3] = {
              name: 'Auth Endpoint',
              status: 'success',
              message: '✅ Auth endpoint is working',
              details: 'Returns valid access_token',
            };
          } else {
            newResults[3] = {
              name: 'Auth Endpoint',
              status: 'error',
              message: 'Auth endpoint returned 200 but missing access_token',
              details: JSON.stringify(data, null, 2).substring(0, 200),
            };
          }
        } else if (response.status === 404) {
          newResults[3] = {
            name: 'Auth Endpoint',
            status: 'error',
            message: 'Auth endpoint not found (404)',
            details: 'Create POST /api/auth/callback endpoint on backend',
          };
        } else {
          const text = await response.text();
          newResults[3] = {
            name: 'Auth Endpoint',
            status: 'error',
            message: `Auth endpoint returned status: ${response.status}`,
            details: text.substring(0, 200),
          };
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        newResults[3] = {
          name: 'Auth Endpoint',
          status: 'error',
          message: 'Cannot test auth endpoint',
          details: `Error: ${errorMsg}`,
        };
      }
      setResults([...newResults]);
    }

    // 5. Check localStorage
    newResults.push({
      name: 'Browser Storage',
      status: 'checking',
      message: 'Checking localStorage...',
    });
    setResults([...newResults]);

    try {
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        const parsed = JSON.parse(authData);
        newResults[4] = {
          name: 'Browser Storage',
          status: 'success',
          message: '✅ Auth data found in localStorage',
          details: `User: ${parsed.state?.user?.username || 'unknown'}`,
        };
      } else {
        newResults[4] = {
          name: 'Browser Storage',
          status: 'warning',
          message: 'No auth data in localStorage',
          details: 'This is normal if you haven\'t logged in yet',
        };
      }
    } catch (error) {
      newResults[4] = {
        name: 'Browser Storage',
        status: 'error',
        message: 'localStorage is not available',
      };
    }
    setResults([...newResults]);

    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-l-4 border-green-500 bg-green-50';
      case 'error':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'warning':
        return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'checking':
        return 'border-l-4 border-blue-500 bg-blue-50';
      default:
        return 'border-l-4 border-gray-500 bg-gray-50';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'checking':
        return '⏳';
      default:
        return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🔧 Diagnostic Center</h1>
          <p className="text-gray-600">Run comprehensive diagnostics to identify configuration issues</p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This tool checks frontend and basic backend connectivity.
            For detailed backend diagnostics, check <code className="bg-blue-100 px-1 rounded">Railway Logs</code>.
          </p>
        </div>

        {/* Run Button */}
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg mb-6 transition"
        >
          {isRunning ? '⏳ Running Diagnostics...' : '🚀 Run Full Diagnostics'}
        </button>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className={`${getStatusColor(result.status)} p-4 rounded-lg`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getStatusEmoji(result.status)}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{result.name}</h3>
                    <p className="text-gray-700 mt-1">{result.message}</p>
                    {result.details && (
                      <pre className="mt-2 text-xs bg-white bg-opacity-50 p-2 rounded overflow-auto max-h-32">
                        {result.details}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Next Steps */}
        <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">📋 What to do next:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Check the diagnostics results above</li>
            <li>If you see ❌ errors, refer to <code className="bg-gray-100 px-1 rounded">COMPLETE_CORS_DEBUG_GUIDE.md</code></li>
            <li>Fix issues according to the guide</li>
            <li>Run diagnostics again to verify fixes</li>
            <li>Once all ✅, try logging in via <code className="bg-gray-100 px-1 rounded">/shelter</code></li>
          </ol>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>API URL: <code className="bg-gray-100 px-2 py-1 rounded">{process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}</code></p>
          <p className="mt-2">
            <a href="/shelter" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              ← Back to Shelter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
