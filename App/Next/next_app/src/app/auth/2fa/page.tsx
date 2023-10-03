import AuthTwoFA from "../../components/auth/TwoFA/AuthTwoFA";
import getJwt from '@/app/utils/getJwt';

export default async function TwoFAAuth() {

    const payload = await getJwt();
    if (payload === null || payload === undefined || payload.sub === undefined) {
        return ;
    }

    return (
        <div className="flex flex-col flex-auto items-center justify-center">
            <AuthTwoFA userId={payload.sub}></AuthTwoFA>
        </div>
    )
}