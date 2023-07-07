
const CustomBtn = ({children, onClick } : {children: any, onClick: () => void}) => {
    return (
        <button
            type="button"
            className="button-mauve m-4 p-3" 
            onClick={onClick}>
            {children}
        </button>
    );
}

export default CustomBtn;