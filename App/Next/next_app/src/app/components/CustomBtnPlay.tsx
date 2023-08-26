const CustomBtn = (
        {
            children,
            onClick, id="", 
            color="bg-mauve", 
            disable=false,
            anim=true,
        } 
            : 
        {
            children: any, 
            onClick: () => void, 
            id?: string, 
            color?: string, 
            disable: boolean,
            anim?: boolean
        }
    ) => {
    return (
        <button
            type="button"
            id={id}
            disabled={disable}
            style={{opacity: disable? 0.5 : 1}}
            className={` ${anim && ' text-[2rem] focus:ring-4 shadow-lg transform active:scale-75 transition-transform'} ${disable && 'bg-gradient-to-br from-mauve via-teal to-mauve'}
			h-[120px] w-[240px] font-bold text-2xl rounded-lg text-base ${color} disabled:pointer-events-none 
			hover:bg-pink drop-shadow-xl m-4 p-3 flex justify-center items-center`}
            onClick={onClick}>
            {children}
        </button>
    );
}

export default CustomBtn;