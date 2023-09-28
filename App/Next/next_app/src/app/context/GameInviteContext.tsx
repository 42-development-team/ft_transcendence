
import { MutableRefObject, createContext, useRef } from "react";

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
    setTimeoutId: (timeoutId: MutableRefObject<NodeJS.Timeout | null>) => {},
    message: "",
    setMessage: (message: string) => {},
    receiveVisible: false,
    setReceiveVisible: (receiveVisible: boolean) => {},
    sentVisible: false,
    setSentVisible: (sentVisible: boolean) => {},
    slide: "translateX(100%)",
    setSlide: (slide: string) => {},
    timer: 0,
    setTimer: (timer: any) => {},
    invitorUsername: "",
    setInvitorUsername: (invitorUsername: string) => {},
    invitedUsername: "",
    setInvitedUsername: (invitedUsername: string) => {},
    invitedId: "",
    setInvitedId: (invitedId: string) => {},
    inviteQueued: false,
    setInviteQueued: (inviteQueued: boolean) => {},

});

export default GameInviteContext;