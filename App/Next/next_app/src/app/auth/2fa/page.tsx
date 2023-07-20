import TwoFAAuthComponent from "../../components/auth/2faAuthManagement";
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers'
import { useRouter } from 'next/navigation'

export default function TwoFAAuth() {
    const cookieStore = cookies();
    const userId: RequestCookie | undefined = cookieStore.get('userId');
    if (userId === undefined || userId.value === null) {
        const router = useRouter();
        router.push('/');
        return ;
    }
    return (
        <div className="flex flex-col flex-auto items-center justify-center">
            <TwoFAAuthComponent userId={userId}></TwoFAAuthComponent>
        </div>
    )
}