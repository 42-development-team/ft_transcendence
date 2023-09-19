import StatsWindow from "../components/profile/statsWindow";
import { UnderlineTabs } from "../components/profile/tabs";
import getJwt from '@/app/utils/getJwt';
import { useRouter } from "next/navigation";
import Chat from "@/components/chat/Chat";

export default async function Profile() {
    // Todo: move isFriend and addFriend functions to useFriend
    const payload = await getJwt();
    let userId = "";
    if (payload !== null && payload !== undefined) {
        userId = payload.sub as string;
    }
    else {
        const router = useRouter();
        router.push('/');
        return;
    }

    return ( //create a component for leader/matchhistory + fix z-index of Stats vs DropDownMenu
        <div className="flex w-full h-full">
            <Chat userId={userId} />
            <div className="flex h-[calc(100%-48px)] w-full">
                <div className="mx-[3vw] sm:mx-[7vw] my-[4vw] flex flex-col flex-grow">
                    <StatsWindow userId={userId} />
                    <UnderlineTabs userId={userId} />
                </div>
            </div>
        </div>
    )
}