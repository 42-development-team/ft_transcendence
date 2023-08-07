import { useChatBarContext } from "@/app/context/ChatBarContextProvider";
import collapseImg from "../../../../../public/collapse-left-svgrepo-com.svg"
import Image from 'next/image';

const JoinChannel = () => {

    const {toggleChannelJoinVisibility} = useChatBarContext();
    
    return (
        <div className='w-full min-w-[450px] max-w-[450px] px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
            <div className='flex flex-row justify-between border-b-2 pb-2 border-mantle'>
                <span className='font-semibold align-middle pl-2 pt-2'>
                    Join a channel
                </span>
                <button onClick={toggleChannelJoinVisibility} >
                    <Image src={collapseImg} height={32} width={32} alt="Collapse" className='transition-all' />
                </button>
            </div>
            <div className='overflow-auto h-[86vh]'>
                
                <div className='flex items-center justify-around py-2 my-2 border-t-2 border-mantle'>
                    <span className='font-semibold text-sm'>
                        Public channels 📢
                    </span>
                </div>
                <div className='flex items-center justify-around py-2 my-2 border-t-2 border-mantle'>
                    <span className='font-semibold text-sm'>
                        Private channels 🔒
                    </span>
                </div>
                
                {/* {friendsList} */}
            </div>
        </div>
    )
}

export default JoinChannel;