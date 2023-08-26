
import TwoFA from "../components/auth/TwoFA";
import getJwt from '@/app/utils/getJwt';
import { useRouter } from "next/navigation";
import Avatar from "../components/profile/Avatar";

export default async function Settings() {

    const payload = await getJwt();
    if (payload === null || payload === undefined || payload.sub === undefined) {
        const router = useRouter();
        router.push('/');
        return;
    }
    const userId = payload.sub;

    return (
        <div className="flex flex-col justify-center ">
            <Avatar userId={userId} disableChooseAvatar={false} disableImageResize={true}></Avatar>
            <TwoFA userId={userId}></TwoFA>
        </div>
    )
}