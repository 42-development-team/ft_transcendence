"use client";

import { useContext, useEffect, useState } from "react";
import themeContext from "../theme/themeContext";



const Logo = () => {

    const { theme } = useContext(themeContext);
    let storage = typeof window !== "undefined" ? localStorage.getItem("theme") : "mocha";
    const [colorText, setColorText] = useState<string>(storage === "latte" ? "text-[#e7a446]" : "text-[#f0f471]");
    const [neonColor, setNeonColor] = useState<string>(storage === "latte" ? "#e7a446" : "#0073e6");

    useEffect(() => {
        if (theme === "latte") {
            setColorText("text-[#e7a446]");
            setNeonColor("#ea76cb");
        } else {
            setColorText("text-[#e7a446]");
            setNeonColor("#cba6f9");
        }
    }, [theme]);

    return (
        <div
            className={`flex cyber pointer-events-none ` + colorText}
            style={{
                fontSize: '13vw',
                fontFamily: "Cy",
                textShadow: `0 0 35px black ,4px 4px 10px black, 0 0 15px ${neonColor}, 0 0 20px ${neonColor}, 0 0 25px ${neonColor}, 0 0 30px ${neonColor}`,
                userSelect: "none",
            }}>
            <span style={{ letterSpacing: '-3vw' }}>P</span>ONG
        </div>
    )
}

export default Logo;