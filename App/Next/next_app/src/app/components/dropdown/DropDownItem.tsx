import { ReactNode } from "react"

type DropDownActionProps = {
    children: ReactNode
    onClick: () => void
}

export const DropDownAction = ({children, onClick } : DropDownActionProps) => {
    return (
        <button onClick={onClick} id="dropdownAction"
            className="text-left text-text w-full block px-4 py-2 text-sm hover:bg-surface1 rounded-md">
            {children}
        </button>
    )
}

export const DropDownActionRed = ({children, onClick } : DropDownActionProps) => {
    return (
        <button onClick={onClick} id="dropdownAction"
            className="text-left text-text w-full block px-4 py-2 text-sm hover:bg-red hover:font-[550] hover:text-mantle rounded-md">
            {children}
        </button>
    )
}

export const DropDownActionLarge = ({children, onClick } : DropDownActionProps) => {
    return (
        <button onClick={onClick} id="dropdownAction"
            className="  text-left w-full block px-4 py-2 text-lg group hover:bg-surface1 rounded-md">
            {children}
        </button>
    )
}

export const DropDownSeparator = () => {
    return (
        <div className="bg-surface1 h-[1px] rounded-sm m-1"></div>
    )
}