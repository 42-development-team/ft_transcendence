import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
    const nonSecurePaths = [ '/' ];
    const loginPaths = ['/firstLogin', '/auth/2fa']

    let jwtCookie = request.cookies.get("jwt")?.value;

    let verifiedJWT = jwtCookie && (await verifyJWT(jwtCookie).catch((error) => {
        console.log(error);
    }));
    
    const currentTime = Math.floor(Date.now() / 1000);

    if (verifiedJWT && verifiedJWT.exp && verifiedJWT.exp > currentTime) {
        if (verifiedJWT.twoFactorAuthenticated) {
            if (nonSecurePaths.includes(request.nextUrl.pathname) || loginPaths.includes(request.nextUrl.pathname)) {
                return NextResponse.redirect(new URL('/home', request.url));
            }
        }
        else {
            if (!nonSecurePaths.includes(request.nextUrl.pathname) && !loginPaths.includes(request.nextUrl.pathname)) {
                return NextResponse.redirect(new URL('/', request.url));
            }
        }
    }
    else if (!nonSecurePaths.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL( '/', request.url)); 
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
        const verifiedJwt = await jwtVerify(jwtCookie,
            new TextEncoder().encode(process.env.JWT_SECRET)
        );
        return verifiedJwt.payload;
    }
    catch (error) {
        throw new Error(`JWT token is not valid`);
    }
}
