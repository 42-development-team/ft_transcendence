import { Tooltip } from '@material-tailwind/react';
import Image from 'next/image';
import collapseImg from "../../../../../public/collapse-left-svgrepo-com.svg"

type ChatHeaderProps = {
    title: string,
    onCollapse: () => void,
    children?: React.ReactNode
}

const ChatHeader = ({title, onCollapse, children}: ChatHeaderProps) => {
    return (
        <div className='flex flex-row justify-between border-b-2 pb-2 border-mantle max-w-full items-center gap-2'>
            {children}
            {children == undefined && <div></div>}
            <span className='font-semibold grow align-middle break-all text-center'>
                {title}
            </span>
            <Tooltip placement="bottom-end" content="Collapse" className="tooltip flex-none" >
                <button onClick={onCollapse} >
                    <Image src={collapseImg} height={32} width={32} alt="Collapse" className='transition-all' />
                </button>
            </Tooltip>
        </div>
    )
}

export default ChatHeader;