
const CustomBtn = ({children, onClick, id="", disable=false} : {children: any, onClick: () => void, id: string, disable: boolean}) => {
    return (
        <button
            type="button"
            id={id}
            disabled={disable}
            style={{opacity: disable? 0.5 : 1}}
            // className="font-bold text-sm rounded-lg text-base bg-mauve hover:bg-pink drop-shadow-xl m-4 p-3" 
            className="button-mauve m-4 p-3" 
            onClick={onClick}>
            {children}
        </button>
    );
}

export default CustomBtn;