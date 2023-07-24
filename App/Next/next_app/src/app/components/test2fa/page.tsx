import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers'
import { useRouter } from 'next/navigation'
import Test2FA from "../../components/auth/test2FAComponent";

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
            <Test2FA userId={userId}></Test2FA >
        </div>
    )
}