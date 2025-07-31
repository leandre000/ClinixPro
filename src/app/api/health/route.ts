import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const healthUrl = `${backendUrl}/health`;

    console.log('Checking backend health at:', healthUrl);

    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

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