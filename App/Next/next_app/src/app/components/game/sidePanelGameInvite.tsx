"use client";

import { useAuthContext } from "@/app/context/AuthContext";
import GameInviteContext from "@/app/context/GameInviteContext";
import { useContext, useState } from "react"

const SidePanelGameInvite = () => {
    const { userId } = useAuthContext();
    const { mode, invitedBy, respondToInvite, inviteSent, cancelInvite } = useContext(GameInviteContext);
    const [slide, setSlide] = useState("translateX(0%)");

    const onChange = (accept: boolean) => {
        setSlide("translateX(100%)");
        if (accept) {
            respondToInvite(invitedBy, true);
        } else {
            respondToInvite(invitedBy, false);
        }
    }

    const cancel = () => {
        setSlide("translateX(100%)");
        cancelInvite(userId)
    }

    return (
        <div>
            {/* {invitedBy !== "" && */}
                <div style={{position: 'fixed', borderColor: 'blue', border: '4px', flex: 'col',  top: 120, right: 0, width: '301px', height: '80px', backgroundColor: 'orange', padding: '20px', boxSizing: 'border-box', transform: slide, transition: 'transform 0.3s ease-out'}}>
                    <div className="m-2">
                    <button onClick={() => onChange(true)} >
                        ACCEPT
                    </button>
                    </div>
                    <div className="m-2">
                        <button onClick={() => onChange(false)}>
                            DECLINE
                        </button>
                    </div>
                </div>
            {/* } */}
            {inviteSent &&
                <div className="m-2">
                    <button onClick={ cancel }>
                        CANCEL
                    </button>
                </div>
            }
        </div>
    )
}

export default SidePanelGameInvite