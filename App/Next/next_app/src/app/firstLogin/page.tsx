import { cookies } from 'next/headers'
import LoginComponent from '@/components/auth/FirstLoginComponent'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { useRouter } from 'next/navigation'

export default function FirstLogin() {

    const cookieStore = cookies();
    const userId: RequestCookie | undefined = cookieStore.get('userId');
    if (userId === undefined || userId.value === null) {
        const router = useRouter();
        router.push('/');
        return ;
    }
    return (
        <LoginComponent userId={userId}/>
    )
}