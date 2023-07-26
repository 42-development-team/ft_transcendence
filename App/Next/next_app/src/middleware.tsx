import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { refreshToken } from "./app/utils/refreshJWT";

const THREE_MINUTES = 60 * 3;
const TWENTY_NINE_MINUTES = 30 * 60;

export async function middleware(request: NextRequest) {
    let jwtCookie = request.cookies.get("jwt")?.value;

    let verifiedJWT = jwtCookie && (await verifyJWT(jwtCookie).catch((error) => {
        console.log(error);
    }));
    
    // Todo: refresh token if expired or expiring soon
    const currentTime = Math.floor(Date.now() / 1000);

    
    if (verifiedJWT && verifiedJWT.exp) {
        const deltaTime = verifiedJWT.exp - currentTime;
        console.log(verifiedJWT);
        console.log("deltatime: " + deltaTime);

        if (deltaTime < TWENTY_NINE_MINUTES)  {
            console.log("JWT is expiring soon -> need to refresh !!")
            await refreshToken();
        }

        if (deltaTime < 0 ) {
            console.log("JWT is expired !!")
            return NextResponse.redirect(new URL( '/', request.url)); 
        }
    }

    if (verifiedJWT && verifiedJWT.exp && verifiedJWT.exp > currentTime) {
        if (verifiedJWT.twoFactorAuthenticated) {
            if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/firstLogin') {
                console.log('JWT is already valid : Redirecting to /home');
                return NextResponse.redirect(new URL('/home', request.url));
            }
        }
    }
    else {
        if (request.nextUrl.pathname !== '/' && request.nextUrl.pathname !== '/firstLogin' && request.nextUrl.pathname !== '/auth/2fa') {
            console.log(`Not logged in, redirecting to /: ${request.nextUrl.pathname}}`);
            return NextResponse.redirect(new URL( '/', request.url)); 
        }
        return NextResponse.next();
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
        throw new Error(`JWT token is not valid:  + ${error}`);
    }
}
