import { useRouter } from 'next/navigation'
import AuthTwoFA from "../../components/auth/AuthTwoFA";
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
            <AuthTwoFA userId={payload.sub}></AuthTwoFA>
        </div>
    )
}