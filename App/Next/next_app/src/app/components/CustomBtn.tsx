
const CustomBtn = ({children, onClick } : {children: any, onClick: () => void}) => {
    return (
        <button
            type="button"
            className="font-bold text-sm rounded-lg text-base bg-mauve hover:bg-pink drop-shadow-xl m-4 p-3" 
            onClick={onClick}>
            {children}
        </button>
    );
}

export default CustomBtn;