import { NextRequest, NextResponse } from "next/server";

// This function can be marked as async if using await

export default function middleware(request: NextRequest) {
  let jwtCookie = request.cookies.get("jwt")?.value;

  // Verify JWT
  if (jwtCookie) {
    verifyJWT(jwtCookie);
  }
  

  if (jwtCookie) {
    console.log(jwtCookie);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

export const verifyJWT = async (jwtCookie: string) => {
  try {
    const response = await fetch('http://localhost:4000/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ jwt: jwtCookie })
    });
    if (!response.ok) {
      throw new Error('Failed to fetch \'verifyJWT');
    }
    const data = await response.json();
    console.log(data);
  }
  catch (error) {
    throw new Error('JWT token is not valid');
  }
}