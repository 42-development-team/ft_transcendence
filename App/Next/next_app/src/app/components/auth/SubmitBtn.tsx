"use client"
const SubmitBtn = (
    {
        children,
        disabled=false,
        displayBox=false,
        handleOnKeyDown=() => {},
        handleSubmit=() => {}
    }
    :
    {
        children: any,
        disabled?: boolean,
        displayBox?: Boolean,
        handleOnKeyDown: any,
        handleSubmit: any  
    }) => 
{
    return (
            displayBox &&
            <button
                className={
                    disabled ? `opacity-50 focus:ring-4 shadow-lg transform active:scale-75 transition-transform 
                                font-bold text-sm rounded-lg text-base bg-mauve hover:bg-pink drop-shadow-xl m-4 p-3` 
                                : `focus:ring-4 shadow-lg transform active:scale-75 transition-transform font-bold text-sm rounded-lg 
                                text-base bg-mauve hover:bg-pink drop-shadow-xl m-4 p-3` 
                }
                id="codeSubmit"
                onKeyDown={(e) => handleOnKeyDown(e)}
                onClick={handleSubmit}
                disabled={disabled}
            >
                {children}
            </button>
    );
}

export default SubmitBtn;