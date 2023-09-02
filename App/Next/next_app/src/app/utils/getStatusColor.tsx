import { UserStatus } from "@/app/utils/models";

export const getStatusColor = (currentStatus: UserStatus): string => {
    switch (currentStatus) {
        case UserStatus.Online: return "bg-green";
        case UserStatus.Offline: return "bg-overlay0";
        case UserStatus.InGame: return "bg-blue";
    }
}
