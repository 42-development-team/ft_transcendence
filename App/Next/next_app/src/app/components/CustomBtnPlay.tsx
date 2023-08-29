const CustomBtn = (
        {
            children,
            onClick, id="",
            color="bg-mauve",
            disable=false,
            anim=true,
			height=120,
			width=240,
        }
            :
        {
            children: any,
            onClick: () => void,
            id?: string,
            color?: string,
            disable: boolean,
            anim?: boolean
			height?: number,
			width?: number,
        }
    ) => {
    return (
        <button
            type="button"
            id={id}
            disabled={disable}
            style={{opacity: disable? 0.5 : 1}}
            className={` ${anim && ' text-[2rem] focus:ring-4 shadow-lg transform active:scale-75 transition-transform'}
			${disable && 'bg-transparent'}
			h-[${height}px] w-[${width}px] font-bold text-2xl rounded-lg text-base ${color} disabled:pointer-events-none
			hover:bg-pink drop-shadow-xl m-4 p-3 flex justify-center items-center`}
            onClick={onClick}>
            {children}
        </button>
    );
}

export default CustomBtn;
