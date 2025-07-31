import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Try multiple ports to find the backend
    const fallbackPorts = [8080, 8081, 8082];
    let response;
    let workingPort;
    
    for (const port of fallbackPorts) {
      try {
        const healthUrl = `http://localhost:${port}/api/health`;
        console.log('Checking backend health at:', healthUrl);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout per attempt
        
        response = await fetch(healthUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        workingPort = port;
        break;
      } catch (error) {
        console.log(`Backend not available on port ${port}:`, error.message);
        continue;
      }
    }
    
    if (!response) {
      return NextResponse.json({
        status: 'unhealthy',
        backend: {
          status: 'down',
          error: 'Backend service is not available on any port',
          triedPorts: fallbackPorts,
        },
        timestamp: new Date().toISOString(),
      }, { status: 503 });
    }

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        status: 'healthy',
        backend: data,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json({
        status: 'unhealthy',
        backend: {
          status: 'down',
          error: `Backend returned status ${response.status}`,
        },
        timestamp: new Date().toISOString(),
      }, { status: 503 });
    }
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'unhealthy',
      backend: {
        status: 'down',
        error: 'Backend service is not available',
      },
      timestamp: new Date().toISOString(),
    }, { status: 503 });
  }
} 