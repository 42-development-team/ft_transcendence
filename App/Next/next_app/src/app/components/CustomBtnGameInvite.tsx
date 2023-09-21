
export function CustomBtnGameInvite( {text, response, disable, onChange, buttonColor, hoverColor} : {text: string, response: boolean, disable: boolean, onChange: (response: boolean) => void, buttonColor: string, hoverColor: string}) {
    return (
        <div className="flex">
            <button
                type="button"
                disabled={disable}
                style={{ opacity: disable ? 0.5 : 1 }}
                className={`focus:ring-4 shadow-lg transform active:scale-75 transition-transform'} font-bold text-sm rounded-lg text-base ${buttonColor} disabled:pointer-events-none ${hoverColor} drop-shadow-xl  p-3`}
                onClick={() => onChange(response)}>
                {text}
            </button>
        </div>
    )
}