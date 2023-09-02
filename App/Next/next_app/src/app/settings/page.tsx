import TwoFA from "../components/auth/TwoFA";
import getJwt from '@/app/utils/getJwt';
import { useRouter } from "next/navigation";
import SettingsPage from "../components/settings/settingsPage";
import Chat from "../components/chat/Chat";

export default async function Settings() {

    const payload = await getJwt();
    if (payload === null || payload === undefined || payload.sub === undefined) {
        const router = useRouter();
        router.push('/');
        return;
    }
    
    const userId = payload.sub;

    return (
        <div className="flex flex-auto w-full h-full">
			<Chat userId={userId}/>
				<div className="flex flex-col w-full h-[calc(100vh-48px)] justify-center">
				<SettingsPage userId={userId}></SettingsPage>
				<div className="flex flex-row justify-center">
					<TwoFA userId={userId}></TwoFA>
				</div>
			</div>
        </div>
    )
}