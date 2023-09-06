import styles from '../Chat.module.css';
import Image from "next/image";
import { useChatBarContext } from '@/app/context/ChatBarContextProvider';
import { ChannelModel, ChannelType } from '@/app/utils/models';
import { useEffect } from 'react';
import { Tooltip } from '@material-tailwind/react';

type ChannelProps = {
    channel: ChannelModel
}

const Channel = ({channel :{name, type, id, unreadMessages}}: ChannelProps) => {
    const { openChannel, openChannelId } = useChatBarContext();

    const handleClick = () => {
        openChannel(id);
    }

    useEffect(() => {
        if (unreadMessages != 0 && openChannelId == id) {
           unreadMessages = 0; 
        }
    }, [unreadMessages]);

    return (
        <li className={styles.channelItem}>
            <Tooltip placement="right" content={name} className="tooltip" offset={8}>
                <button onClick={handleClick} 
                    className={`
                        ${type == ChannelType.Public && "bg-blue text-base"} 
                        ${type == ChannelType.Protected && "bg-yellow text-base"}
                        ${type == ChannelType.DirectMessage && "bg-green text-base"}
                        rounded-[inherit] w-[inherit] h-[inherit] relative p-1`}>
                    <p className='text-xs break-keep'>{name}</p>
                {unreadMessages > 0 && 
                    <div className="absolute inline-flex items-center justify-center 
                        h-6 min-w-6 px-0.5
                        text-xs font-bold 
                        text-text bg-rose-500 border-2 border-base rounded-full -top-2 -right-2">
                        {unreadMessages}
                    </div>
                }
                </button>
            </Tooltip>
        </li>
    );
}

export default Channel;