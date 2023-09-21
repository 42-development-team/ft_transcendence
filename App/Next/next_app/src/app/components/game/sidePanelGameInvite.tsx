"use client";

import { useAuthContext } from "@/app/context/AuthContext";
import GameInviteContext from "@/app/context/GameInviteContext";
import { use, useContext, useEffect, useState } from "react"
import ThemeContext from "../theme/themeContext";

const SidePanelGameInvite = () => {
    const { userId } = useAuthContext();
    const { mode, invitedBy, respondToInvite, inviteSent, cancelInvite } = useContext(GameInviteContext);
    const [slide, setSlide] = useState("translateX(0%)"); //TODO : set to 100%
    const { theme } = useContext(ThemeContext);
    const [backgroundColor, setBackgroundColor] = useState(theme === "latte" ? "black" : "white");
    const [textColor, setTextColor] = useState(theme === "latte" ? "white" : "black");
    const [borderColor, setBorderColor] = useState(theme === "latte" ? "white" : "black");
    const [disable, setDisable] = useState(false);

    const onChange = (accept: boolean) => {
        setSlide("translateX(100%)");
        setTimeout(() => {
            if (accept) {
                respondToInvite(invitedBy, true);
            } else {
                respondToInvite(invitedBy, false);
            }
        }, 700);
    }

    const cancel = () => {
        setSlide("translateX(100%)");
        cancelInvite(userId)
    }

    useEffect(() => {
        if (theme === "latte") {
            setBackgroundColor("#bcc0cc");
            setTextColor("#df8e1d");
            setBorderColor("white");
        } else {
            setBackgroundColor("#313244");
            setTextColor("#f9e2af");
            setBorderColor("#f9e2af");
        }
    }, [theme])

    return (
        <div >
            {/* {invitedBy !== "" && */}
            <div
                style={{
                    position: 'fixed',
                    borderLeft: `1px solid ${borderColor}`,
                    borderTop: `1px solid ${borderColor}`,
                    borderBottom: `1px solid ${borderColor}`,
                    borderTopLeftRadius: '10px',
                    borderBottomLeftRadius: '10px',
                    borderRight: 'none',
                    top: 70,
                    right: 0,
                    width: '301px',
                    height: '80px',
                    backgroundColor: backgroundColor,
                    padding: '2px',
                    boxSizing: 'border-box',
                    transform: slide,
                    transition: 'transform 0.7s ease-out',
                    color: textColor,
                    opacity: 0.9,
                }}>
                < div className="flex flex-col">
                    <div className="flex  justify-center mb-2">
                        {invitedBy} want to play
                    </div>
                    <div className="flex justify-evenly w-full flex-row">
                        <div className="flex m-2">
                            <button
                                type="button"
                                disabled={disable}
                                style={{ opacity: disable ? 0.5 : 1 }}
                                className={`focus:ring-4 shadow-lg transform active:scale-75 transition-transform'} font-bold text-sm rounded-lg text-base ${buttonColor} disabled:pointer-events-none hover:bg-pink drop-shadow-xl m-4 p-3`}
                                onClick={() => onChange(true)}>
                                ACCEPT
                            </button>
                        </div>
                        <div className="flex m-2">
                            <button
                                type="button"
                                disabled={disable}
                                style={{ opacity: disable ? 0.5 : 1 }}
                                className={`focus:ring-4 shadow-lg transform active:scale-75 transition-transform'} font-bold text-sm rounded-lg text-base ${buttonColor} disabled:pointer-events-none hover:bg-pink drop-shadow-xl m-4 p-3`}
                                onClick={() => onChange(false)}>
                                DECLINE
                            </button>
                        </div>
                    </div>
                </div>

                {/* } */}
                {inviteSent &&
                    <div className="m-2">
                        <button
                            type="button"
                            disabled={disable}
                            style={{ opacity: disable ? 0.5 : 1 }}
                            className={`focus:ring-4 shadow-lg transform active:scale-75 transition-transform'} font-bold text-sm rounded-lg text-base ${buttonColor} disabled:pointer-events-none hover:bg-pink drop-shadow-xl m-4 p-3`}
                            onClick={cancel}>
                            CANCEL
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}

export default SidePanelGameInvite