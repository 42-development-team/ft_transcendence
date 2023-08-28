
import TwoFA from "../components/auth/TwoFA";
import getJwt from '@/app/utils/getJwt';
import { useRouter } from "next/navigation";
import Avatar from "../components/profile/Avatar";
import SettingsPage from "../components/settings/settingsPage";

export default async function Settings() {

    const payload = await getJwt();
    if (payload === null || payload === undefined || payload.sub === undefined) {
        const router = useRouter();
        router.push('/');
        return;
    }
    
    const userId = payload.sub;



    return (
        <div className="flex flex-col w-full">
            <SettingsPage userId={userId}></SettingsPage>
            <div className="flex flex-row justify-center">
                <TwoFA userId={userId}></TwoFA>
            </div>
        </div>
    )
}