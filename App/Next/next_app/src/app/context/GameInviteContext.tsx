import { createContext } from "react";

const GameInviteContext = createContext({
    invitedBy: "",
    setInvitedBy: (invitedBy: string) => {},
    inviteToPlay: (userId: string, modeEnabled: boolean) => {},
    respondToInvite: (userId: string, response: boolean) => {},
    cancelInvite: (userId: string, socket:any) => {},
    inviteSent: false,
    setInviteSent: (inviteSent: boolean) => {},
    mode: false,
    setMode: (mode: boolean) => {},
});

export default GameInviteContext;