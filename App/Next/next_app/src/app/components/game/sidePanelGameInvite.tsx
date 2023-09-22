"use client";

import { useAuthContext } from "@/app/context/AuthContext";
import GameInviteContext from "@/app/context/GameInviteContext";
import { use, useContext, useEffect, useState } from "react"
import ThemeContext from "../theme/themeContext";
import { CustomBtnGameInvite } from "../CustomBtnGameInvite";
import { type } from "os";
import sessionStorageUser from "../profile/sessionStorage";
import getUserNameById from "../utils/getUserNameById";

const SidePanelGameInvite = () => {
    const { userId } = useAuthContext();
    const { mode, invitedBy, respondToInvite, inviteSent, setInviteSent, cancelInvite, message } = useContext(GameInviteContext);
    const [receiveVisible, setReceiveVisible] = useState(false);
    const [sentVisible, setSentVisible] = useState(false);
    const [slide, setSlide] = useState("translateX(100%)");
    const { theme } = useContext(ThemeContext);
    const [backgroundColor, setBackgroundColor] = useState(theme === "latte" ? "#6c6f85" : "#313244");
    const [textColor, setTextColor] = useState(theme === "latte" ? "#eff1f5" : "#f9e2af");
    const [borderColor, setBorderColor] = useState(theme === "latte" ? "#eff1f5" : "#f9e2af");
    const [buttonColor, setButtonColor] = useState(theme === "latte" ? "bg-[#8839ef]" : "bg-[#f5c2e7]");
    const [hoverColor, setHoverColor] = useState(theme === "latte" ? "hover:bg-[#ea76cb]" : "hover:bg-[#cba6f7]");
    const [currentUserId, setCurrentUserId] = useState(typeof window !== "undefined" ? localStorage.getItem("userId") : "");
    const [currentUserName, setCurrentUserName] = useState("");
    const [lockSubmit, setLockSubmit] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false);
    const [timer, setTimer] = useState(20);
    const [disable, setDisable] = useState(true);


    const sidePanelStyle: React.CSSProperties = {
        position: 'fixed',
        borderLeft: `1px solid ${borderColor}`,
        borderTop: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
        borderTopLeftRadius: '10px',
        borderBottomLeftRadius: '10px',
        borderRight: 'none',
        top: 150,
        right: 0,
        width: '301px',
        height: '85px',
        backgroundColor: backgroundColor,
        padding: '2px',
        boxSizing: 'border-box',
        transform: slide,
        transition: 'transform 0.6s ease-out',
        color: textColor,
        opacity: 1,
        zIndex: 1000
    };


    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
        return () => {
            clearInterval(countdown);
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

    useEffect(() => {
        if (invitedBy || inviteSent) {
            if (invitedBy) {
                setReceiveVisible(true);
                setSentVisible(false);
            } else {
                setReceiveVisible(false);
                setSentVisible(true);
            }
            setTimer(20);
            setSlide("translateX(0%)");
        } else {
            setSlide("translateX(100%)");
            setSentVisible(false);
            setReceiveVisible(false);
        }
    }, [invitedBy, inviteSent])

    useEffect(() => {
        if (invitedBy || inviteSent) {
            if (invitedBy) {
                setReceiveVisible(true);
                setSentVisible(false);
            } else {
                setReceiveVisible(false);
                setSentVisible(true);
            }
            setSlide("translateX(0%)");
        } else {
            setSlide("translateX(100%)");
            setSentVisible(false);
            setReceiveVisible(false);
        }
    }, [])

    useEffect(() => {
        const currUser = sessionStorageUser();
        const getCurrentInfo = async () => {
            if (currUser) {
                setCurrentUserId(currUser);
                setCurrentUserName(await getUserNameById(currUser));
                setDisable(false);
            }
        }
        getCurrentInfo();
    }, [userId])

    const cancel = () => {
        setSlide("translateX(100%)");
        setSentVisible(false);
        setInviteSent(false);
        cancelInvite(currentUserId as string)
    }

    const handleAction = (action: () => void) => {
        if (lockSubmit) return;
        setLockSubmit(true);
        action();
        setIsOpen(false);
        setTimeout(() => setLockSubmit(false), 1500);
    }

    const onChange = (accept: boolean) => {
        setSlide("translateX(100%)");
        setTimeout(() => {
            respondToInvite(invitedBy, accept);
        }, 700);
    }

    return (
        <div >
            <div
                style={sidePanelStyle}>
                {receiveVisible &&
                    < div className="flex flex-col">
                        <div className="flex  justify-center my-1">
                            {message ? <span>{message}</span> : <span>{currentUserName} want to play ({timer})</span>}{/* TODO: here put username */}
                        </div>
                        { !message &&
                        <div className="flex justify-evenly w-full flex-row">
                            <CustomBtnGameInvite text="ACCEPT" response={true} disable={disable} onChange={() => handleAction(() => onChange)} buttonColor={buttonColor} hoverColor={hoverColor} />
                            <CustomBtnGameInvite text="DECLINE" response={false} disable={disable} onChange={() => handleAction(() => onChange)} buttonColor={buttonColor} hoverColor={hoverColor} />
                        </div>
                        }
                    </div>
                }
                {sentVisible &&
                    <div className="flex flex-col items-center justify-center my-1">
                        {message ? <span>{message}</span> : <span>Waiting for user...</span>}
                        {/* TODO: here put username */}
                        <CustomBtnGameInvite text="CANCEL" response={false} disable={false} onChange={cancel} buttonColor={buttonColor} hoverColor={hoverColor} />
                    </div>
                }
            </div>
        </div>
    )
}

export default SidePanelGameInvite