import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if backend is available
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const loginUrl = `${backendUrl}/auth/login`;
    
    // For development, try multiple ports if backend is not available
    const fallbackPorts = [8080, 8081, 8082];
    let backendResponse;
    let lastError;
    
    for (const port of fallbackPorts) {
      try {
        const testUrl = `http://localhost:${port}/api/auth/login`;
        console.log(`Trying backend at: ${testUrl}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout per attempt
        
        backendResponse = await fetch(testUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        // If we get here, the backend is responding
        break;
      } catch (error) {
        lastError = error;
        console.log(`Backend not available on port ${port}:`, error.message);
        continue;
      }
    }
    
    if (!backendResponse) {
      console.error('Backend not available on any port:', lastError);
      return NextResponse.json(
        { 
          message: 'Backend service is not available. Please ensure the backend server is running and try again.',
          error: 'BACKEND_UNAVAILABLE'
        },
        { status: 503 }
      );
    }

    console.log('Attempting to connect to backend:', loginUrl);

    // Forward the request to the backend with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const backendResponse = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Check if response is JSON
      const contentType = backendResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Backend returned non-JSON response:', contentType);
        console.error('Response status:', backendResponse.status);
        console.error('Response text:', await backendResponse.text());
        
        return NextResponse.json(
          { 
            message: 'Backend service is not available. Please try again later.',
            error: 'BACKEND_UNAVAILABLE'
          },
          { status: 503 }
        );
      }

      const data = await backendResponse.json();

      if (backendResponse.ok) {
        // Set cookies for authentication
        const response = NextResponse.json(data, { status: 200 });
        
        // Set secure HTTP-only cookies
        response.cookies.set('token', data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60, // 24 hours
        });

        return response;
      } else {
        return NextResponse.json(
          { message: data.message || 'Login failed' },
          { status: backendResponse.status }
        );
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('Backend request timed out');
        return NextResponse.json(
          { 
            message: 'Backend service is not responding. Please try again later.',
            error: 'BACKEND_TIMEOUT'
          },
          { status: 503 }
        );
      }

      console.error('Backend connection error:', fetchError);
      return NextResponse.json(
        { 
          message: 'Unable to connect to backend service. Please try again later.',
          error: 'BACKEND_CONNECTION_ERROR'
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 