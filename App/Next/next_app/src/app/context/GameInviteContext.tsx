import { createContext, useState } from "react";

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
    timeoutId: null,
    setTimeoutId: (timeoutId: NodeJS.Timeout | null) => {}
});

export default GameInviteContext;