import styles from '../Chat.module.css';
import { useChatBarContext } from '@/app/context/ChatBarContextProvider';
import { ChannelModel, ChannelType } from '@/app/utils/models';
import { useEffect } from 'react';

type ChannelProps = {
    channel: ChannelModel
}

const DirectMessageChannel = ({channel :{type, id, unreadMessages, directMessageTargetUsername}}: ChannelProps) => {
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
                    ${type == ChannelType.Public && "bg-blue text-base"} 
                    ${type == ChannelType.Protected && "bg-yellow text-base"}
                    ${type == ChannelType.DirectMessage && "bg-green text-base"}
                    rounded-[inherit] w-[inherit] h-[inherit] relative`}>
                <p className='text-xs'>{directMessageTargetUsername}</p>
            {unreadMessages > 0 && 
                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold 
                    text-text bg-rose-500 border-2 border-base rounded-full -top-2 -right-2">
                    {unreadMessages}
                </div>
            }
            </button>
        </li>
    );
}

export default DirectMessageChannel;