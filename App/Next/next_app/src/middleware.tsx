import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { headers } from "next/headers";

const THREE_MINUTES = 60 * 3;
const TWENTY_NINE_MINUTES = 1780;

const refreshToken = async() => {
    await fetch(`${process.env.BACK_URL}/auth/refresh/`, { credentials: 'include' }).catch((error) => {
        console.log(error);
    });
}

export async function middleware(request: NextRequest) {
    let jwtCookie = request.cookies.get("jwt")?.value;
    let rtCookie = request.cookies.get("rt")?.value;

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
            console.log("JWT is expiring soon -> need to refresh !!");

            // const browserCookies = request.headers.get('cookie');
            // console.log(browserCookies);
            // if (jwtCookie === undefined || rtCookie === undefined) {
            //     return NextResponse.redirect(new URL('/', request.url)); 
            // }
            // let headers = new Headers({'jwt': jwtCookie, 'rt': rtCookie});

            // await refreshToken();
            // await fetch(`${process.env.BACK_URL}/auth/refresh/`, { credentials: 'include' })
            // .catch((error) => {
            //         console.log(error);
            // });

            await fetch(`${process.env.BACK_URL}/auth/refresh/`, 
            { credentials: 'include', headers: request.headers })
            .catch((error) => {
                throw new Error("Error fetching profile: " + error.message);
            }).then((response) => {
                // Note: why 'jwt' and 'rt' are duplicated?
                let jwt = response.headers.get('set-cookie')?.split(", ");
                console.log(jwt);
                // response.headers.forEach((value, key) => {
                //     console.log(`${key} = ${value}`);
                //     console.log("---");
                // });
                // // testHeaders = response.headers;
               
            //    resp.headers.set('test', 'test');
            //    resp.cookies.set('truc', 'truc');
            // //    console.log('truc');
            //    resp.headers.set('test', 'test');
               return NextResponse.redirect(new URL('/home', request.url)).headers.set('test', 'test');
                // request.headers.set('test', response.headers.get('jwt') as string);
                // request.headers.forEach((value, key) => {
                //    if (response.headers.has(key)) {
                //         request.headers.set(key, response.headers.get(key)?.toString() as string);
                //    }
                // });
                // console.log(response.json());
            });

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
