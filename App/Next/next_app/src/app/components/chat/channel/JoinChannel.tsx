import { useChatBarContext } from "@/app/context/ChatBarContextProvider";
import collapseImg from "../../../../../public/collapse-left-svgrepo-com.svg"
import Image from 'next/image';
import { useEffect } from "react";
import { UserStatus } from "@/app/utils/models";
import ChannelItem from "./ChannelItem";

const JoinChannel = () => {

    const {toggleChannelJoinVisibility} = useChatBarContext();

    // const getChannels = async () => {
    //     console.log("Load channel list");
    //     try {
    //         const response = await fetch(`${process.env.BACK_URL}/auth/profile`, { credentials: "include" });
    //         const data = await response.json();
    //         console.log(data);
    //     }
    //     catch (err) {
    //         console.log(err);
    //     }
    // }

    useEffect(() => {
        // getChannels();
    }, [])
    
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
                {/* List of public channels */}
                {/* <ChannelItem channel={{id:"1", name: 'General', icon: ''}} /> */}
                <div className='flex items-center justify-around py-2 my-2 border-t-2 border-mantle'>
                    <span className='font-semibold text-sm'>
                        Private channels 🔒
                    </span>
                </div>
                {/* List of private channels */}
                {/* <ChannelItem channel={{id:"1", name: 'Private 1', icon: ''}} /> */}
                {/* <ChannelItem channel={{id:"1", name: 'Private 2', icon: ''}} /> */}
            </div>
        </div>
    )
}

export default JoinChannel;