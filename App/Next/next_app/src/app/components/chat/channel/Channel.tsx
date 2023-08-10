import styles from '../Chat.module.css';
import Image from "next/image";
import { ChatBarState, useChatBarContext } from '@/app/context/ChatBarContextProvider';
import { ChannelModel } from '@/app/utils/models';

type ChannelProps = {
    channel: ChannelModel
}

const Channel = ({channel :{name, icon}}: ChannelProps) => {
    const { setChatBarState } = useChatBarContext();
    return (
        <li className={styles.channelItem}>
            <button onClick={() => setChatBarState(ChatBarState.ChatOpen)} className='rounded-[inherit] w-[inherit] h-[inherit] relative'>
                {icon === '' ?
                    <p className='text-xs'>{name}</p> :
                    <Image alt="Channel Icon" fill src={icon} 
                    sizes=" 100vw, 100vw"
                    className="rounded-[inherit]" />
                }
                <h4 className={styles.channelName} >{name}</h4>
            </button>
        </li>
    );
}

export default Channel;