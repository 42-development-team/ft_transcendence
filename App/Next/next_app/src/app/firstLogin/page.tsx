import UserSettingsComponent from '../components/settings/UserSettings';
import getJwt from '../utils/getJwt';

export default async function FirstLogin() {
    const payload = await getJwt();
    if (payload === null || payload === undefined || payload.sub === undefined) {
        return ;
    }

    return (
        <UserSettingsComponent userId={payload.sub} onSettings={false}/>
    )
}
