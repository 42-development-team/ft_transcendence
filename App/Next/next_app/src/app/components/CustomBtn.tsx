
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
            id: string, 
            color: string, 
            disable: boolean,
            anim: boolean
        }
    ) => {
    return (
        <button
            type="button"
            id={id}
            disabled={disable}
            style={{opacity: disable? 0.5 : 1}}
            className={` ${anim && 'focus:ring-4 shadow-lg transform active:scale-75 transition-transform'} font-bold text-sm rounded-lg text-base ${color} hover:bg-pink drop-shadow-xl m-4 p-3`}
            // className={`${color} m-4 p-3`} 
            onClick={onClick}>
            {children}
        </button>
    );
}

export default CustomBtn;