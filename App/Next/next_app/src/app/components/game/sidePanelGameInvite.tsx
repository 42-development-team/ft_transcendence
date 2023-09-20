"use client";

import GameInviteContext from "@/app/context/GameInviteContext";
import { useContext } from "react"

const SidePanelGameInvite = () => {
    const { mode, invitedBy, respondToInvite } = useContext(GameInviteContext);
    return (
        <div>
            {invitedBy !== "" &&
            <button onClick={() => respondToInvite(invitedBy, true)}>
                ACCEPT
            </button>
        }
        </div>
    )
}

export default SidePanelGameInvite