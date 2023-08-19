import Image from 'next/image';
import collapseImg from "../../../../../public/collapse-left-svgrepo-com.svg"

type ChatHeaderProps = {
    title: string,
    onCollapse: () => void,
    children?: React.ReactNode
}

const ChatHeader = ({title, onCollapse, children}: ChatHeaderProps) => {
    return (
        <div className='flex flex-row justify-between border-b-2 pb-2 border-mantle'>
            {children}
            {children == undefined && <div></div>}
            <span className='font-semibold align-middle pt-2 pr-2'>
                {title}
            </span>
            <button onClick={onCollapse} >
                <Image src={collapseImg} height={32} width={32} alt="Collapse" className='transition-all' />
            </button>
        </div>
    )
}

export default ChatHeader;