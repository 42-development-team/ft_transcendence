import { ReactNode } from "react"

export const DropDownAction = ({children, onClick} : {children: ReactNode, onClick: () => void}) => {
    return (
        <button onClick={onClick}
            className="text-left w-full block px-4 py-2 text-sm hover:bg-surface0 rounded-md">
            {children}
        </button>
    )
}

export const DropDownActionRed = ({children, onClick} : {children: ReactNode, onClick: () => void}) => {
    return (
        <button onClick={onClick}
            className="text-left w-full block px-4 py-2 text-sm hover:bg-red hover:font-semibold hover:text-mantle rounded-md">
            {children}
        </button>
    )
}