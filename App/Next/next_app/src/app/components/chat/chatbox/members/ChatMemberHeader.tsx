import { ReactNode } from "react"

const ChatMemberHeader = ({children}: {children: ReactNode}) => {
    return (
        <div className='flex items-center justify-around py-2 my-2 '>
            <span className='font-semibold text-sm'>
                {children}
            </span>
        </div>
    )
}

export default ChatMemberHeader;
