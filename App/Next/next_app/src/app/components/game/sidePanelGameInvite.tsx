"use client";

import { useAuthContext } from "@/app/context/AuthContext";
import GameInviteContext from "@/app/context/GameInviteContext";
import { use, useContext, useEffect, useState } from "react"
import ThemeContext from "../theme/themeContext";
import { text } from "stream/consumers";

const SidePanelGameInvite = () => {
    const { userId } = useAuthContext();
    const { mode, invitedBy, respondToInvite, inviteSent, cancelInvite } = useContext(GameInviteContext);
    const [slide, setSlide] = useState("translateX(0%)"); //TODO : set to 100%
    const {theme} = useContext(ThemeContext);
    const [backgroundColor, setBackgroundColor] = useState(theme === "latte" ? "black" : "white");
    const [textColor, setTextColor] = useState(theme === "latte" ? "white" : "black");

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

    useEffect(() => {
        if (theme === "latte") {
            setBackgroundColor("black");
            setTextColor("white");
        } else {
            setBackgroundColor("white");
            setTextColor("black");
        }
    }, [theme])
    
    return (
        <div >
            {/* {invitedBy !== "" && */}
            <div
            style={{
                position: 'fixed',
                borderColor: 'blue',
                border: '4px',
                top: 70,
                right: 0,
                width: '301px',
                height: '80px',
                backgroundColor: backgroundColor,
                padding: '2px',
                boxSizing: 'border-box',
                transform: slide,
                transition: 'transform 0.3s ease-out',
                color: textColor,
            }}>
                < div className="flex flex-col">
                    <div className="flex mb-2">
                        Invited by {invitedBy}
                    </div>
                    <div className="flex flex-row">
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
                </div>
            
            {/* } */}
            {inviteSent &&
                <div className="m-2">
                    <button onClick={cancel}>
                        CANCEL
                    </button>
                </div>
            }
            </div>
        </div>
    )
}

export default SidePanelGameInvite