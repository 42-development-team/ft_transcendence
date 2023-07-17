import {cookies} from "next/headers";

export const getJWTCookie = () => {
    const cookieStore = cookies();
    const jwt = cookieStore.get('jwt');
    return jwt;
}