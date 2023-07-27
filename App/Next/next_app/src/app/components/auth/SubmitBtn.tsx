"use client"
const SubmitBtn = (
    {
        children,
        displayBox=false,
        handleOnKeyDown=() => {},
        handleSubmit=() => {}
    }
    :
    {
        children: any,
        displayBox: Boolean,
        handleOnKeyDown: any,
        handleSubmit: any  
    }) => 
{
    return (
            displayBox &&
            <button
                className={`focus:ring-4 shadow-lg transform active:scale-75 transition-transform font-bold text-sm rounded-lg text-base bg-mauve hover:bg-pink drop-shadow-xl m-4 p-3`}
                id="codeSubmit"
                onKeyDown={(e) => handleOnKeyDown(e)}
                onClick={handleSubmit}
                {...children}
            >
                Submit
            </button>
    );
}

export default SubmitBtn;