import { createContext } from "react";

const GameInviteContext = createContext({
    invitedBy: "",
    setInvitedBy: (invitedBy: string) => {},
    inviteToPlay: (userId: string, socket:any) => {},
    acceptInvite: (userId: string, socket:any) => {},
    declineInvite: (userId: string, socket:any) => {},
    cancelInvite: (userId: string, socket:any) => {},
    inviteSent: false,
    setInviteSent: (inviteSent: boolean) => {},
});

export default GameInviteContext;