import { createContext } from "react";

const GameInviteContext = createContext({
    invitedBy: "",
    setInvitedBy: (invitedBy: string) => {}
});

export default GameInviteContext;