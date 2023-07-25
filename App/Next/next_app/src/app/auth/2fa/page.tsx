import { useRouter } from 'next/navigation'
import Auth2faComponent from "../../components/auth/Auth2fa";
import getJwt from '@/app/utils/getJwt';

export default async function TwoFAAuth() {

    const payload = await getJwt();
    if (payload === null || payload === undefined || payload.sub === undefined) {
        const router = useRouter();
        router.push('/');
        return ;
    }

    return (
        <div className="flex flex-col flex-auto items-center justify-center">
            <Auth2faComponent userId={payload.sub}></Auth2faComponent>
        </div>
    )
}