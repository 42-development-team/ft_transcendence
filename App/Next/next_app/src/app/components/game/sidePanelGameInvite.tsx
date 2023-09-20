"use client";

import GameInviteContext from "@/app/context/GameInviteContext";
import { useContext } from "react"

const SidePanelGameInvite = () => {
    const { mode, invitedBy, respondToInvite } = useContext(GameInviteContext);
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
        </div>
    )
}

export default SidePanelGameInvite