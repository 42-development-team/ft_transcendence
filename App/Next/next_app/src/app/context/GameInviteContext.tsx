import { createContext } from "react";

const GameInviteContext = createContext({
    invitedBy: "",
    setInvitedBy: (invitedBy: string) => {},
    inviteToPlay: (userId: string, modeEnabled: boolean) => {},
    respondToInvite: (invitorId: string, response: boolean) => {},
    cancelInvite: (invitorId: string) => {},
    inviteSent: false,
    setInviteSent: (inviteSent: boolean) => {},
    mode: false,
    setMode: (mode: boolean) => {},
});

export default GameInviteContext;