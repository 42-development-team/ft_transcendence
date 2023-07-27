
import TwoFA from "../components/auth/TwoFA";
import getJwt from '@/app/utils/getJwt';
import { useRouter } from "next/navigation";

export default async function Settings() {

    const payload = await getJwt();
    if (payload === null || payload === undefined || payload.sub === undefined) {
        const router = useRouter();
        router.push('/');
        return;
    }

    return (
        <div className="flex flex-col flex-auto justify-center ">
            <TwoFA userId={payload.sub}></TwoFA>
        </div>
    )
  }