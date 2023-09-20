"use client";

import { useAuthContext } from "@/app/context/AuthContext";
import GameInviteContext from "@/app/context/GameInviteContext";
import { useContext } from "react"

const SidePanelGameInvite = () => {
    const { userId } = useAuthContext();
    const { mode, invitedBy, respondToInvite, inviteSent, cancelInvite } = useContext(GameInviteContext);
    return (
        <div>
            {invitedBy !== "" &&
                <div className="m-2">
                    <button onClick={async () => respondToInvite(invitedBy, true)}>
                        ACCEPT
                    </button>
                    <div className="m-2">
                        <button onClick={async () => respondToInvite(invitedBy, false)}>
                            DECLINE
                        </button>
                    </div>
                </div>
            }
            {inviteSent &&
                <div className="m-2">
                    <button onClick={async () => cancelInvite(userId)}>
                        CANCEL
                    </button>
                </div>
            }
        </div>
    )
}

export default SidePanelGameInvite