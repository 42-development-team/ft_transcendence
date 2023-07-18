import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
    // let jwtCookie = request.cookies.get("jwt")?.value;
    // console.log("middleware + jwtCookie: " + jwtCookie);

    // let verifiedJWT = jwtCookie && (await verifyJWT(jwtCookie).catch((error) => {
    //     console.log(error);
    // }));
    
    // // Todo: refresh token if expired or expiring soon
    // const currentTime = Math.floor(Date.now() / 1000);
    // if (verifiedJWT && verifiedJWT.exp) {
    //     const deltaTime = verifiedJWT.exp - currentTime;
    //     if (deltaTime < 0 ) {
    //         console.log("JWT is expired !!")
    //     }
    // }

    // if (verifiedJWT && verifiedJWT.exp && verifiedJWT.exp > currentTime) {
    //     if (request.nextUrl.pathname === '/') {
    //         console.log('Redirecting to /home');
    //         return NextResponse.redirect(new URL('/home', request.url));
    //     }
    // }
    // else {
    //     if (request.nextUrl.pathname !== '/' && request.nextUrl.pathname !== '/FirstLogin') {
    //         return NextResponse.redirect(new URL( '/', request.url)); 
    //     }
    //     return NextResponse.next();
    // }
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
        throw new Error('JWT token is not valid');
    }
}
