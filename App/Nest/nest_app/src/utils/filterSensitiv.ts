import { CreateUserDto } from "src/users/dto";

export async function filterSensitiv(user: any) : Promise<CreateUserDto> {
    const rest: CreateUserDto = {
        login: user.login,
        username: user.username,
        avatar: user.avatar,
        twoFAsecret: '',
        isTwoFAEnabled: user.isTwoFAEnabled,
        isFirstLogin: user.isFirstLogin,
        currentStatus: user.currentStatus,
        socketIds: [],
    };
    return rest;
}