import { useRouter } from 'next/navigation'
import FirstLoginPageComponent from '../components/auth/FirstLoginPage';
import getJwt from '../utils/getJwt';


export default async function FirstLogin() {

    const payload = await getJwt();
    if (payload === null || payload === undefined || payload.sub === undefined) {
        const router = useRouter();
        router.push('/');
        return ;
    }

    return (
        <FirstLoginPageComponent userId={payload.sub}/>
    )
}