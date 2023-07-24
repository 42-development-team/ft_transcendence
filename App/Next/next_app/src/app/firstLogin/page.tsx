import { cookies } from 'next/headers'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { useRouter } from 'next/navigation'
import FirstLoginPageComponent from '../components/auth/FirstLoginPage';
import { middleware, verifyJWT } from '@/middleware';

function parseJwt(token: string) {
    if (!token) { return; }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}

export default function FirstLogin() {

    const cookieStore = cookies();
    const jwt: RequestCookie | undefined = cookieStore.get('jwt'); // ==== NOT USER ID ANYMORE
    if (jwt === undefined || jwt.value === null) {
        const router = useRouter();
        router.push('/');
        return ;
    }
    console.log("firstLogin/page.tsx jwt", jwt);
    const payload = parseJwt(jwt.value);
    return (
        <FirstLoginPageComponent userId={payload.sub}/>
    )
}