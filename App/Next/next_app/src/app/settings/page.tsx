import TwoFASettingsManagement from "../components/auth/2faSettingsManagement";
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers'
import { useRouter } from 'next/navigation'

export default function Settings() {
    const cookieStore = cookies();
    const userId: RequestCookie | undefined = cookieStore.get('userId');
    if (userId === undefined) {
        const router = useRouter();
        router.push('/');
        return ;
    }
    return (
        <div className="flex flex-col flex-auto justify-center ">
            <TwoFASettingsManagement userId={userId}></TwoFASettingsManagement>
        </div>
    )
  }