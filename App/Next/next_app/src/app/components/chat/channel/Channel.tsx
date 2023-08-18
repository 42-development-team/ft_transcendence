import styles from '../Chat.module.css';
import Image from "next/image";
import { useChatBarContext } from '@/app/context/ChatBarContextProvider';
import { ChannelModel } from '@/app/utils/models';
import { useEffect } from 'react';

type ChannelProps = {
    channel: ChannelModel
}

const Channel = ({channel :{name, icon, type, id, unreadMessages}}: ChannelProps) => {
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
            <button onClick={handleClick} 
                className={`
                    ${type == "public" && "bg-blue text-base"} 
                    ${type == "protected" && "bg-yellow text-base"}
                    rounded-[inherit] w-[inherit] h-[inherit] relative`}>
                {icon === '' ?
                    <p className='text-xs'>{name}</p> :
                    <Image alt="Channel Icon" fill src={icon} 
                    sizes=" 100vw, 100vw"
                    className="rounded-[inherit]" />
                }
                <h4 className={styles.channelName} >{name}</h4>
            {unreadMessages > 0 && 
                <p className='text-red'>{unreadMessages}</p>
            }
            </button>
        </li>
    );
}

export default Channel;