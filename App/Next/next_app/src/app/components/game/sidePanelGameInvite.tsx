"use client";

import { useAuthContext } from "@/app/context/AuthContext";
import GameInviteContext from "@/app/context/GameInviteContext";
import { use, useContext, useEffect, useState } from "react"
import ThemeContext from "../theme/themeContext";
import { CustomBtnGameInvite } from "../CustomBtnGameInvite";

const SidePanelGameInvite = () => {
    const { userId } = useAuthContext();
    const { mode, invitedBy, respondToInvite, inviteSent, cancelInvite } = useContext(GameInviteContext);
    const [slide, setSlide] = useState("translateX(0%)"); //TODO : set to 100%
    const { theme } = useContext(ThemeContext);
    const [backgroundColor, setBackgroundColor] = useState(theme === "latte" ? "#6c6f85" : "#313244");
    const [textColor, setTextColor] = useState(theme === "latte" ? "#eff1f5" : "#f9e2af");
    const [borderColor, setBorderColor] = useState(theme === "latte" ? "#eff1f5" : "#f9e2af");
    const [buttonColor, setButtonColor] = useState(theme === "latte" ? "bg-[#8839ef]" : "bg-[#f5c2e7]");
    const [hoverColor, setHoverColor] = useState(theme === "latte" ? "hover:bg-[#ea76cb]" : "hover:bg-[#cba6f7]");
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

    return (
        <div >
            {(inviteSent || invitedBy) &&
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
                        height: '85px',
                        backgroundColor: backgroundColor,
                        padding: '2px',
                        boxSizing: 'border-box',
                        transform: slide,
                        transition: 'transform 0.7s ease-out',
                        color: textColor,
                        opacity: 0.9,
                    }}>
                    {!inviteSent &&
                        < div className="flex flex-col">
                            <div className="flex  justify-center my-1">
                                {invitedBy} want to play
                            </div>
                            <div className="flex justify-evenly w-full flex-row">
                                <CustomBtnGameInvite text="ACCEPT" response={true} disable={disable} onChange={onChange} buttonColor={buttonColor} hoverColor={hoverColor} />
                                <CustomBtnGameInvite text="DECLINE" response={false} disable={disable} onChange={onChange} buttonColor={buttonColor} hoverColor={hoverColor} />
                            </div>
                        </div>
                    }
                    {inviteSent &&
                        <div className="flex flex-col items-center justify-center my-1">
                            Waiting for user... {/* here put username */}
                        <CustomBtnGameInvite text="CANCEL" response={false} disable={false} onChange={cancel} buttonColor={buttonColor} hoverColor={hoverColor} />
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default SidePanelGameInvite