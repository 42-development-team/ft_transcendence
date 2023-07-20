import { cookies } from 'next/headers'
import LoginComponent from '@/components/auth/LoginComponent'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export default function FirstLogin() {

    const cookieStore = cookies();
    const userId: RequestCookie | undefined = cookieStore.get('userId');

    return (
        <LoginComponent userId={userId}/>
    )
}