import { cookies } from 'next/headers'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { useRouter } from 'next/navigation'
import FirstLoginPageComponent from '../components/auth/FirstLoginPage';

const SETTINGS: number = 2;
const FIRSTLOGIN: number = 1;

export default function FirstLogin() {

    const cookieStore = cookies();
    const userId: RequestCookie | undefined = cookieStore.get('userId');
    if (userId === undefined || userId.value === null) {
        const router = useRouter();
        router.push('/');
        return ;
    }
    return (
        <FirstLoginPageComponent userId={userId} whichPage={IRSTLOGIN}/>
    )
}