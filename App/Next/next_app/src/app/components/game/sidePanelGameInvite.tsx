"use client";

import GameInviteContext from "@/app/context/GameInviteContext";
import { useContext, useEffect, useState } from "react"
import ThemeContext from "../theme/themeContext";
import { CustomBtnGameInvite } from "../CustomBtnGameInvite";

const SidePanelGameInvite = () => {
    const { invitedBy, respondToInvite, cancelInvite, message, slide, receiveVisible, sentVisible, timer, setTimer, invitorUsername, invitedUsername } = useContext(GameInviteContext);
    const { theme } = useContext(ThemeContext);
    const [backgroundColor, setBackgroundColor] = useState(theme === "latte" ? "#6c6f85" : "#313244");
    const [textColor, setTextColor] = useState(theme === "latte" ? "#eff1f5" : "#f9e2af");
    const [borderColor, setBorderColor] = useState(theme === "latte" ? "#eff1f5" : "#f9e2af");
    const [buttonColor, setButtonColor] = useState(theme === "latte" ? "bg-[#8839ef]" : "bg-[#f5c2e7]");
    const [hoverColor, setHoverColor] = useState(theme === "latte" ? "hover:bg-[#ea76cb]" : "hover:bg-[#cba6f7]");
    const [currentUserId] = useState(typeof window !== "undefined" ? localStorage.getItem("userId") : "");
    const [lockSubmit, setLockSubmit] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false);
    const [disable, setDisable] = useState(true);

    /* PANEL STYLE */
    const sidePanelStyle: React.CSSProperties = {
        position: 'fixed',
        borderLeft: `1px solid ${borderColor}`,
        borderTop: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
        borderTopLeftRadius: '10px',
        borderBottomLeftRadius: '10px',
        borderRight: 'none',
        top: 50,
        right: 0,
        width: '301px',
        height: '95px',
        backgroundColor: backgroundColor,
        padding: '2px',
        boxSizing: 'border-box',
        transform: slide,
        transition: 'transform 0.4s ease-out',
        color: textColor,
        opacity: 0.9,
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
    };

    /* USE EFFECTS */
    useEffect(() => {
        const timerRef = setInterval(() => {
            setTimer((prevTimer: number) => prevTimer - 1);
        }, 1000);

        return () => {
            clearInterval(timerRef);
        };
    }, [timer]);


    useEffect(() => {
        if (theme === "latte") {
            setBackgroundColor("#6c6f85");
            setTextColor("#eff1f5");
            setBorderColor("#eff1f5");
            setButtonColor("bg-[#8839ef]");
            setHoverColor("hover:bg-[#ea76cb]");
        } else {
            setBackgroundColor("#313244");
            setTextColor("#f9e2af");
            setBorderColor("#f9e2af");
            setButtonColor("bg-[#f5c2e7]");
            setHoverColor("hover:bg-[#cba6f7]");
        }
    }, [theme])

    /* ACTIONS */
    const cancel = () => {
        cancelInvite(currentUserId as string)
    }

    const handleAction = (action: ( ) => any) => {
        if (lockSubmit) return;
        setLockSubmit(true);
        action( );
        setIsOpen(false);
        setTimeout(() => setLockSubmit(false), 1600);
    }

    const onChange = (accept: boolean) => {
        console.log("accept", accept);
        respondToInvite(invitedBy, accept);
    }

    return (
        <div >
            <div
                style={sidePanelStyle}>
                {receiveVisible &&
                    < div className="flex flex-col items-center justify-center my-1 text-lg font-semibold">
                        <div className="mb-2">
                            {message !== ""? <span>{message}</span> : <span>{invitorUsername} want to play ({timer})</span>}{/* TODO: here put username */}
                        </div>
                        {message === "" &&
                            <div className="flex justify-evenly w-full flex-row">
                                <CustomBtnGameInvite text="ACCEPT" response={true} disable={disable} handleAction={handleAction} onChange={onChange} buttonColor={buttonColor} hoverColor={hoverColor} />
                                <CustomBtnGameInvite text="DECLINE" response={false} disable={disable} handleAction={handleAction} onChange={onChange} buttonColor={buttonColor} hoverColor={hoverColor} />
                            </div>
                        }
                    </div>
                }
                {sentVisible &&
                    <div className="flex flex-col items-center justify-center my-1 text-lg font-semibold">
                        <div className="mb-2">
                            {message !== "" ? <span>{message}</span> : <span>Waiting for {invitedUsername}...</span>}
                        </div>
                        {message === "" &&
                            <CustomBtnGameInvite text="CANCEL" response={false} disable={false} handleAction={handleAction} onChange={cancel} buttonColor={buttonColor} hoverColor={hoverColor} />
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default SidePanelGameInvite