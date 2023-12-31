import { useState } from "react";

const CustomBtn = (
        {
            children,
            onClick, id="",
            fontFam="Roobert",
            onChange,
            changeMode,
            mode,
            color="bg-peach",
            disable=false,
            anim=true,
			height=120,
			width=240,
        }
            :
        {
            children: any,
            onClick: () => void,
            fontFam?: string,
            changeMode?: () => void,
            onChange?: () => void,
            mode?: boolean,
            id?: string,
            color?: string,
            disable: boolean,
            anim?: boolean
			height?: number,
			width?: number,
        }
    ) => {
    const [modeActivated, setModeActivated] = useState<string>(mode ? "h1 " : "");
    const onChangeMode = () => {
        if (mode === false) {
            setModeActivated("h1");
        } else {
            setModeActivated("");
        }
    }

    return (
        <div className="flex flex-col " style={{userSelect:"none"}}>
        <button
            type="button"
            id={id}
            disabled={disable}
            style={{opacity: disable? 0.5 : 1, fontSize: 28, fontFamily: fontFam, textShadow:' 0 0 15px ',   background: 'linear-gradient(to right, #e7a446 0%, #e7a446 35%, #fab387 100%)'}}
            className={` ${anim && ' text-lg focus:ring-4 shadow-lg transform active:scale-75 transition-transform'}
			h-[${height}px] w-[${width}px] font-bold text-2xl rounded-lg text-mantle ${color} 
            disabled:pointer-events-none disabled:bg-transparent hover:brightness-110
            m-4 p-3 `}
            onClick={onClick}>
            {children}
        </button>
        {changeMode &&
        <div className="flex flex-col items-center">
            <div className="relative inline-block h-4 w-8 cursor-pointer rounded-full mr-2 mb-2">
                <input
                    id="switch-mode"
                    type="checkbox"
                    className="peer absolute h-4 w-8 cursor-pointer appearance-none rounded-full bg-overlay0 transition-colors duration-300 checked:bg-pink-500 peer-checked:border-pink-500 peer-checked:before:bg-pink-500"
                    onClick={changeMode}
                    onChange={onChangeMode}
                    defaultChecked={mode}
                    />
                <label
                    htmlFor="switch-mode"
                    className={`before:content[''] absolute top-2/4 -left-1 h-5 w-5 -translate-y-2/4 cursor-pointer rounded-full border border-blue-gray-100 bg-white shadow-md transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-full peer-checked:border-pink-500 peer-checked:before:bg-pink-500`}
                    >
                <br />
                </label>
            </div>
                <div className={`flex flex-wrap text-yellow font-extrabold ` + modeActivated} style={{fontSize: 25, fontFamily: "Roobert"}}>
                MODE
                </div>
            </div>
        }
        </div>
    );
}

export default CustomBtn;
