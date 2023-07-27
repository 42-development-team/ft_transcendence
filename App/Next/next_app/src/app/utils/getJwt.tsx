import { jwtVerify } from "jose";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

const getJwt = async () => {
	const cookieStore = cookies();
    const jwt: RequestCookie | undefined = cookieStore.get('jwt');
    if (jwt === undefined || jwt.value === null)
		  return null;
    const verifiedJwt = await jwtVerify(jwt.value,
        new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return verifiedJwt.payload;
}

export default getJwt;